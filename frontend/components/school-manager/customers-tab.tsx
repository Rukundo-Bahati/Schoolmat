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
import { useTableSort } from "@/hooks/use-table-sort"

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
  // Create customer data structure
  const customerData = Array.from(new Set(orders.map((o) => o.parentEmail)))
    .map((parentEmail) => {
      const parentOrders = orders.filter((o) => o.parentEmail === parentEmail)
      const parent = parentOrders[0]
      const totalSpent = parentOrders.filter(order => order.status === 'delivered').reduce((sum, order) => sum + Number(order.totalAmount), 0)
      const lastOrder = parentOrders.sort(
        (a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime(),
      )[0]
      const students = Array.from(
        new Set(parentOrders.map((o) => `${o.studentName} (${o.studentGrade})`)),
      )
      const totalItemsPurchased = parentOrders.filter(order => order.status === 'delivered').reduce((total, order) => {
        return total + order.items.reduce((orderTotal, item) => orderTotal + item.quantity, 0)
      }, 0)

      return {
        parentEmail,
        parentName: parent.parentName,
        parentPhone: parent.parentPhone,
        students: students.join(', '),
        totalOrders: parentOrders.filter(order => order.status === 'delivered').length,
        totalSpent,
        lastOrderDate: lastOrder.orderDate,
        lastOrderStatus: lastOrder.status,
        isActive: parentOrders.some((o) => o.status === "pending" || o.status === "processing"),
        totalItemsPurchased
      }
    })

  // Filter customers based on search query
  const filteredCustomers = customerData.filter((customer) =>
    customer.parentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.parentEmail.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const { sortedItems, handleSort, getSortIndicator } = useTableSort(filteredCustomers)

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
                  <th
                    className="text-left py-3 px-4 font-semibold text-gray-900 cursor-pointer"
                    onClick={() => handleSort('parentName')}
                  >
                    Parent Information {getSortIndicator('parentName')}
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Student(s)</th>
                  <th
                    className="text-left py-3 px-4 font-semibold text-gray-900 cursor-pointer"
                    onClick={() => handleSort('totalOrders')}
                  >
                    Delivered Orders {getSortIndicator('totalOrders')}
                  </th>
                  <th
                    className="text-left py-3 px-4 font-semibold text-gray-900 cursor-pointer"
                    onClick={() => handleSort('totalSpent')}
                  >
                    Total Spent {getSortIndicator('totalSpent')}
                  </th>
                  <th
                    className="text-left py-3 px-4 font-semibold text-gray-900 cursor-pointer"
                    onClick={() => handleSort('lastOrderDate')}
                  >
                    Last Order {getSortIndicator('lastOrderDate')}
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Total Items Purchased</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedItems.map((customer) => {
                  const parentOrders = orders.filter((o) => o.parentEmail === customer.parentEmail)
                  const completedOrders = parentOrders.filter((o) => o.status === "delivered").length

                  return (
                    <tr key={customer.parentEmail} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium text-gray-900">{customer.parentName}</p>
                          <p className="text-sm text-gray-600">{customer.parentEmail}</p>
                          <p className="text-sm text-gray-600">{customer.parentPhone}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <p className="text-sm text-gray-900">{customer.students}</p>
                      </td>
                      <td className="py-3 px-4">
                        <p className="font-medium text-gray-900">{customer.totalOrders}</p>
                      </td>
                      <td className="py-3 px-4">
                        <p className="font-bold text-gray-900">RWF {customer.totalSpent.toLocaleString()}</p>
                      </td>
                      <td className="py-3 px-4">
                        <p className="text-gray-900">{customer.lastOrderDate}</p>
                        <Badge
                          className={
                            customer.lastOrderStatus === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : customer.lastOrderStatus === "processing"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-green-100 text-green-800"
                          }
                        >
                          {customer.lastOrderStatus}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <p className="font-bold text-gray-900 text-center">{customer.totalItemsPurchased}</p>
                        <p className="text-xs text-gray-500 text-center">items</p>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="rounded-full bg-transparent"
                            onClick={() => onViewCustomerDetails(customer.parentEmail)}
                            title="View customer details"
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="rounded-full bg-transparent"
                            onClick={() => onDownloadCustomerReport(customer.parentEmail)}
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
