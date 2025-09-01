"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Search, ShoppingCart, User, Plus, Minus, Trash2, ArrowLeft, Facebook, Twitter, Instagram } from "lucide-react"
import { cartItems, type CartItem } from "@/mock-data"

export default function CartPage() {
  const router = useRouter()
  const [showRemoveAnimation, setShowRemoveAnimation] = useState<number | null>(null)
  const [showUpdateAnimation, setShowUpdateAnimation] = useState<number | null>(null)

  // Mock cart data - in real app this would come from state management/API
  const [cartItemsState, setCartItemsState] = useState<CartItem[]>(cartItems)

  const updateQuantity = (id: number, change: number) => {
    setShowUpdateAnimation(id)
    setTimeout(() => setShowUpdateAnimation(null), 1000)

    setCartItemsState((items) =>
      items.map((item) => {
        if (item.id === id) {
          const newQuantity = item.quantity + change
          return newQuantity > 0 ? { ...item, quantity: newQuantity } : item
        }
        return item
      }),
    )
  }

  const removeItem = (id: number) => {
    setShowRemoveAnimation(id)
    setTimeout(() => {
      setCartItemsState((items) => items.filter((item) => item.id !== id))
      setShowRemoveAnimation(null)
    }, 500)
  }

  const calculateSubtotal = () => {
    return cartItemsState.reduce((total, item) => {
      return total + Number.parseInt(item.price.replace(",", "")) * item.quantity
    }, 0)
  }

  const subtotal = calculateSubtotal()
  const shipping = subtotal > 50000 ? 0 : 2000 // Free shipping over 50,000 RWF
  const tax = Math.round(subtotal * 0.18) // 18% VAT
  const total = subtotal + shipping + tax

  const totalItems = cartItemsState.reduce((sum, item) => sum + item.quantity, 0)

  const handleCheckout = () => {
    router.push("/checkout")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <nav className="bg-white/80 backdrop-blur-md shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <div className="flex items-center">
                <span className="text-2xl font-bold">
                  <span className="text-gradient-primary">School</span>
                  <span className="text-gray-900">Mart</span>
                </span>
              </div>
              <div className="hidden md:flex items-center space-x-6">
                <a href="/" className="text-gray-700 hover:text-blue-700 font-medium transition-colors">
                  Home
                </a>
                <a href="/products" className="text-gray-700 hover:text-blue-700 font-medium transition-colors">
                  Products
                </a>
                <a href="#" className="text-gray-700 hover:text-blue-700 font-medium transition-colors">
                  Categories
                </a>
                <a href="#" className="text-gray-700 hover:text-blue-700 font-medium transition-colors">
                  About
                </a>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-2">
                <Input
                  placeholder="Search products..."
                  className="w-64 rounded-full border-2 focus:border-blue-400 transition-colors"
                />
                <Button
                  size="sm"
                  className="rounded-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 btn-enhanced"
                >
                  <Search className="h-4 w-4" />
                </Button>
              </div>

              <Button variant="ghost" size="sm" className="relative rounded-full hover:bg-blue-50 transition-colors">
                <ShoppingCart className="h-5 w-5" />
                <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 text-xs animate-pulse">
                  {totalItems}
                </Badge>
              </Button>

              <Button variant="ghost" size="sm" className="rounded-full hover:bg-blue-50 transition-colors">
                <User className="h-5 w-5" />
              </Button>

              <Button className="rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 btn-enhanced">
                Login
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Cart Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-6 rounded-full hover:bg-blue-50 transition-colors btn-enhanced"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Continue Shopping
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items - Left Side */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 animate-fade-in">
              <h1 className="text-2xl font-bold text-gray-900 mb-6">Shopping Cart</h1>

              {cartItemsState.length === 0 ? (
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
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          className="w-20 h-20 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>

                      <div className="flex-1 space-y-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-gray-900">{item.name}</h3>
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
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full p-2 transition-colors btn-enhanced"
                          >
                            <Trash2 className="h-4 w-4" />
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
                                className="rounded-full p-2 hover:bg-blue-100 transition-colors"
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="font-medium px-3 text-blue-700">{item.quantity}</span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => updateQuantity(item.id, 1)}
                                className="rounded-full p-2 hover:bg-blue-100 transition-colors"
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>

                          <div className="text-right">
                            <p className="text-sm text-gray-600">RWF {item.price} each</p>
                            <p className="font-bold text-gradient-primary">
                              RWF {(Number.parseInt(item.price.replace(",", "")) * item.quantity).toLocaleString()}
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
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Total Items:</span>
                    <span className="font-medium">{totalItems} items</span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-medium">RWF {subtotal.toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between text-sm">
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
                  </div>

                  {shipping === 0 && (
                    <div className="text-xs text-green-600 bg-gradient-to-r from-green-50 to-emerald-50 p-3 rounded-xl border border-green-200 animate-pulse">
                      🎉 You qualify for free shipping!
                    </div>
                  )}

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

                <div className="mt-4 space-y-2 text-xs text-gray-600">
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
                <h3 className="font-semibold text-gray-900 mb-3">Promo Code</h3>
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
      </div>

      <footer className="bg-gradient-to-r from-blue-900 to-purple-900 text-white py-12 border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <span className="text-2xl font-bold">
                  <span className="text-yellow-400">School</span>
                  <span className="text-white">Mart</span>
                </span>
              </div>
              <p className="text-blue-200 mb-4">Your trusted partner for all school supply needs in Rwanda.</p>
              <div className="flex space-x-4">
                <Button variant="ghost" size="sm" className="rounded-full p-2 hover:bg-blue-800 transition-colors">
                  <Facebook className="h-5 w-5 text-blue-300" />
                </Button>
                <Button variant="ghost" size="sm" className="rounded-full p-2 hover:bg-blue-800 transition-colors">
                  <Twitter className="h-5 w-5 text-blue-300" />
                </Button>
                <Button variant="ghost" size="sm" className="rounded-full p-2 hover:bg-blue-800 transition-colors">
                  <Instagram className="h-5 w-5 text-pink-300" />
                </Button>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-white mb-4">About Us</h3>
              <ul className="space-y-2 text-blue-200">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Our Story
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Mission
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Press
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-white mb-4">Support</h3>
              <ul className="space-y-2 text-blue-200">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Shipping Info
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Returns
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-white mb-4">Payment Methods</h3>
              <div className="space-y-2 text-blue-200">
                <p>📱 Mobile Money</p>
                <p>💳 Irembopay</p>
                <p>📞 USSD Payment</p>
                <p>🏦 Bank Transfer</p>
              </div>
            </div>
          </div>

          <div className="border-t border-blue-800 mt-8 pt-8 text-center text-blue-200">
            <p>&copy; 2024 SchoolMart. All rights reserved. | Privacy Policy | Terms of Service</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
