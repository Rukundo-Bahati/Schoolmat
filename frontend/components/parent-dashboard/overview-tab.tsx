import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Package, DollarSign, Clock, TrendingUp, CheckCircle } from "lucide-react"
import { Line, Doughnut } from "react-chartjs-2"
import ChartDataLabels from 'chartjs-plugin-datalabels'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler,
} from "chart.js"

// Ensure Chart.js components are registered
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement, Filler, ChartDataLabels)

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
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700 mb-1">Total Orders</p>
                <p className="text-2xl font-bold text-blue-900">{allPurchases.length + pendingOrders.length}</p>
              </div>
              <div className="p-3 bg-blue-500 rounded-full shadow-lg">
                <Package className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700 mb-1">Total Amount Paid</p>
                <p className="text-2xl font-bold text-green-900">
                  RWF{" "}
                  {allPurchases
                    .filter(p => p.status === 'delivered')
                    .reduce((sum, p) => sum + Number.parseInt(p.amount.replace(",", "")), 0)
                    .toLocaleString()}
                </p>
              </div>
              <div className="p-3 bg-green-500 rounded-full shadow-lg">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-700 mb-1">Amount to Pay</p>
                <p className="text-2xl font-bold text-orange-900">
                  RWF{" "}
                  {allPurchases
                    .filter(p => p.status === 'pending' || p.status === 'processing')
                    .reduce((sum, p) => sum + Number.parseInt(p.amount.replace(",", "")), 0)
                    .toLocaleString()}
                </p>
              </div>
              <div className="p-3 bg-orange-500 rounded-full shadow-lg">
                <Clock className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-700 mb-1">Pending Orders</p>
                <p className="text-2xl font-bold text-yellow-900">{pendingOrders.length}</p>
              </div>
              <div className="p-3 bg-yellow-500 rounded-full shadow-lg">
                <Clock className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-700 mb-1">This Term</p>
                <p className="text-2xl font-bold text-purple-900">
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
              <div className="p-3 bg-purple-500 rounded-full shadow-lg">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white shadow-sm">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Purchase per Term Trend</h3>
            <Line data={orderTrendData} options={lineChartOptions} />
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Category Spending Analysis</h3>
              <div className="text-sm text-gray-500">
                Total: RWF {categorySpendingData ? 
                  categorySpendingData.datasets[0].data.reduce((sum: number, val: number) => sum + val, 0).toLocaleString() 
                  : '0'}
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Enhanced Doughnut Chart */}
              <div className="flex flex-col items-center">
                <div className="h-64 w-64 relative">
                  <Doughnut 
                    data={categorySpendingData}
                    plugins={[ChartDataLabels]}
                    options={{
                      ...doughnutChartOptions,
                      cutout: '65%',
                      plugins: {
                        ...doughnutChartOptions.plugins,
                        legend: {
                          display: false
                        },
                        tooltip: {
                          callbacks: {
                            label: function(context: any) {
                              const label = context.label || '';
                              const value = context.parsed;
                              return `${label}: RWF ${value.toLocaleString()}`;
                            }
                          }
                        },
                        datalabels: {
                          display: true,
                          color: '#ffffff',
                          font: {
                            weight: 'bold',
                            size: 11
                          },
                          formatter: function(value: any, context: any) {
                            const categoryName = context.chart.data.labels[context.dataIndex];
                            const total = context.dataset.data.reduce((sum: number, val: number) => sum + val, 0);
                            const percentage = ((value / total) * 100).toFixed(1);
                            // Only show category name for segments with significant size to avoid overcrowding
                            if (parseFloat(percentage) > 8) {
                              return categoryName;
                            }
                            return '';
                          },
                          anchor: 'center',
                          align: 'center',
                          textAlign: 'center',
                          clip: false
                        }
                      }
                    }} 
                  />
                  {/* Center text showing total */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="text-xs text-gray-500 font-medium">Total Spent</div>
                    <div className="text-lg font-bold text-gray-900">
                      RWF {categorySpendingData ? 
                        categorySpendingData.datasets[0].data.reduce((sum: number, val: number) => sum + val, 0).toLocaleString() 
                        : '0'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Enhanced Category Breakdown */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-gray-700 mb-4">Category Breakdown</h4>
                {categorySpendingData && categorySpendingData.labels.map((label: string, index: number) => {
                  const value = categorySpendingData.datasets[0].data[index]
                  const total = categorySpendingData.datasets[0].data.reduce((sum: number, val: number) => sum + val, 0)
                  const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0
                  const color = categorySpendingData.datasets[0].backgroundColor[index]

                  return (
                    <div key={`category-${index}`} className="group hover:bg-gray-50 p-3 rounded-lg transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          <div
                            className="w-4 h-4 rounded-full flex-shrink-0 shadow-sm"
                            style={{ backgroundColor: color }}
                          ></div>
                          <span className="text-sm font-medium text-gray-900">{label}</span>
                        </div>
                        <div className="text-right">
                          <div className="text-base font-bold text-gray-900">
                            RWF {Number(value).toLocaleString()}
                          </div>
                          <div className="text-xs text-gray-500">
                            {percentage}% of total
                          </div>
                        </div>
                      </div>
                      {/* Clean progress bar */}
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="h-2 rounded-full transition-all duration-300"
                          style={{ 
                            backgroundColor: color, 
                            width: `${percentage}%` 
                          }}
                        ></div>
                      </div>
                    </div>
                  )
                })}
                
                {/* Top spending category highlight */}
                {categorySpendingData && categorySpendingData.labels.length > 0 && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm font-medium text-blue-800">
                        Top Category: {categorySpendingData.labels[0]} 
                        ({((categorySpendingData.datasets[0].data[0] / categorySpendingData.datasets[0].data.reduce((sum: number, val: number) => sum + val, 0)) * 100).toFixed(1)}% of total spending)
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
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
