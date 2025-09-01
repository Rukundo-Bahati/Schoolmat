import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Eye,
  Download,
  Search,
} from "lucide-react"
import OrderDetailsModal from "./order-details-modal"
import { generateOrderHistoryPDF, downloadPDF, type OrderData } from "@/lib/pdf-generator"

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

interface OrdersTabProps {
  orders: Order[]
  searchQuery: string
  filterStatus: string
  onSearchChange: (query: string) => void
  onFilterChange: (status: string) => void
  onDownloadReport: () => void
}

export default function OrdersTab({
  orders,
  searchQuery,
  filterStatus,
  onSearchChange,
  onFilterChange,
  onDownloadReport
}: OrdersTabProps) {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.parentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.id.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = filterStatus === "all" || order.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order)
    setIsModalOpen(true)
  }

  const handleDownloadOrder = async (order: Order) => {
    const schoolInfo = {
      name: "Kigali Primary School",
      address: "KG 123 St, Kigali, Rwanda",
      phone: "+250 788 000 000",
      email: "admin@kigaliprimary.edu.rw",
    }

    const orderData: OrderData[] = [{
      id: order.id,
      item: order.items.map((item) => `${item.quantity}x ${item.name}`).join(", "),
      date: order.orderDate,
      amount: order.totalAmount.toString(),
      status: order.status,
      category: order.items[0]?.category || "Mixed",
      student: order.studentName,
      parentName: order.parentName,
      parentEmail: order.parentEmail,
      parentPhone: order.parentPhone,
    }]

    const managerInfo = {
      parentName: "School Manager",
      email: "manager@kigaliprimary.edu.rw",
      phone: "+250 788 000 000",
      studentName: order.studentName,
      studentGrade: order.studentGrade,
      studentClass: order.studentClass,
    }

    try {
      const doc = await generateOrderHistoryPDF(orderData, managerInfo, schoolInfo)
      downloadPDF(doc, `order-${order.id}-${new Date().toISOString().split("T")[0]}.pdf`)
    } catch (error) {
      console.error("Error generating PDF:", error)
      alert("Error generating PDF. Please try again.")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Orders Management</h1>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search orders..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-64 rounded-full"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => onFilterChange(e.target.value)}
            className="rounded-full border border-gray-300 px-4 py-2"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
          </select>
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

      <Card className="bg-white shadow-sm">
        <CardContent className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Order ID</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Parent Info</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Student Info</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Items</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Total</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium text-gray-900">{order.id}</p>
                        <p className="text-sm text-gray-600">{order.orderDate}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium text-gray-900">{order.parentName}</p>
                        <p className="text-sm text-gray-600">{order.parentEmail}</p>
                        <p className="text-sm text-gray-600">{order.parentPhone}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium text-gray-900">{order.studentName}</p>
                        <p className="text-sm text-gray-600">
                          {order.studentGrade} - {order.studentClass}
                        </p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="space-y-1">
                        {order.items.map((item, index) => (
                          <p key={index} className="text-sm text-gray-600">
                            {item.quantity}x {item.name}
                          </p>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-bold text-gray-900">RWF {order.totalAmount.toLocaleString()}</p>
                      <p className="text-sm text-gray-600">{order.paymentMethod}</p>
                    </td>
                    <td className="py-3 px-4">
                      <Badge
                        className={
                          order.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : order.status === "processing"
                              ? "bg-blue-100 text-blue-800"
                              : order.status === "shipped"
                                ? "bg-purple-100 text-purple-800"
                                : "bg-green-100 text-green-800"
                        }
                      >
                        {order.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-full bg-transparent"
                          onClick={() => handleViewOrder(order)}
                        >
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-full bg-transparent"
                          onClick={() => handleDownloadOrder(order)}
                        >
                          <Download className="h-3 w-3" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false)
            setSelectedOrder(null)
          }}
        />
      )}
    </div>
  )
}
