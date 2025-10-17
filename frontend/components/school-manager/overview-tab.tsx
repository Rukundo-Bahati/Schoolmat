import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ShoppingCart,
  DollarSign,
  Package,
  AlertTriangle,
  RefreshCw,
} from "lucide-react"
import { Bar, Doughnut, Line } from "react-chartjs-2"
import { useState } from "react"

interface Order {
  id: string
  parentName: string
  parentEmail: string
  parentPhone: string
  studentName: string
  studentGrade: string
  studentClass: string
  items: Array<{
    name: string
    quantity: number
    price: number
    category: string
  }>
  totalAmount: number
  status: "pending" | "processing" | "delivered" | "cancelled"
  orderDate: string
  paymentMethod: string
  deliveryAddress: string
}

interface OverviewTabProps {
  orders: Order[]
  lowStockProducts: any[]
  salesData: any
  orderStatusData: any
  chartOptions: any
  loadingAnalytics: boolean
  analyticsError: string | null
  onRefreshAnalytics: () => void
}

export default function OverviewTab({
  orders,
  lowStockProducts,
  salesData,
  orderStatusData,
  chartOptions,
  loadingAnalytics,
  analyticsError,
  onRefreshAnalytics,
}: OverviewTabProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Overview</h1>
          <p className="text-gray-600">Monitor your school supply management system</p>
        </div>
        <button
          onClick={onRefreshAnalytics}
          disabled={loadingAnalytics}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          aria-label="Refresh Analytics Data"
        >
          <RefreshCw className="w-5 h-5" />
          <span>Refresh</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700 mb-2">Total Orders</p>
                <p className="text-3xl font-bold text-blue-900">{orders.length}</p>
              </div>
              <div className="p-4 bg-blue-500 rounded-full shadow-lg">
                <ShoppingCart className="h-8 w-8 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700 mb-2">Total Revenue</p>
                <p className="text-3xl font-bold text-green-900">
                  RWF {orders
                    .filter(order => order.status === "delivered")
                    .reduce((sum, order) => sum + Number(order.totalAmount), 0)
                    .toLocaleString()}
                </p>
              </div>
              <div className="p-4 bg-green-500 rounded-full shadow-lg">
                <DollarSign className="h-8 w-8 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-700 mb-2">Products</p>
                <p className="text-3xl font-bold text-purple-900">25</p>
              </div>
              <div className="p-4 bg-purple-500 rounded-full shadow-lg">
                <Package className="h-8 w-8 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-red-100 border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-700 mb-2">Low Stock Items</p>
                <p className="text-3xl font-bold text-red-900">{lowStockProducts.length}</p>
              </div>
              <div className="p-4 bg-red-500 rounded-full shadow-lg">
                <AlertTriangle className="h-8 w-8 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white shadow-sm">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Purchases Per Term</h3>
          {loadingAnalytics ? (
            <div className="flex justify-center items-center h-48">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : analyticsError ? (
            <div className="text-center text-red-600">
              <p>Error loading product purchases data.</p>
              <button
                onClick={onRefreshAnalytics}
                className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Retry
              </button>
            </div>
          ) : (
            <Line
              data={{
                labels: salesData?.productPurchasesByTerm?.map((item: any) => item.term) || [],
                datasets: [{
                  label: 'Product Purchases',
                  data: salesData?.productPurchasesByTerm?.map((item: any) => item.purchases) || [],
                  borderColor: 'rgb(59, 130, 246)',
                  backgroundColor: 'rgba(59, 130, 246, 0.1)',
                  tension: 0.4,
                  fill: true,
                }]
              }}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    display: false,
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                  },
                  x: {
                    ticks: {
                      maxRotation: 45,
                      minRotation: 0
                    }
                  }
                }
              }}
            />
          )}
        </CardContent>
        </Card>

        <Card className="bg-white shadow-sm">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Status Distribution</h3>
            {loadingAnalytics ? (
              <div className="flex justify-center items-center h-48">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : analyticsError ? (
              <div className="text-center text-red-600">
                <p>Error loading order status data.</p>
                <button
                  onClick={onRefreshAnalytics}
                  className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Retry
                </button>
              </div>
            ) : (
              <div className="h-64">
                <Doughnut 
                  data={orderStatusData} 
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    cutout: '60%',
                    layout: {
                      padding: 20,
                    },
                    plugins: {
                      legend: {
                        display: true,
                        position: 'bottom' as const,
                      },
                      tooltip: {
                        callbacks: {
                          label: function(context: any) {
                            let label = context.label || '';
                            if (label) {
                              label += ': ';
                            }
                            if (context.parsed !== null) {
                              label += context.parsed + ' orders';
                            }
                            return label;
                          }
                        }
                      }
                    },
                  }}
                />
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card className="bg-white shadow-sm">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Orders</h3>
          <div className="space-y-4">
            {orders.slice(0, 3).map((order) => (
              <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <ShoppingCart className="h-5 w-5 text-blue-700" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {order.id} - {order.studentName}
                    </p>
                    <p className="text-sm text-gray-600">
                      {order.parentName} • {order.orderDate}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">RWF {order.totalAmount.toLocaleString()}</p>
                  <Badge
                    className={
                      order.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : order.status === "processing"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-green-100 text-green-800"
                    }
                  >
                    {order.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
