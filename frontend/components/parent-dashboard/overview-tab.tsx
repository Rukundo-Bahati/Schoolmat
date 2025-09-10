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
  lineChartOptions: any
  doughnutChartOptions: any
}

export default function OverviewTab({
  allPurchases,
  pendingOrders,
  monthlySpendingData,
  categorySpendingData,
  orderTrendData,
  lineChartOptions,
  doughnutChartOptions,
}: OverviewTabProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Overview</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening with your orders.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
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
                <p className="text-sm text-gray-600">Total Amount Paid</p>
                <p className="text-xl font-bold text-gray-900">
                  RWF{" "}
                  {allPurchases
                    .filter(p => p.status === 'delivered')
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
                <p className="text-sm text-gray-600">Amount to Pay</p>
                <p className="text-xl font-bold text-gray-900">
                  RWF{" "}
                  {allPurchases
                    .filter(p => p.status === 'pending' || p.status === 'processing')
                    .reduce((sum, p) => sum + Number.parseInt(p.amount.replace(",", "")), 0)
                    .toLocaleString()}
                </p>
              </div>
              <Clock className="h-6 w-6 text-orange-600" />
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
                <p className="text-sm text-gray-600">This Term</p>
                <p className="text-xl font-bold text-gray-900">
                  RWF{" "}
                  {(() => {
                    const currentDate = new Date()
                    const currentMonth = currentDate.getMonth() + 1
                    const currentYear = currentDate.getFullYear()

                    let termTotal = 0
                    if (currentMonth >= 9 || currentMonth <= 12) { // Term 1: Sep-Dec
                      termTotal = allPurchases
                        .filter(p => {
                          const orderDate = new Date(p.date)
                          return orderDate.getFullYear() === currentYear &&
                                 (orderDate.getMonth() + 1 >= 9 || orderDate.getMonth() + 1 <= 12) &&
                                 p.status === 'delivered'
                        })
                        .reduce((sum, p) => sum + Number.parseInt(p.amount.replace(",", "")), 0)
                    } else if (currentMonth >= 1 && currentMonth <= 3) { // Term 2: Jan-Mar
                      termTotal = allPurchases
                        .filter(p => {
                          const orderDate = new Date(p.date)
                          return orderDate.getFullYear() === currentYear &&
                                 orderDate.getMonth() + 1 >= 1 && orderDate.getMonth() + 1 <= 3 &&
                                 p.status === 'delivered'
                        })
                        .reduce((sum, p) => sum + Number.parseInt(p.amount.replace(",", "")), 0)
                    } else if (currentMonth >= 4 && currentMonth <= 6) { // Term 3: Apr-Jun
                      termTotal = allPurchases
                        .filter(p => {
                          const orderDate = new Date(p.date)
                          return orderDate.getFullYear() === currentYear &&
                                 orderDate.getMonth() + 1 >= 4 && orderDate.getMonth() + 1 <= 6 &&
                                 p.status === 'delivered'
                        })
                        .reduce((sum, p) => sum + Number.parseInt(p.amount.replace(",", "")), 0)
                    }

                    return termTotal.toLocaleString()
                  })()}
                </p>
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
            <Line data={orderTrendData} options={lineChartOptions} />
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Spending by Category</h3>
            <div className="h-64">
              <Doughnut data={categorySpendingData} options={doughnutChartOptions} />
            </div>
            {categorySpendingData && (
              <div className="mt-4 space-y-2">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Category Breakdown:</h4>
                <div className="grid grid-cols-1 gap-2">
                  {categorySpendingData.labels.map((label: string, index: number) => {
                    const value = categorySpendingData.datasets[0].data[index]
                    const total = categorySpendingData.datasets[0].data.reduce((sum: number, val: number) => sum + val, 0)
                    const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0

                    return (
                      <div key={`category-${index}`} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div
                            className="w-4 h-4 rounded-full flex-shrink-0"
                            style={{ backgroundColor: categorySpendingData.datasets[0].backgroundColor[index] }}
                          ></div>
                          <span className="text-sm font-medium text-gray-900">{label}</span>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-semibold text-gray-900">
                            RWF {Number(value).toLocaleString()}
                          </div>
                          <div className="text-xs text-gray-600">
                            {percentage}%
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="bg-white shadow-sm">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {allPurchases.slice(0, 3).map((purchase, index) => (
              <div key={`purchase-${purchase.id || index}`} className="flex items-center justify-between p-3 border rounded-lg">
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
