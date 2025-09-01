import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Search, User } from "lucide-react";

export default function Navbar() {
  return (
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
              <a
                href="#"
                className="text-gray-700 hover:text-blue-700 font-medium transition-colors"
              >
                Categories
              </a>
              <a
                href="#"
                className="text-gray-700 hover:text-blue-700 font-medium transition-colors"
              >
                About
              </a>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center rounded-full border-2 border-gray-300 focus-within:border-blue-400  transition-colors w-78 overflow-hidden">
              <Input
                placeholder="Search products..."
                className="flex-1 px-4 w-40 py-2 border-0 focus:ring-none focus:border-none focus:outline-none bg-transparent text-gray-900 rounded-none"
              />
              <Button
                size="sm"
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 btn-enhanced flex items-center justify-center px-4 rounded-full m-1"
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>

            <Button
              variant="ghost"
              size="sm"
              className="relative rounded-full hover:bg-blue-50 transition-colors"
              onClick={() => (window.location.href = "/cart")}
            >
              <ShoppingCart className="h-5 w-5" />
              <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 text-xs animate-pulse">
                3
              </Badge>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="rounded-full hover:bg-blue-50 transition-colors text-blue"
            >
              Signup
            </Button>

            {/* <Button
              variant="ghost"
              onClick={() => (window.location.href = "/school-manager")}
              className="rounded-full text-sm hover:bg-blue-50 transition-colors"
            >
              Manager
            </Button> */}

            <Button
              className="rounded-full  bg-blue-500 hover:from-blue-700 hover:to-purple-700 btn-enhanced"
              onClick={() => (window.location.href = "/login")}
            >
              Login
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
