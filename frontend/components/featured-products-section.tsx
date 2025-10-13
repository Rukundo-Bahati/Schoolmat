import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Star } from "lucide-react";
import { fetchFeaturedProducts } from "@/lib/api";

interface Product {
  id: string;
  name: string;
  price: string;
  image: string;
  required: boolean;
  description?: string;
  rating?: number;
  reviews?: number;
  inStock?: boolean;
}

interface FeaturedProductsSectionProps {
  onViewProduct: (product: Product) => void;
  onAddToCart: (product: Product, quantity: number) => void;
}

export default function FeaturedProductsSection({
  onViewProduct,
  onAddToCart,
}: FeaturedProductsSectionProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [displayCount, setDisplayCount] = useState(8); // Show 2 rows (4 products per row)

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchFeaturedProducts();
        setProducts(data);
      } catch (err) {
        setError('Failed to load featured products');
        console.error('Error loading products:', err);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const handleLoadMore = () => {
    setDisplayCount(prev => prev + 4); // Load 1 more row (4 products)
  };

  const visibleProducts = products.slice(0, displayCount);
  const hasMore = displayCount < products.length;

  if (loading) {
    return (
      <section className="py-16 bg-gradient-to-br from-blue-700 to-blue-800 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              Featured Products
            </h2>
            <p className="text-lg text-blue-100">
              Popular items chosen by students and parents
            </p>
          </div>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-gradient-to-br from-blue-700 to-blue-800 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              Featured Products
            </h2>
            <p className="text-lg text-blue-100">
              Popular items chosen by students and parents
            </p>
          </div>
          <div className="text-center text-red-300">
            <p>{error}</p>
          </div>
        </div>
      </section>
    );
  }
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

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6">
          {visibleProducts.map((product: Product, index: number) => (
            <Card
              key={product.id}
              className="bg-white hover:shadow-2xl transition-all duration-300 card-enhanced group"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-2 sm:p-4">
                <div className="relative mb-2 sm:mb-3 overflow-hidden rounded-lg">
                  <img
                    src={product.image || "/placeholder.jpg"}
                    alt={product.name}
                    className="w-full h-32 sm:h-40 md:h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder.jpg";
                    }}
                  />
                  {product.required && (
                    <Badge className="absolute top-1 right-1 sm:top-2 sm:right-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 animate-pulse text-xs sm:text-sm">
                      Required
                    </Badge>
                  )}
                </div>
                <h3 className="font-semibold text-gray-900 mb-1 sm:mb-2 text-xs sm:text-sm group-hover:text-blue-600 transition-colors line-clamp-2">
                  {product.name}
                </h3>
                <p className="text-base sm:text-lg font-bold text-gradient-primary mb-2 sm:mb-3">
                  RWF {product.price}
                </p>
                <div className="space-y-1 sm:space-y-2">
                  <Button
                    onClick={() => onViewProduct(product)}
                    className="w-full rounded-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-xs sm:text-sm btn-enhanced py-1 sm:py-2"
                  >
                    View Product
                  </Button>
                  <Button
                    onClick={() => onAddToCart(product, 1)}
                    variant="outline"
                    className="w-full rounded-full border-blue-600 text-blue-600 hover:bg-blue-50 text-xs sm:text-sm btn-enhanced py-1 sm:py-2"
                  >
                    <ShoppingCart className="h-3 w-3 mr-1 sm:mr-2" />
                    Add to Cart
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {hasMore && (
          <div className="text-center mt-8">
            <Button
              onClick={handleLoadMore}
              className="rounded-full bg-white text-blue-700 hover:bg-blue-300 px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl  transition-all"
            >
              Load More Products
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
