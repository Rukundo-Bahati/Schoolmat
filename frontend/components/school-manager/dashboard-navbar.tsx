import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bell, ArrowRightFromLine, ArrowLeft, Home } from "lucide-react"
import { useRouter } from "next/navigation"

interface DashboardNavbarProps {
  notificationsCount: number
  onLogout: () => void
}

export default function DashboardNavbar({ notificationsCount, onLogout }: DashboardNavbarProps) {
  const router = useRouter()

  const handleBack = () => {
    if (window.history.length > 2) {
      router.back()
    } else {
      router.push('/')
    }
  }

  const handleHome = () => {
    router.push('/')
  }

  return (
    <header className="fixed top-0 left-0 right-0 bg-blue-800 shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Back button, Home button, Logo and Title */}
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleBack}
              className="rounded-full text-white hover:bg-blue-700"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleHome}
              className="rounded-full text-white hover:bg-blue-700"
            >
              <Home className="h-5 w-5" />
            </Button>
            <div className="flex items-center space-x-8">
              <span className="text-2xl font-bold text-white">
                <span className="text-yellow-400">School</span>
                <span className="text-white">Mart</span>
              </span>
              <span className="text-blue-100">Manager Dashboard</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="relative rounded-full text-white hover:bg-blue-700">
              <Bell className="h-5 w-5" />
              {notificationsCount > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-red-500 text-xs">
                  {notificationsCount > 9 ? '9+' : notificationsCount}
                </Badge>
              )}
            </Button>
            <Button variant="ghost" onClick={onLogout} className="rounded-full text-white hover:bg-blue-700">
              {/* <ArrowRightFromLine className="h-4 w-4 mr-2" /> */}
              Logout
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
