"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, ShoppingCart, User, Star, Plus, Minus, ArrowLeft } from "lucide-react"

interface Product {
  id: number
  name: string
  price: string
  image: string
  required: boolean
  description?: string
  rating?: number
  reviews?: number
  inStock?: boolean
}

export default function ProductPurchasePage() {
  const params = useParams()
  const router = useRouter()
  const [quantity, setQuantity] = useState(1)
  const [cartItems, setCartItems] = useState(3)
  const [showCartAnimation, setShowCartAnimation] = useState(false)
  const [showPurchaseCelebration, setShowPurchaseCelebration] = useState(false)

  const featuredProducts: Product[] = [
    {
      id: 1,
      name: "Premium School Backpack",
      price: "15,000",
      image: "/premium-blue-school-backpack.png",
      required: true,
      rating: 5,
      reviews: 89,
      inStock: true,
      description:
        "Spacious and durable backpack with multiple compartments, padded straps, and water-resistant material. Perfect for carrying books, supplies, and electronics safely.",
    },
    {
      id: 2,
      name: "Scientific Calculator",
      price: "8,500",
      image: "/scientific-calculator.png",
      required: false,
      rating: 4,
      reviews: 156,
      inStock: true,
      description:
        "Advanced scientific calculator with 240+ functions, perfect for mathematics, physics, and engineering courses. Features a clear display and intuitive button layout.",
    },
  ]

  const product = featuredProducts.find((p) => p.id === Number.parseInt(params.id as string)) || featuredProducts[0]

  const handleQuantityChange = (change: number) => {
    const newQuantity = quantity + change
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity)
    }
  }

  // Enhanced add to cart with animation
  const handleAddToCart = () => {
    setCartItems(cartItems + quantity)
    setShowCartAnimation(true)
    console.log("[v0] Added to cart:", { product: product.name, quantity })
  }

  // Enhanced buy now with celebration animation
  const handleBuyNow = () => {
    setShowPurchaseCelebration(true)
    console.log("[v0] Buy now:", { product: product.name, quantity })
  }

  const totalPrice = (Number.parseInt(product.price.replace(",", "")) * quantity).toLocaleString()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navbar */}
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

              <Button
                variant="ghost"
                size="sm"
                className="relative rounded-full hover:bg-blue-50 transition-colors"
                onClick={() => router.push("/cart")}
              >
                <ShoppingCart className="h-5 w-5" />
                <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 text-xs animate-pulse">
                  {cartItems}
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

      {/* Product Purchase Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-6 rounded-full hover:bg-blue-50 transition-colors btn-enhanced"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Products
        </Button>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 animate-fade-in">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Image - Left Side */}
            <div className="space-y-4">
              <div className="relative overflow-hidden rounded-2xl group">
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  className="w-full h-96 object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {product.required && (
                  <Badge className="absolute top-4 right-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 animate-pulse">
                    Required
                  </Badge>
                )}
                {/* Added image overlay effect */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>

              {/* Additional product images */}
              <div className="grid grid-cols-4 gap-2">
                {[1, 2, 3, 4].map((i) => (
                  <img
                    key={i}
                    src={product.image || "/placeholder.svg"}
                    alt={`${product.name} view ${i}`}
                    className="w-full h-20 object-cover rounded-lg border-2 border-transparent hover:border-blue-500 cursor-pointer transition-all duration-300 hover:scale-105"
                  />
                ))}
              </div>
            </div>

            {/* Product Details - Right Side */}
            <div className="space-y-6 animate-slide-up">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-3">{product.name}</h1>

                {/* Quality Review Stars */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 transition-colors ${
                          i < (product.rating || 4) ? "text-yellow-400 fill-current" : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">
                    {product.rating || 4}.0 ({product.reviews || 127} reviews)
                  </span>
                </div>
              </div>

              {/* Price */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-4xl font-bold text-gradient-primary">RWF {product.price}</span>
                  <Badge
                    variant={product.inStock !== false ? "default" : "destructive"}
                    className="bg-gradient-to-r from-green-400 to-emerald-500 text-white animate-pulse"
                  >
                    {product.inStock !== false ? "In Stock" : "Out of Stock"}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600">Price per unit</p>
              </div>

              {/* Description */}
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900">Description</h3>
                <p className="text-gray-600 leading-relaxed">{product.description}</p>
              </div>

              {/* Features */}
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900">Key Features</h3>
                <ul className="text-sm text-gray-600 space-y-2">
                  {[
                    "Premium quality materials",
                    "Durable and long-lasting",
                    "Perfect for school use",
                    "Affordable pricing",
                  ].map((feature, index) => (
                    <li
                      key={index}
                      className="flex items-center animate-fade-in"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <span className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mr-3"></span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Quantity Selector */}
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900">Quantity</h3>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center border-2 border-blue-200 rounded-full bg-blue-50">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleQuantityChange(-1)}
                      disabled={quantity <= 1}
                      className="rounded-full p-2 hover:bg-blue-100 transition-colors"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="px-4 py-2 font-semibold text-blue-700">{quantity}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleQuantityChange(1)}
                      disabled={quantity >= 10}
                      className="rounded-full p-2 hover:bg-blue-100 transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <span className="text-sm text-gray-600">Max 10 items</span>
                </div>
              </div>

              {/* Total Price */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-2xl border border-blue-200">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-900">Total Price:</span>
                  <span className="text-2xl font-bold text-gradient-primary">RWF {totalPrice}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                <Button
                  onClick={handleAddToCart}
                  variant="outline"
                  className="flex-1 rounded-full border-2 border-blue-600 text-blue-600 hover:bg-blue-50 bg-transparent btn-enhanced ripple"
                  disabled={product.inStock === false}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add to Cart
                </Button>
                <Button
                  onClick={handleBuyNow}
                  className="flex-1 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 btn-enhanced ripple"
                  disabled={product.inStock === false}
                >
                  Buy Now
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showCartAnimation && (
        <div className="fixed inset-0 pointer-events-none z-50">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="animate-bounce bg-green-500 text-white px-6 py-3 rounded-full shadow-lg">
              ✓ Added to Cart!
            </div>
          </div>
        </div>
      )}

      {showPurchaseCelebration && (
        <div className="fixed inset-0 pointer-events-none z-50">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="animate-pulse bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-8 py-4 rounded-full shadow-xl text-lg font-bold">
              🎉 Purchase Successful! 🎉
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gradient-to-r from-blue-900 to-purple-900 text-white py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <h3 className="text-xl font-bold">SchoolMart</h3>
              <p className="text-blue-200">Your trusted partner for school supplies in Rwanda.</p>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold">Quick Links</h4>
              <ul className="space-y-2 text-blue-200">
                <li>
                  <a href="/" className="hover:text-white transition-colors">
                    Home
                  </a>
                </li>
                <li>
                  <a href="/products" className="hover:text-white transition-colors">
                    Products
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Categories
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    About
                  </a>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold">Support</h4>
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
            <div className="space-y-4">
              <h4 className="font-semibold">Contact</h4>
              <div className="text-blue-200 space-y-2">
                <p>📞 +250 788 123 456</p>
                <p>✉️ info@schoolmart.rw</p>
                <p>📍 Kigali, Rwanda</p>
              </div>
            </div>
          </div>
          <div className="border-t border-blue-800 mt-8 pt-8 text-center text-blue-200">
            <p>&copy; 2024 SchoolMart. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
