import { Card, CardContent } from "@/components/ui/card"
import { Bar, Line } from "react-chartjs-2"

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

interface AnalyticsTabProps {
  orders: Order[]
  productsSoldByTermData: any
  salesData: any
  salesDataByTerm: any
  chartOptions: any
}

export default function AnalyticsTab({
  orders,
  productsSoldByTermData,
  salesData,
  salesDataByTerm,
  chartOptions
}: AnalyticsTabProps) {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Analytics & Reports</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white shadow-sm">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Products Sold by Term</h3>
            <Bar data={productsSoldByTermData} options={chartOptions} />
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Trends</h3>
            <Bar data={salesDataByTerm} options={chartOptions} />
          </CardContent>
        </Card>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-white shadow-sm">
          <CardContent className="p-6 text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Average Order Value</h3>
            <p className="text-3xl font-bold text-blue-700">
              RWF{" "}
              {orders.length > 0
                ? Math.round(orders.reduce((sum, order) => sum + Number(order.totalAmount), 0) / orders.length).toLocaleString()
                : "0"
              }
            </p>
            <p className="text-sm text-gray-600 mt-1">Expected revenue from all orders</p>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm">
          <CardContent className="p-6 text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Order Value</h3>
            <p className="text-3xl font-bold text-green-700">
              RWF{" "}
              {orders.reduce((sum, order) => sum + Number(order.totalAmount), 0).toLocaleString()}
            </p>
            <p className="text-sm text-gray-600 mt-1">All orders combined</p>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm">
          <CardContent className="p-6 text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Students Served</h3>
            <p className="text-3xl font-bold text-purple-700">
              {new Set(orders.map((o) => o.studentName)).size}
            </p>
            <p className="text-sm text-gray-600 mt-1">Unique students</p>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm">
          <CardContent className="p-6 text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Order Completion Rate</h3>
            <p className="text-3xl font-bold text-orange-700">
              {Math.round((orders.filter((o) => o.status === "delivered").length / orders.length) * 100)}%
            </p>
            <p className="text-sm text-gray-600 mt-1">Delivered orders</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
