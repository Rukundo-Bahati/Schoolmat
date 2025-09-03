"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Search, ShoppingCart, User, Plus, Minus, Trash2, ArrowLeft, Facebook, Twitter, Instagram, Loader2 } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { fetchCartItems, updateCartItem, removeFromCart, getCartTotal, type CartItem as BackendCartItem } from "@/lib/api"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

// Frontend CartItem interface
interface CartItem {
  id: number
  name: string
  price: string
  image: string
  quantity: number
  required: boolean
  cartItemId: string // Backend cart item ID - now required since we need it for API calls
}

export default function CartPage() {
  const router = useRouter()
  const { user, token, isLoading: authLoading } = useAuth()
  const [showRemoveAnimation, setShowRemoveAnimation] = useState<number | null>(null)
  const [showUpdateAnimation, setShowUpdateAnimation] = useState<number | null>(null)
  const [cartItemsState, setCartItemsState] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Mapping function from backend to frontend format
  const mapBackendToFrontend = (backendItems: BackendCartItem[]): CartItem[] => {
    return backendItems.map((item, index) => ({
      id: index + 1, // Use incremental ID for frontend
      name: item.name,
      price: typeof item.price === 'number' ? item.price.toString() : item.price, // Ensure price is string
      image: item.image || "/placeholder.jpg",
      quantity: item.quantity,
      required: false, // Backend doesn't have this field, default to false
      cartItemId: item.id, // Store backend cart item ID
    }))
  }

  // Fetch cart items on component mount
  useEffect(() => {
    const loadCartItems = async () => {
      if (!token) {
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        setError(null)
        const backendItems = await fetchCartItems(token)
        const frontendItems = mapBackendToFrontend(backendItems)
        setCartItemsState(frontendItems)
      } catch (err) {
        console.error('Error fetching cart items:', err)
        setError('Failed to load cart items. Please try again.')
      } finally {
        setIsLoading(false)
      }
    }

    if (!authLoading) {
      loadCartItems()
    }
  }, [token, authLoading])

  const updateQuantity = async (frontendId: number, change: number) => {
    const item = cartItemsState.find(item => item.id === frontendId)
    if (!item || !token) return

    const newQuantity = item.quantity + change
    if (newQuantity < 1) return

    setShowUpdateAnimation(frontendId)
    setTimeout(() => setShowUpdateAnimation(null), 1000)

    try {
      await updateCartItem(token, item.cartItemId, newQuantity)
      // Update local state optimistically
      setCartItemsState(prev =>
        prev.map(cartItem =>
          cartItem.id === frontendId
            ? { ...cartItem, quantity: newQuantity }
            : cartItem
        )
      )
    } catch (err) {
      console.error('Error updating quantity:', err)
      setError('Failed to update quantity. Please try again.')
    }
  }

  const removeItem = async (frontendId: number) => {
    const item = cartItemsState.find(item => item.id === frontendId)
    if (!item || !token) return

    setShowRemoveAnimation(frontendId)
    setTimeout(() => {
      setCartItemsState(prev => prev.filter(cartItem => cartItem.id !== frontendId))
      setShowRemoveAnimation(null)
    }, 500)

    try {
      await removeFromCart(token, item.cartItemId)
    } catch (err) {
      console.error('Error removing item:', err)
      setError('Failed to remove item. Please refresh the page.')
      // Revert the optimistic update
      setCartItemsState(prev => [...prev, item])
    }
  }

  // Keep the old updateQuantity for backward compatibility (will be removed)
  // Removed to avoid redeclaration error

  // Removed old removeItem to avoid redeclaration error

  const calculateSubtotal = () => {
    return cartItemsState.reduce((total, item) => {
      const price = parseFloat(item.price) || 0
      return total + price * item.quantity
    }, 0)
  }

  const subtotal = calculateSubtotal()
  // Remove VAT and shipping price as per request
  const totalItems = cartItemsState.reduce((sum, item) => sum + item.quantity, 0)
  const total = subtotal // Total is now the same as subtotal since we removed VAT and shipping

  const handleCheckout = () => {
    router.push("/checkout")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 w-full overflow-x-hidden">
      <Navbar />

      {/* Cart Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-6 rounded-full hover:bg-blue-50 transition-colors btn-enhanced"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Continue Shopping
        </Button>

        {/* Authentication Check */}
        {!token && !authLoading ? (
          <div className="text-center py-12">
            <User className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Please log in to view your cart</h3>
            <p className="text-gray-600 mb-6">You need to be logged in to access your shopping cart.</p>
            <Button
              onClick={() => router.push("/login")}
              className="rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 btn-enhanced"
            >
              Login
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8">
            {/* Cart Items - Left Side */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 animate-fade-in">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Shopping Cart</h1>

                {isLoading ? (
                  <div className="text-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
                    <p className="text-gray-600">Loading your cart...</p>
                  </div>
                ) : error ? (
                  <div className="text-center py-12">
                    <div className="text-red-500 mb-4">⚠️ {error}</div>
                    <Button
                      onClick={() => window.location.reload()}
                      className="rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 btn-enhanced"
                    >
                      Try Again
                    </Button>
                  </div>
                ) : cartItemsState.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingCart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Your cart is empty</h3>
                  <p className="text-gray-600 mb-6">Add some school supplies to get started!</p>
                  <Button
                    onClick={() => router.push("/")}
                    className="rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 btn-enhanced"
                  >
                    Start Shopping
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {cartItemsState.map((item) => (
                    <div
                      key={item.id}
                      className={`flex items-center gap-4 p-4 border-2 rounded-2xl hover:shadow-lg transition-all duration-300 animate-slide-up ${
                        showRemoveAnimation === item.id ? "animate-fade-out scale-95" : ""
                      } ${showUpdateAnimation === item.id ? "animate-pulse border-green-400" : "border-gray-200"}`}
                    >
                      <div className="relative overflow-hidden rounded-xl group">
                        <img
                          src={item.image || "/placeholder.jpg"}
                          alt={item.name}
                          className="w-16 h-16 sm:w-20 sm:h-20 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>

                      <div className="flex-1 space-y-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-gray-900 text-sm sm:text-base">{item.name}</h3>
                            {item.required && (
                              <Badge className="mt-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 text-xs animate-pulse">
                                Required
                              </Badge>
                            )}
                          </div>
                          <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeItem(item.id)}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full p-1 sm:p-2 transition-colors btn-enhanced"
                            >
                              <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                            </Button>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="flex items-center border-2 border-blue-200 rounded-full bg-blue-50">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => updateQuantity(item.id, -1)}
                                disabled={item.quantity <= 1}
                                className="rounded-full p-1 sm:p-2 hover:bg-blue-100 transition-colors"
                              >
                                <Minus className="h-2 w-2 sm:h-3 sm:w-3" />
                              </Button>
                              <span className="font-medium px-2 sm:px-3 text-blue-700 text-xs sm:text-sm">{item.quantity}</span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => updateQuantity(item.id, 1)}
                                className="rounded-full p-1 sm:p-2 hover:bg-blue-100 transition-colors"
                              >
                                <Plus className="h-2 w-2 sm:h-3 sm:w-3" />
                              </Button>
                            </div>
                          </div>

                          <div className="text-right">
                            <p className="text-xs sm:text-sm text-gray-600">RWF {parseFloat(item.price).toLocaleString()} each</p>
                            <p className="font-bold text-gradient-primary text-sm sm:text-base">
                              RWF {(parseFloat(item.price) * item.quantity).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Order Summary - Right Side */}
          <div className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl animate-slide-up">
              <CardContent className="p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">Order Summary</h2>

                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Total Items:</span>
                    <span className="font-medium">{totalItems} items</span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-medium">RWF {subtotal.toLocaleString()}</span>
                  </div>

                  {/* Removed Shipping and VAT as per request */}
                  {/* <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping:</span>
                    <span className="font-medium">
                      {shipping === 0 ? (
                        <span className="text-green-600 font-bold">Free</span>
                      ) : (
                        `RWF ${shipping.toLocaleString()}`
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">VAT (18%):</span>
                    <span className="font-medium">RWF {tax.toLocaleString()}</span>
                  </div> */}

                  {/* Removed free shipping message as shipping is not required */}
                  {/* {shipping === 0 && (
                    <div className="text-xs text-green-600 bg-gradient-to-r from-green-50 to-emerald-50 p-3 rounded-xl border border-green-200 animate-pulse">
                      🎉 You qualify for free shipping!
                    </div>
                  )} */}

                  <div className="border-t pt-4">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total:</span>
                      <span className="text-gradient-primary">RWF {total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handleCheckout}
                  disabled={cartItemsState.length === 0}
                  className="w-full mt-6 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 btn-enhanced ripple"
                >
                  Proceed to Checkout
                </Button>

                <div className="mt-4 space-y-1 sm:space-y-2 text-xs text-gray-600">
                  <p>• Secure checkout with SSL encryption</p>
                  <p>• Free delivery within Kigali</p>
                  <p>• 30-day return policy</p>
                  <p>• Customer support: +250 788 123 456</p>
                </div>
              </CardContent>
            </Card>

            {/* Promo Code */}
            <Card className="bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl animate-slide-up">
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-2 sm:mb-3 text-sm sm:text-base">Promo Code</h3>
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter promo code"
                    className="rounded-full border-2 focus:border-blue-400 transition-colors"
                  />
                  <Button
                    variant="outline"
                    className="rounded-full bg-transparent border-2 border-blue-600 text-blue-600 hover:bg-blue-50 btn-enhanced"
                  >
                    Apply
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
