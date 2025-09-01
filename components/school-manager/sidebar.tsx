import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, BarChart3, ShoppingCart, Package, TrendingUp, Settings } from "lucide-react"

interface SidebarItem {
  id: string
  label: string
  icon: any
}

interface SidebarProps {
  sidebarItems: SidebarItem[]
  activeTab: string
  onTabChange: (tab: string) => void
  lowStockProducts: any[]
}

const iconMap = {
  BarChart3,
  ShoppingCart,
  Package,
  Users,
  TrendingUp,
  Settings,
}

export default function Sidebar({ sidebarItems, activeTab, onTabChange, lowStockProducts }: SidebarProps) {
  return (
    <aside className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-80 bg-gray-50 border-r border-gray-200 z-30">
      <div className="p-6 h-full overflow-hidden">
        <Card className="bg-white shadow-sm h-full">
          <CardContent className="p-6 h-full flex flex-col">
            {/* Profile Section */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-blue-700" />
              </div>
              <h3 className="font-semibold text-gray-900">School Manager</h3>
              <p className="text-sm text-gray-600">Admin Account</p>
            </div>

            {/* Navigation */}
            <nav className="space-y-2">
              {sidebarItems.map((item) => {
                const IconComponent = iconMap[item.icon as keyof typeof iconMap]
                return (
                  <Button
                    key={item.id}
                    variant={activeTab === item.id ? "default" : "ghost"}
                    onClick={() => onTabChange(item.id)}
                    className={`w-full justify-start rounded-lg h-12 px-4 transition-all duration-200 ${
                      activeTab === item.id
                        ? "bg-blue-600 text-white hover:bg-blue-700"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    {IconComponent && <IconComponent className="h-4 w-4 mr-3 flex-shrink-0" />}
                    <span className="truncate">{item.label}</span>
                    {item.id === "stock" && lowStockProducts.length > 0 && (
                      <Badge className="ml-auto bg-red-500 text-white text-xs flex-shrink-0">
                        {lowStockProducts.length}
                      </Badge>
                    )}
                  </Button>
                )
              })}
            </nav>
          </CardContent>
        </Card>
      </div>
    </aside>
  )
}
