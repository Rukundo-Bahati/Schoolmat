"use client"

import { useState, useMemo, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ProductDetailsModal } from "@/components/product-details-modal"
import {
  Search,
  ShoppingCart,
  User,
  Star,
  Filter,
  ChevronLeft,
  ChevronRight,
  Facebook,
  Twitter,
  Instagram,
} from "lucide-react"
import { fetchProducts, fetchCategories, fetchProductsByCategory, getCartTotal, addToCart, type Product, type SchoolManagerProduct } from "@/lib/api"
import { useAuth } from "@/lib/auth-context"
import { PartyCelebration } from "@/components/party-celebration"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

export default function ProductsPage() {
  const router = useRouter()
  const { token } = useAuth()
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [sortBy, setSortBy] = useState("name")
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<string[]>(["All"])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [cartCount, setCartCount] = useState(0)
  const searchParams = useSearchParams()
  const [showCelebration, setShowCelebration] = useState(false)
  const [celebrationProductName, setCelebrationProductName] = useState<string | undefined>(undefined)

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        setError(null)

        // Fetch categories
        const fetchedCategories = await fetchCategories()
        if (fetchedCategories && fetchedCategories.length > 0) {
          const categoryNames = ["All", ...fetchedCategories.map((cat) => cat.name)]
          setCategories(categoryNames)

          // Fetch products
          const category = searchParams.get('category')
          let fetchedProducts: Product[]
          if (category && category !== "All" && categoryNames.includes(category)) {
            const schoolProducts = await fetchProductsByCategory(category)
            fetchedProducts = schoolProducts.map((product) => ({
              id: product.id,
              name: product.name,
              price: product.price.toString(),
              image: product.imageUrl || '/placeholder.jpg',
              required: product.required || false,
              description: product.description || '',
              rating: 4.5,
              reviews: 0,
              inStock: product.stock > 0,
              category: product.category,
            }))
            setSelectedCategory(category)
          } else {
            fetchedProducts = await fetchProducts()
          }
          setProducts(fetchedProducts)
        } else {
          // Fallback
          const fetchedProducts = await fetchProducts()
          setProducts(fetchedProducts)
          setCategories(["All"])
        }
      } catch (err) {
        setError('Failed to load data')
        console.error('Error loading data:', err)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [searchParams])

  // Fetch cart count
  useEffect(() => {
    const loadCartCount = async () => {
      if (!token) {
        setCartCount(0)
        return
      }

      try {
        const cartTotal = await getCartTotal(token)
        setCartCount(cartTotal.totalItems)
      } catch (err) {
        console.error('Error fetching cart count:', err)
        setCartCount(0)
      }
    }

    loadCartCount()
  }, [token])
  const [currentPage, setCurrentPage] = useState(1)
  const [showRequired, setShowRequired] = useState(false)
  const [animatingProduct, setAnimatingProduct] = useState<number | null>(null)
  const itemsPerPage = 8 // Show 2 rows (4 products per row)



  const filteredAndSortedProducts = useMemo(() => {
    const filtered = products.filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = selectedCategory === "All" || product.category === selectedCategory
      const matchesRequired = !showRequired || product.required
      return matchesSearch && matchesCategory && matchesRequired
    })

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return Number.parseInt(a.price.replace(",", "")) - Number.parseInt(b.price.replace(",", ""))
        case "price-high":
          return Number.parseInt(b.price.replace(",", "")) - Number.parseInt(a.price.replace(",", ""))
        case "rating":
          return (b.rating || 0) - (a.rating || 0)
        case "name":
        default:
          return a.name.localeCompare(b.name)
      }
    })

    return filtered
  }, [products, searchQuery, selectedCategory, sortBy, showRequired])

  const totalPages = Math.ceil(filteredAndSortedProducts.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedProducts = filteredAndSortedProducts.slice(startIndex, startIndex + itemsPerPage)

  const handleViewProduct = (product: Product) => {
    setAnimatingProduct(Number(product.id))
    setTimeout(() => {
      setSelectedProduct(product)
      setIsModalOpen(true)
      setAnimatingProduct(null)
    }, 300)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedProduct(null)
  }

  const handleViewPurchase = (product: Product) => {
    router.push(`/product/${product.id}`)
  }

  const handleAddToCart = async (product: Product) => {
    if (!token) {
      router.push("/login")
      return
    }

    try {
      await addToCart(token, product.id, 1) // Use product id as string
      // Refresh cart count
      const cartTotal = await getCartTotal(token)
      setCartCount(cartTotal.totalItems)
      // Show success animation or message
      setCelebrationProductName(product.name)
      setShowCelebration(true)
      setTimeout(() => {
        setShowCelebration(false)
        router.push('/products')
      }, 3000)
      console.log("Added to cart:", product.name)
    } catch (err) {
      console.error("Error adding to cart:", err)
      // Could show error message to user
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center text-red-600">
          <p>{error}</p>
          <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded">
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="mb-4 sm:mb-8 animate-fade-in">
          <h1 className="text-3xl sm:text-4xl font-bold text-gradient-primary mb-1 sm:mb-2">All Products</h1>
          <p className="text-gray-600 text-base sm:text-lg">Find everything you need for school success</p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-3 sm:p-6 mb-4 sm:mb-8 animate-slide-up">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            <div className="md:hidden">
              <Input
                placeholder="Search products..."
                className="rounded-full border-2 focus:border-blue-400 transition-colors"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full rounded-full border-2 border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-400 transition-colors"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full rounded-full border-2 border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-400 transition-colors"
              >
                <option value="name">Name (A-Z)</option>
                <option value="price-low">Price (Low to High)</option>
                <option value="price-high">Price (High to Low)</option>
                <option value="rating">Rating (High to Low)</option>
              </select>
            </div>

            <div className="flex items-center space-x-2 pt-6">
              <input
                type="checkbox"
                id="required"
                checked={showRequired}
                onChange={(e) => setShowRequired(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="required" className="text-sm font-medium text-gray-700">
                Required items only
              </label>
            </div>
          </div>

          <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t flex flex-col sm:flex-row items-start sm:items-center justify-between">
            <p className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-0">
              Showing {paginatedProducts.length} of {filteredAndSortedProducts.length} products
            </p>
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-600">Filters applied</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6 mb-4 sm:mb-8">
          {paginatedProducts.map((product, index) => (
            <Card
              key={product.id}
              className={`bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-500 rounded-2xl border-2 border-transparent hover:border-blue-200 animate-fade-in group ${Number(animatingProduct) === Number(product.id) ? "animate-pulse scale-105" : ""
                }`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-4">
                <div className="relative mb-3 overflow-hidden rounded-xl">
                  <img
                    src={product.image || "/placeholder.jpg"}
                    alt={product.name}
                    className="w-full h-36 sm:h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder.jpg";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                  {product.required && (
                    <Badge className="absolute top-2 right-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 animate-pulse">
                      Required
                    </Badge>
                  )}
                  {!product.inStock && (
                    <Badge className="absolute top-2 left-2 bg-gradient-to-r from-red-500 to-red-600 text-white">
                      Out of Stock
                    </Badge>
                  )}
                </div>

                <h3 className="font-semibold text-gray-900 mb-1 sm:mb-2 text-xs sm:text-sm group-hover:text-blue-700 transition-colors">
                  {product.name}
                </h3>

                <div className="flex items-center gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-3 w-3 transition-colors ${i < (product.rating || 4) ? "text-yellow-400 fill-current" : "text-gray-300"
                        }`}
                    />
                  ))}
                  <span className="text-xs text-gray-600 ml-1">({product.reviews})</span>
                </div>

                <p className="text-base sm:text-lg font-bold text-gradient-primary mb-2 sm:mb-3">RWF {product.price}</p>

                <Button
                  onClick={() => handleViewProduct(product)}
                  className="w-full rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-xs sm:text-sm py-1 sm:py-2 btn-enhanced ripple"
                  disabled={!product.inStock}
                >
                  {product.inStock ? "View Product" : "Out of Stock"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredAndSortedProducts.length === 0 && (
          <div className="text-center py-6 sm:py-12 animate-fade-in">
            <Search className="h-12 w-12 sm:h-16 sm:w-16 text-gray-300 mx-auto mb-2 sm:mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your search or filter criteria</p>
            <Button
              onClick={() => {
                setSearchQuery("")
                setSelectedCategory("All")
                setShowRequired(false)
              }}
              className="rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 btn-enhanced"
            >
              Clear Filters
            </Button>
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-center space-x-1 sm:space-x-2 animate-fade-in">
            <Button
              variant="outline"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="rounded-full border-2 border-blue-600 text-blue-600 hover:bg-blue-50 btn-enhanced"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            {[...Array(totalPages)].map((_, i) => (
              <Button
                key={i + 1}
                variant={currentPage === i + 1 ? "default" : "outline"}
                onClick={() => setCurrentPage(i + 1)}
                className={`rounded-full w-8 h-8 sm:w-10 sm:h-10 text-xs sm:text-sm btn-enhanced ${currentPage === i + 1
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  : "border-2 border-blue-600 text-blue-600 hover:bg-blue-50"
                  }`}
              >
                {i + 1}
              </Button>
            ))}

            <Button
              variant="outline"
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="rounded-full border-2 border-blue-600 text-blue-600 hover:bg-blue-50 btn-enhanced"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      <Footer />

      <ProductDetailsModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onViewPurchase={handleViewPurchase}
        onAddToCart={handleAddToCart}
      />

      <PartyCelebration
        show={showCelebration}
        onComplete={() => {
          setShowCelebration(false)
          router.push('/products')
        }}
        productName={celebrationProductName}
      />
    </div>
  )
}
