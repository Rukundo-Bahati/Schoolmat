"use client"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X, Star, ShoppingCart } from "lucide-react"
import { type Product } from "@/lib/api"
import { PurchaseCelebration } from "@/components/purchase-celebration"

interface ProductDetailsModalProps {
  product: Product | null
  isOpen: boolean
  onClose: () => void
  onViewPurchase: (product: Product) => void
  onAddToCart?: (product: Product) => void
}

export function ProductDetailsModal({ product, isOpen, onClose, onViewPurchase, onAddToCart }: ProductDetailsModalProps) {
  const router = useRouter()
  const [showCelebration, setShowCelebration] = useState(false)

  if (!isOpen || !product) return null

  const handlePurchaseClick = () => {
    router.push(`/product/${product.id}`)
    onClose()
  }

  const handleAddToCartClick = () => {
    if (onAddToCart) {
      onAddToCart(product)
      setShowCelebration(true)
    }
  }

  const handleCelebrationComplete = () => {
    setShowCelebration(false)
    router.push('/products')
  }

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Product Details</h2>
            <Button variant="ghost" size="sm" onClick={onClose} className="rounded-full p-2">
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Product Image */}
              <div className="space-y-4">
                <div className="relative">
                  <img
                    src={product.image || "/placeholder.jpg"}
                    alt={product.name}
                    className="w-full h-96 object-cover rounded-lg"
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder.jpg";
                    }}
                  />
                  {product.required && (
                    <Badge className="absolute top-3 right-3 bg-yellow-500 text-gray-900">Required</Badge>
                  )}
                </div>
              </div>

              {/* Product Details */}
              <div className="space-y-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h1>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < (product.rating || 4) ? "text-yellow-400 fill-current" : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">({product.reviews || 127} reviews)</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-bold text-blue-700">RWF {product.price}</span>
                    <Badge
                      variant={product.inStock !== false ? "default" : "destructive"}
                      className="bg-green-100 text-green-800"
                    >
                      {product.inStock !== false ? "In Stock" : "Out of Stock"}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-semibold text-gray-900">Description</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {product.description ||
                        `High-quality ${product.name.toLowerCase()} perfect for students. Durable construction and excellent value for money. Essential for academic success and daily school activities.`}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-semibold text-gray-900">Features</h3>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Premium quality materials</li>
                      <li>• Durable and long-lasting</li>
                      <li>• Perfect for school use</li>
                      <li>• Affordable pricing</li>
                    </ul>
                  </div>
                </div>

                <div className="flex gap-4 pt-6">
                  {onAddToCart && (
                    <Button
                      onClick={handleAddToCartClick}
                      variant="outline"
                      className="flex-1 rounded-full border-blue-600 text-blue-600 hover:bg-blue-50 py-3 text-lg"
                      disabled={product.inStock === false}
                    >
                      <ShoppingCart className="h-5 w-5 mr-2" />
                      Add to Cart
                    </Button>
                  )}
                  <Button
                    onClick={handlePurchaseClick}
                    className="flex-1 rounded-full bg-blue-700 hover:bg-blue-800 py-3 text-lg"
                    disabled={product.inStock === false}
                  >
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    Purchase Now
                  </Button>
                  <Button variant="outline" onClick={onClose} className="rounded-full bg-transparent px-6">
                    Continue Shopping
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <PurchaseCelebration show={showCelebration} onComplete={handleCelebrationComplete} productName={product.name} />
    </>
  )
}
