import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Star } from "lucide-react";
import { featuredProducts, Product } from "@/lib/constants/products";

interface FeaturedProductsSectionProps {
  onViewProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

export default function FeaturedProductsSection({
  onViewProduct,
  onAddToCart,
}: FeaturedProductsSectionProps) {
  return (
    <section className="py-16 bg-gradient-to-br from-blue-700  to-blue-800 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        {[
          { left: "15%", top: "25%", delay: "0s" },
          { left: "85%", top: "45%", delay: "0.5s" },
          { left: "35%", top: "75%", delay: "1s" },
          { left: "65%", top: "15%", delay: "1.5s" },
          { left: "25%", top: "55%", delay: "2s" },
          { left: "75%", top: "35%", delay: "2.5s" },
          { left: "45%", top: "85%", delay: "3s" },
          { left: "55%", top: "5%", delay: "3.5s" },
        ].map((pos, i) => (
          <div
            key={i}
            className="absolute animate-float"
            style={{
              left: pos.left,
              top: pos.top,
              animationDelay: pos.delay,
            }}
          >
            <Star className="h-8 w-8 text-white" />
          </div>
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12 animate-slide-up">
          <h2 className="text-3xl font-bold text-white mb-4">
            Featured Products
          </h2>
          <p className="text-lg text-blue-100">
            Popular items chosen by students and parents
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {featuredProducts.map((product, index) => (
            <Card
              key={product.id}
              className="bg-white hover:shadow-2xl transition-all duration-300 card-enhanced group"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-4">
                <div className="relative mb-3 overflow-hidden rounded-lg">
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  {product.required && (
                    <Badge className="absolute top-2 right-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 animate-pulse">
                      Required
                    </Badge>
                  )}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2 text-sm group-hover:text-blue-600 transition-colors">
                  {product.name}
                </h3>
                <p className="text-lg font-bold text-gradient-primary mb-3">
                  RWF {product.price}
                </p>
                <div className="space-y-2">
                  <Button
                    onClick={() => onViewProduct(product)}
                    className="w-full rounded-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-sm btn-enhanced"
                  >
                    View Product
                  </Button>
                  <Button
                    onClick={() => onAddToCart(product)}
                    variant="outline"
                    className="w-full rounded-full border-blue-600 text-blue-600 hover:bg-blue-50 text-sm btn-enhanced"
                  >
                    <ShoppingCart className="h-3 w-3 mr-2" />
                    Add to Cart
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
