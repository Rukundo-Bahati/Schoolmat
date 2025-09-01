"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
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
import { allProducts, categories, type Product } from "@/mock-data"

export default function ProductsPage() {
  const router = useRouter()
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [sortBy, setSortBy] = useState("name")
  const [currentPage, setCurrentPage] = useState(1)
  const [showRequired, setShowRequired] = useState(false)
  const [animatingProduct, setAnimatingProduct] = useState<number | null>(null)
  const itemsPerPage = 12



  const filteredAndSortedProducts = useMemo(() => {
    const filtered = allProducts.filter((product) => {
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
  }, [searchQuery, selectedCategory, sortBy, showRequired])

  const totalPages = Math.ceil(filteredAndSortedProducts.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedProducts = filteredAndSortedProducts.slice(startIndex, startIndex + itemsPerPage)

  const handleViewProduct = (product: Product) => {
    setAnimatingProduct(product.id)
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
                <a href="/products" className="text-blue-700 font-medium">
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
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
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
                  3
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold text-gradient-primary mb-2">All Products</h1>
          <p className="text-gray-600 text-lg">Find everything you need for school success</p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 mb-8 animate-slide-up">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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

          <div className="mt-4 pt-4 border-t flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Showing {paginatedProducts.length} of {filteredAndSortedProducts.length} products
            </p>
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-600">Filters applied</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
          {paginatedProducts.map((product, index) => (
            <Card
              key={product.id}
              className={`bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-500 rounded-2xl border-2 border-transparent hover:border-blue-200 animate-fade-in group ${
                animatingProduct === product.id ? "animate-pulse scale-105" : ""
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-4">
                <div className="relative mb-3 overflow-hidden rounded-xl">
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
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

                <h3 className="font-semibold text-gray-900 mb-2 text-sm group-hover:text-blue-700 transition-colors">
                  {product.name}
                </h3>

                <div className="flex items-center gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-3 w-3 transition-colors ${
                        i < (product.rating || 4) ? "text-yellow-400 fill-current" : "text-gray-300"
                      }`}
                    />
                  ))}
                  <span className="text-xs text-gray-600 ml-1">({product.reviews})</span>
                </div>

                <p className="text-lg font-bold text-gradient-primary mb-3">RWF {product.price}</p>

                <Button
                  onClick={() => handleViewProduct(product)}
                  className="w-full rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-sm btn-enhanced ripple"
                  disabled={!product.inStock}
                >
                  {product.inStock ? "View Product" : "Out of Stock"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredAndSortedProducts.length === 0 && (
          <div className="text-center py-12 animate-fade-in">
            <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
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
          <div className="flex items-center justify-center space-x-2 animate-fade-in">
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
                className={`rounded-full w-10 h-10 btn-enhanced ${
                  currentPage === i + 1
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

      <ProductDetailsModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onViewPurchase={handleViewPurchase}
      />
    </div>
  )
}
