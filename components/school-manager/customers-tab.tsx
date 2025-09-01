import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Users,
  TrendingUp,
  ShoppingCart,
  Eye,
  Download,
  Search,
} from "lucide-react"

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
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  orderDate: string
  paymentMethod: string
  deliveryAddress: string
}

interface CustomersTabProps {
  orders: Order[]
  searchQuery: string
  onSearchChange: (query: string) => void
  onDownloadReport: () => void
  onViewCustomerDetails: (parentEmail: string) => void
  onDownloadCustomerReport: (parentEmail: string) => void
}

export default function CustomersTab({
  orders,
  searchQuery,
  onSearchChange,
  onDownloadReport,
  onViewCustomerDetails,
  onDownloadCustomerReport
}: CustomersTabProps) {
  // Filter customers based on search query
  const filteredCustomers = Array.from(new Set(orders.map((o) => o.parentEmail)))
    .filter((parentEmail) => {
      const parent = orders.find((o) => o.parentEmail === parentEmail)
      return parent?.parentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
             parent?.parentEmail.toLowerCase().includes(searchQuery.toLowerCase())
    })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Customer Management</h1>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search customers..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-64 rounded-full"
            />
          </div>
          <Button
            variant="outline"
            className="rounded-full bg-transparent"
            onClick={onDownloadReport}
          >
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
        </div>
      </div>

      {/* Customer Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-white shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Parents</p>
                <p className="text-2xl font-bold text-gray-900">
                  {new Set(orders.map((o) => o.parentEmail)).size}
                </p>
              </div>
              <Users className="h-8 w-8 text-blue-700" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Students</p>
                <p className="text-2xl font-bold text-gray-900">
                  {new Set(orders.map((o) => o.studentName)).size}
                </p>
              </div>
              <Users className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Customers</p>
                <p className="text-2xl font-bold text-gray-900">
                  {new Set(orders.filter((o) => o.status !== "cancelled").map((o) => o.parentEmail)).size}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg. Orders per Customer</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Math.round(orders.length / new Set(orders.map((o) => o.parentEmail)).size)}
                </p>
              </div>
              <ShoppingCart className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Customer List */}
      <Card className="bg-white shadow-sm">
        <CardContent className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Parent Information</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Student(s)</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Total Orders</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Total Spent</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Last Order</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.map((parentEmail) => {
                  const parentOrders = orders.filter((o) => o.parentEmail === parentEmail)
                  const parent = parentOrders[0]
                  const totalSpent = parentOrders.reduce((sum, order) => sum + order.totalAmount, 0)
                  const lastOrder = parentOrders.sort(
                    (a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime(),
                  )[0]
                  const students = Array.from(
                    new Set(parentOrders.map((o) => `${o.studentName} (${o.studentGrade})`)),
                  )

                  return (
                    <tr key={parentEmail} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium text-gray-900">{parent.parentName}</p>
                          <p className="text-sm text-gray-600">{parent.parentEmail}</p>
                          <p className="text-sm text-gray-600">{parent.parentPhone}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="space-y-1">
                          {students.map((student, index) => (
                            <p key={index} className="text-sm text-gray-900">
                              {student}
                            </p>
                          ))}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <p className="font-medium text-gray-900">{parentOrders.length}</p>
                        <p className="text-sm text-gray-600">
                          {parentOrders.filter((o) => o.status === "delivered").length} completed
                        </p>
                      </td>
                      <td className="py-3 px-4">
                        <p className="font-bold text-gray-900">RWF {totalSpent.toLocaleString()}</p>
                        <p className="text-sm text-gray-600">
                          Avg: RWF {Math.round(totalSpent / parentOrders.length).toLocaleString()}
                        </p>
                      </td>
                      <td className="py-3 px-4">
                        <p className="text-gray-900">{lastOrder.orderDate}</p>
                        <Badge
                          className={
                            lastOrder.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : lastOrder.status === "processing"
                                ? "bg-blue-100 text-blue-800"
                                : lastOrder.status === "shipped"
                                  ? "bg-purple-100 text-purple-800"
                                  : "bg-green-100 text-green-800"
                          }
                        >
                          {lastOrder.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <Badge
                          className={
                            parentOrders.some((o) => o.status === "pending" || o.status === "processing")
                              ? "bg-blue-100 text-blue-800"
                              : "bg-green-100 text-green-800"
                          }
                        >
                          {parentOrders.some((o) => o.status === "pending" || o.status === "processing")
                            ? "Active"
                            : "Inactive"}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="rounded-full bg-transparent"
                            onClick={() => onViewCustomerDetails(parentEmail)}
                            title="View customer details"
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="rounded-full bg-transparent"
                            onClick={() => onDownloadCustomerReport(parentEmail)}
                            title="Download customer report"
                          >
                            <Download className="h-3 w-3" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
