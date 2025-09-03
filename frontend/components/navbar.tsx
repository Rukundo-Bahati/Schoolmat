import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Search, User, Menu, X } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { useAuth } from "@/lib/auth-context";
import { getCartTotal } from "@/lib/api";
import { Product } from "@/lib/api";

export default function Navbar() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [cartCount, setCartCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    // Get token from localStorage
    const accessToken = localStorage.getItem('access_token');
    setToken(accessToken);
  }, []);

  useEffect(() => {
    const loadCartCount = async () => {
      if (!token) {
        setCartCount(0);
        return;
      }
      try {
        const cartTotal = await getCartTotal(token);
        setCartCount(cartTotal.totalItems);
      } catch (err) {
        console.error("Error fetching cart count:", err);
        setCartCount(0);
      }
    };
    loadCartCount();
  }, [token]);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.length > 0) {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/search?q=${query}`);
        if (response.ok) {
          const data = await response.json();
          setSearchResults(data);
        }
      } catch (error) {
        console.error('Error searching products:', error);
      }
    } else {
      setSearchResults([]);
    }
  };
  
  return (
    <nav className="bg-white/80 backdrop-blur-md shadow-sm border-b sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4 md:space-x-8">
            {/* Mobile menu button */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[250px] sm:w-[300px]">
                <SheetTitle className="text-lg font-bold">Navigation</SheetTitle>
                <div className="flex flex-col space-y-4 mt-8">
                  {token ? (
                    <a
                      href="/parent-dashboard"
                      className="text-gray-700 hover:text-blue-700 font-medium transition-colors py-2 px-4 rounded-md hover:bg-blue-50 md:hidden"
                    >
                      Dashboard
                    </a>
                  ) : (
                    <a
                      href="/register"
                      className="text-gray-700 hover:text-blue-700 font-medium transition-colors py-2 px-4 rounded-md hover:bg-blue-50 md:hidden"
                    >
                      Signup
                    </a>
                  )}
                  <a
                    href="/"
                    className="text-gray-700 hover:text-blue-700 font-medium transition-colors py-2 px-4 rounded-md hover:bg-blue-50"
                  >
                    Home
                  </a>
                  <a
                    href="/products"
                    className="text-gray-700 hover:text-blue-700 font-medium transition-colors py-2 px-4 rounded-md hover:bg-blue-50"
                  >
                    Products
                  </a>
                </div>
              </SheetContent>
            </Sheet>
            
            <div className="flex items-center">
              <span className="text-xl md:text-2xl font-bold">
                <span className="text-gradient-primary">School</span>
                <span className="text-gray-900">Mart</span>
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-6">
              <a
                href="/"
                className="text-gray-700 hover:text-blue-700 font-medium transition-colors"
              >
                Home
              </a>
              <a
                href="/products"
                className="text-gray-700 hover:text-blue-700 font-medium transition-colors"
              >
                Products
              </a>
            </div>
          </div>

          <div className="flex items-center space-x-2 md:space-x-4">
            {/* Mobile search button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
            >
              <Search className="h-5 w-5" />
            </Button>
            
            {/* Desktop search */}
            <div className="hidden md:flex flex-col relative w-78">
              <div className="flex items-center rounded-full border-2 border-gray-300 focus-within:border-blue-400 focus-within:ring-0 transition-colors overflow-hidden">
                <Input
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="flex-1 px-4 w-40 py-2 border-0 focus:ring-0 focus:border-0 focus:outline-none bg-transparent text-gray-900 rounded-none"
                />
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 btn-enhanced flex items-center justify-center px-4 rounded-full m-1"
                >
                  <Search className="h-4 w-4" />
                </Button>
              </div>
              {searchResults.length > 0 && searchQuery && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg max-h-96 overflow-y-auto z-50">
                  {searchResults.map((product) => (
                    <div
                      key={product.id}
                      className="p-3 hover:bg-gray-50 cursor-pointer flex items-center space-x-3"
                      onClick={() => {
                        router.push(`/product/${product.id}`);
                        setSearchQuery("");
                        setSearchResults([]);
                      }}
                    >
                      <img src={product.image} alt={product.name} className="w-12 h-12 object-cover rounded" />
                      <div>
                        <p className="font-medium text-gray-900">{product.name}</p>
                        <p className="text-sm text-gray-500">{product.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          
          {/* Mobile search overlay */}
          {isSearchOpen && (
            <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 md:hidden">
              <div className="flex items-center justify-center h-full px-4">
                <div className="bg-white w-full max-w-md rounded-lg shadow-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium">Search Products</h3>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => setIsSearchOpen(false)}
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                  <div className="flex flex-col w-full">
                    <div className="flex items-center rounded-full border-2 border-gray-300 focus-within:border-blue-400 focus-within:ring-0 transition-colors overflow-hidden">
                      <Input
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={(e) => handleSearch(e.target.value)}
                        className="flex-1 px-4 py-2 border-0 focus:ring-0 focus:border-0 focus:outline-none bg-transparent text-gray-900 rounded-none"
                        autoFocus
                      />
                      <Button
                        size="sm"
                        className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 btn-enhanced flex items-center justify-center px-4 rounded-full m-1"
                      >
                        <Search className="h-4 w-4" />
                      </Button>
                    </div>
                    {searchResults.length > 0 && searchQuery && (
                      <div className="mt-2 bg-white rounded-lg max-h-96 overflow-y-auto">
                        {searchResults.map((product) => (
                          <div
                            key={product.id}
                            className="p-3 hover:bg-gray-50 cursor-pointer flex items-center space-x-3"
                            onClick={() => {
                              router.push(`/product/${product.id}`);
                              setSearchQuery("");
                              setSearchResults([]);
                              setIsSearchOpen(false);
                            }}
                          >
                            <img src={product.image} alt={product.name} className="w-12 h-12 object-cover rounded" />
                            <div>
                              <p className="font-medium text-gray-900">{product.name}</p>
                              <p className="text-sm text-gray-500">{product.price}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          <Button
            variant="ghost"
              size="sm"
              className="relative rounded-full hover:bg-blue-50 transition-colors"
              onClick={() => (window.location.href = "/cart")}
            >
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 text-xs animate-pulse">
                  {cartCount}
                </Badge>
              )}
            </Button>

            {token ? (
              <Button
                className="rounded-full bg-blue-500 hover:bg-blue-600 btn-enhanced"
                onClick={() => (window.location.href = "/parent-dashboard")}
              >
                Dashboard
              </Button>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-full hover:bg-blue-50 transition-colors text-blue hidden md:inline-flex"
                  onClick={() => (window.location.href = "/register")}
                >
                  Signup
                </Button>

                <Button
                  className="rounded-full bg-blue-500 hover:bg-blue-600 btn-enhanced"
                  onClick={() => (window.location.href = "/login")}
                >
                  Login
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
