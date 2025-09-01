import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Package, DollarSign, Clock, TrendingUp, CheckCircle } from "lucide-react"
import { Line, Doughnut } from "react-chartjs-2"

interface Purchase {
  id: number
  item: string
  date: string
  amount: string
  status: string
  category: string
  student: string
}

interface OverviewTabProps {
  allPurchases: Purchase[]
  pendingOrders: Purchase[]
  monthlySpendingData: any
  categorySpendingData: any
  orderTrendData: any
  chartOptions: any
}

export default function OverviewTab({
  allPurchases,
  pendingOrders,
  monthlySpendingData,
  categorySpendingData,
  orderTrendData,
  chartOptions,
}: OverviewTabProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Overview</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening with your orders.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-white shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Orders</p>
                <p className="text-xl font-bold text-gray-900">{allPurchases.length + pendingOrders.length}</p>
              </div>
              <Package className="h-6 w-6 text-blue-700" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Spent</p>
                <p className="text-xl font-bold text-gray-900">
                  RWF{" "}
                  {allPurchases
                    .reduce((sum, p) => sum + Number.parseInt(p.amount.replace(",", "")), 0)
                    .toLocaleString()}
                </p>
              </div>
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Orders</p>
                <p className="text-xl font-bold text-gray-900">{pendingOrders.length}</p>
              </div>
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">This Month</p>
                <p className="text-xl font-bold text-gray-900">RWF 26,500</p>
              </div>
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white shadow-sm">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Material Purchase per Term Trend</h3>
            <Line data={orderTrendData} options={chartOptions} />
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Spending by Category</h3>
            <Doughnut data={categorySpendingData} options={chartOptions} />
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="bg-white shadow-sm">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {allPurchases.slice(0, 3).map((purchase) => (
              <div key={purchase.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="font-medium text-gray-900">{purchase.item}</p>
                    <p className="text-sm text-gray-600">
                      {purchase.date} • {purchase.category}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">RWF {purchase.amount}</p>
                  <Badge className="bg-green-100 text-green-800">Delivered</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
