"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Search, ShoppingCart, User, Plus, Minus, Trash2, ArrowLeft, Loader2 } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { fetchCartItems, updateCartItem, removeFromCart, getCartTotal, type CartItem as BackendCartItem } from "@/lib/api"
import Navbar from "@/components/navbar"
import { useToast } from "@/hooks/use-toast"
import ProtectedRoute from "@/components/protected-route"

// Frontend CartItem interface
interface CartItem {
  id: string
  name: string
  price: number
  image: string
  quantity: number
  required: boolean
  description?: string
  rating?: number
  reviews?: number
  inStock?: boolean
  category?: string
  cartItemId?: string
}

export default function CartPage() {
  return (
    <ProtectedRoute>
      <CartPageContent />
    </ProtectedRoute>
  )
}

function CartPageContent() {
  const router = useRouter()
  const { toast } = useToast()
  const { user, token, isLoading: authLoading } = useAuth()
  const [showRemoveAnimation, setShowRemoveAnimation] = useState<string | null>(null)
  const [showUpdateAnimation, setShowUpdateAnimation] = useState<string | null>(null)
  const [cartItemsState, setCartItemsState] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [totalItems, setTotalItems] = useState(0)
  const [subtotal, setSubtotal] = useState(0)
  const [total, setTotal] = useState(0)

  // Mapping function from backend to frontend format
  const mapBackendToFrontend = (backendItems: any[]): CartItem[] => {
    // Ensure we have an array
    const items = Array.isArray(backendItems) ? backendItems : [];
    
    return items.map((item) => {
      // Check if this is a nested item structure (product inside cart item)
      const product = item.product || {};
      const itemId = item.id || item._id || '';
      
      return {
        id: itemId,
        name: item.productName || product.name || item.name || 'Unnamed Product',
        price: typeof (item.price || product.price || 0) === 'string' 
          ? parseFloat(item.price || product.price || 0) 
          : (item.price || product.price || 0),
        image: item.imageUrl || product.image || product.imageUrl || item.image || "/placeholder-product.png",
        quantity: item.quantity || 1,
        required: item.required || false,
        description: product.description || item.description,
        rating: typeof (product.rating || item.rating || 0) === 'string'
          ? parseFloat(product.rating || item.rating || 0)
          : (product.rating || item.rating || 0),
        reviews: product.reviews || item.reviews || 0,
        inStock: product.inStock !== false, // Default to true if not specified
        category: item.category || product.category || 'Uncategorized',
        cartItemId: itemId,
      };
    });
  }

  // Calculate cart totals
  const calculateTotals = (items: CartItem[]) => {
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = items.reduce((sum, item) => {
      // Ensure price is a number
      const price = typeof item.price === 'string' ? parseFloat(item.price) : item.price;
      return sum + (price * item.quantity);
    }, 0);
    
    setTotalItems(itemCount);
    setSubtotal(subtotal);
    setTotal(subtotal); // No tax or shipping for now
  };

  // Fetch cart items on component mount
  useEffect(() => {
    const loadCartItems = async () => {
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        console.log('Loading cart items...');
        setIsLoading(true);
        setError(null);
        
        // Fetch items from the API
        const backendItems = await fetchCartItems(token);
        console.log('Backend cart items:', backendItems);
        
        // Map to frontend format
        const frontendItems = mapBackendToFrontend(backendItems);
        console.log('Mapped frontend items:', frontendItems);
        
        // Update state
        setCartItemsState(frontendItems);
        calculateTotals(frontendItems);
        console.log('Cart items state updated with', frontendItems.length, 'items');
      } catch (err) {
        console.error('Error loading cart items:', err);
        setError('Failed to load cart items. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    if (!authLoading) {
      loadCartItems();
    }
  }, [token, authLoading]);

  // Update quantity for an item
  const updateQuantity = async (itemId: string, change: number) => {
    // Store original items for potential rollback
    const originalItems = [...cartItemsState];
    
    try {
      console.log('updateQuantity called with:', { itemId, change });
      
      const item = cartItemsState.find(item => item.id === itemId);
      if (!item) {
        console.error('Item not found in cart:', itemId);
        return;
      }
      
      if (!token) {
        console.error('No authentication token found');
        toast({
          title: "Authentication required",
          description: "Please log in to update your cart",
          variant: "destructive"
        });
        router.push('/login');
        return;
      }

      const newQuantity = item.quantity + change;
      if (newQuantity < 1) {
        console.log('Quantity cannot be less than 1');
        return;
      }

      console.log('Updating quantity:', { itemId, currentQuantity: item.quantity, newQuantity });
      setShowUpdateAnimation(itemId);
      
      // Optimistic update
      const updatedItems = cartItemsState.map(cartItem =>
        cartItem.id === itemId ? { ...cartItem, quantity: newQuantity } : cartItem
      );
      
      setCartItemsState(updatedItems);
      calculateTotals(updatedItems);
      
      try {
        console.log('Calling updateCartItem API...');
        await updateCartItem(token, itemId, newQuantity);
        console.log('Successfully updated cart item');
      } catch (apiError) {
        console.error('API Error in updateCartItem:', apiError);
        
        // Revert to original state
        setCartItemsState(originalItems);
        calculateTotals(originalItems);
        
        // Handle specific API errors
        if (apiError instanceof Error) {
          if (apiError.message.includes('authentication') || apiError.message.includes('Authorization')) {
            toast({
              title: "Session expired",
              description: "Please log in again to continue",
              variant: "destructive"
            });
            router.push('/login');
            return;
          } else if (apiError.message.includes('stock')) {
            toast({
              title: "Stock limit reached",
              description: "Cannot add more of this item due to stock limitations",
              variant: "destructive"
            });
            return;
          }
        }
        
        // Generic error handling
        toast({
          title: "Update failed",
          description: "Failed to update cart. Please try again.",
          variant: "destructive"
        });
        
        throw apiError; // Re-throw for outer catch to log
      }
    } catch (error) {
      console.error('Error in updateQuantity:', {
        error,
        itemId,
        change,
        cartItemCount: cartItemsState.length,
        hasToken: !!token
      });
      
      // Ensure we revert to original state (if not already done in inner catch)
      setCartItemsState(originalItems);
      calculateTotals(originalItems);
    } finally {
      setShowUpdateAnimation(null);
    }
  };

  // Remove an item from cart
  const removeItem = async (itemId: string) => {
    if (!token) {
      toast({
        title: "Authentication required",
        description: "Please log in to modify your cart",
        variant: "destructive"
      });
      router.push('/login');
      return;
    }

    setShowRemoveAnimation(itemId);
    
    try {
      // Store original items for rollback if needed
      const originalItems = [...cartItemsState];
      const itemToRemove = cartItemsState.find(item => item.id === itemId);
      
      if (!itemToRemove) {
        console.error('Item not found in cart:', itemId);
        return;
      }
      
      // Optimistic update
      const updatedItems = cartItemsState.filter(item => item.id !== itemId);
      setCartItemsState(updatedItems);
      calculateTotals(updatedItems);
      
      try {
        // Call the API to remove the item from the server
        await removeFromCart(token, itemId);
      } catch (apiError) {
        console.error('API Error removing item:', apiError);
        
        // Revert to original state
        setCartItemsState(originalItems);
        calculateTotals(originalItems);
        
        // Handle specific API errors
        if (apiError instanceof Error) {
          if (apiError.message.includes('authentication') || apiError.message.includes('Authorization')) {
            toast({
              title: "Session expired",
              description: "Please log in again to continue",
              variant: "destructive"
            });
            router.push('/login');
            return;
          }
        }
        
        // Generic error handling
        toast({
          title: "Remove failed",
          description: "Failed to remove item from cart. Please try again.",
          variant: "destructive"
        });
        
        throw apiError; // Re-throw for outer catch to log
      }
    } catch (error) {
      console.error('Error removing item:', error);
    } finally {
      // Wait for animation to complete before removing the animation state
      setTimeout(() => {
        setShowRemoveAnimation(null);
      }, 300);
    }
  };

  // Proceed to checkout
  const handleCheckout = () => {
    router.push('/checkout');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="text-gray-600 hover:bg-gray-100"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
          <h1 className="text-2xl font-bold text-gray-900 ml-4">Your Shopping Cart</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                <span className="ml-2 text-gray-600">Loading your cart...</span>
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                <p className="text-red-600 mb-4">{error}</p>
                <Button
                  onClick={() => window.location.reload()}
                  variant="outline"
                  className="border-red-200 text-red-600 hover:bg-red-50"
                >
                  Try Again
                </Button>
              </div>
            ) : cartItemsState.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
                <ShoppingCart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Your cart is empty</h3>
                <p className="text-gray-600 mb-6">Add some items to get started!</p>
                <Button
                  onClick={() => router.push("/")}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Continue Shopping
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                
                {cartItemsState.map((item) => (
                  <div
                    key={item.id}
                    className={`bg-white rounded-xl border-2 p-4 flex items-center gap-4 ${
                      showRemoveAnimation === item.id ? 'opacity-0 scale-95 transition-all duration-300' : ''
                    } ${
                      showUpdateAnimation === item.id ? 'border-blue-400' : 'border-gray-200'
                    }`}
                  >
                    <div className="w-20 h-20 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <h3 className="font-medium text-gray-900 truncate">{item.name}</h3>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(item.id)}
                          className="text-gray-400 hover:text-red-500 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <p className="text-sm text-gray-600 mt-1">
                        RWF {item.price.toLocaleString()}
                      </p>
                      
                      <div className="flex items-center mt-2">
                        <div className="flex items-center border rounded-lg overflow-hidden">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => updateQuantity(item.id, -1)}
                            disabled={item.quantity <= 1}
                            className="h-8 w-8 p-0 text-gray-600 hover:bg-gray-100"
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-10 text-center text-sm font-medium">
                            {item.quantity}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => updateQuantity(item.id, 1)}
                            className="h-8 w-8 p-0 text-gray-600 hover:bg-gray-100"
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Order Summary */}
          <div className="lg:sticky lg:top-4 h-fit">
            <Card className="bg-white border-2 border-gray-200 rounded-xl shadow-sm">
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
                
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal ({totalItems} items)</span>
                    <span className="font-medium">RWF {subtotal.toLocaleString()}</span>
                  </div>
                  
                  <div className="border-t pt-4">
                    <div className="flex justify-between font-semibold text-gray-900">
                      <span>Total</span>
                      <span>RWF {total.toLocaleString()}</span>
                    </div>
                  </div>
                  
                  <Button
                    onClick={handleCheckout}
                    disabled={cartItemsState.length === 0 || isLoading}
                    className="w-full mt-6 bg-blue-600 hover:bg-blue-700 h-12 text-base"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      'Proceed to Checkout'
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
