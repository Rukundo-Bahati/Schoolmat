"use client"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Star, ShoppingCart } from "lucide-react"
import { type Product } from "@/lib/api"
import { PartyCelebration } from "@/components/party-celebration"

interface ProductDetailsModalProps {
  product: Product | null
  isOpen: boolean
  onClose: () => void
  onViewPurchase: (product: Product) => void
  onAddToCart?: (product: Product, quantity: number) => void
}

export function ProductDetailsModal({ product, isOpen, onClose, onViewPurchase, onAddToCart }: ProductDetailsModalProps) {
  const router = useRouter()
  const [showCelebration, setShowCelebration] = useState(false)

  const handleAddToCartClick = () => {
    if (onAddToCart && product) {
      onAddToCart(product, 1)
      setShowCelebration(true)
    }
  }

  const handleCelebrationComplete = () => {
    setShowCelebration(false)
    router.push('/products')
  }

  if (!product) return null

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="!max-w-[1200px] w-[96vw] max-h-[96vh] overflow-hidden flex flex-col p-0 sm:!max-w-[1200px]">
          <DialogHeader className="px-6 pt-6 pb-4 border-b">
            <DialogTitle className="text-2xl font-bold">Product Details</DialogTitle>
          </DialogHeader>

          <div className="px-6 pb-6 overflow-y-auto">
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
                  <Button variant="outline" onClick={onClose} className="rounded-full bg-transparent px-6">
                    Continue Shopping
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <PartyCelebration show={showCelebration} onComplete={handleCelebrationComplete} productName={product.name} />
    </>
  )
}
