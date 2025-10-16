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
import { useTableSort } from "@/hooks/use-table-sort"
import { updateOrderStatus, bulkUpdateOrderStatus } from "@/lib/api"
import { useToast } from "@/components/ui/use-toast"

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

interface OrdersTabProps {
  orders: Order[]
  searchQuery: string
  filterStatus: string
  onSearchChange: (query: string) => void
  onFilterChange: (status: string) => void
  onDownloadReport: () => void
  isAdmin: boolean
  token?: string
  onOrderUpdate?: (orderId: string, newStatus: string) => void
}

export default function OrdersTab({
  orders,
  searchQuery,
  filterStatus,
  onSearchChange,
  onFilterChange,
  onDownloadReport,
  isAdmin,
  token,
  onOrderUpdate
}: OrdersTabProps) {
  const { toast } = useToast()
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedOrderIds, setSelectedOrderIds] = useState<Set<string>>(new Set())
  const [bulkStatus, setBulkStatus] = useState<string>("pending")
  const [isBulkUpdating, setIsBulkUpdating] = useState(false)
  const [isSingleUpdating, setIsSingleUpdating] = useState(false)
  const [error, setError] = useState<string | undefined>(undefined)

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.parentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.id.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = filterStatus === "all" || order.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const { sortedItems, handleSort, getSortIndicator } = useTableSort(filteredOrders)

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
      toast({
        title: "PDF Generation Failed",
        description: "Error generating PDF. Please try again.",
        variant: "destructive",
      })
    }
  }

  const toggleSelectOrder = (orderId: string) => {
    setSelectedOrderIds((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(orderId)) {
        newSet.delete(orderId)
      } else {
        newSet.add(orderId)
      }
      return newSet
    })
  }

  const handleSingleStatusChange = async (orderId: string, newStatus: string) => {
    if (!isAdmin) {
      toast({
        title: "Permission Denied",
        description: "You do not have permission to update order status.",
        variant: "destructive",
      })
      return
    }
    if (!token) {
      toast({
        title: "Authentication Error",
        description: "Authentication token is missing.",
        variant: "destructive",
      })
      return
    }
    setIsSingleUpdating(true)
    setError(undefined)
    try {
      await updateOrderStatus(token, orderId, newStatus)

      // Update the parent component's state immediately
      if (onOrderUpdate) {
        onOrderUpdate(orderId, newStatus)
      }

      toast({
        title: "Status saved",
        description: `Order ${orderId} status updated to ${newStatus}`,
        variant: "default",
      })
    } catch (err) {
      console.error("Failed to update order status:", err)
      setError("Failed to update order status.")
      toast({
        title: "Update Failed",
        description: "Failed to update order status. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSingleUpdating(false)
    }
  }

  const handleBulkStatusChange = async () => {
    if (!isAdmin) {
      toast({
        title: "Permission Denied",
        description: "You do not have permission to update order status.",
        variant: "destructive",
      })
      return
    }
    if (!token) {
      toast({
        title: "Authentication Error",
        description: "Authentication token is missing.",
        variant: "destructive",
      })
      return
    }
    if (selectedOrderIds.size === 0) {
      toast({
        title: "No Orders Selected",
        description: "Please select at least one order for bulk update.",
        variant: "destructive",
      })
      return
    }
    setIsBulkUpdating(true)
    setError(undefined)
    try {
      console.log('Bulk update request:', {
        orderIds: Array.from(selectedOrderIds),
        status: bulkStatus
      })
      await bulkUpdateOrderStatus(token, Array.from(selectedOrderIds), bulkStatus)

      // Update the parent component's state immediately for all selected orders
      if (onOrderUpdate) {
        selectedOrderIds.forEach(orderId => {
          onOrderUpdate(orderId, bulkStatus)
        })
      }

      toast({
        title: "Bulk Update Successful",
        description: `Bulk updated ${selectedOrderIds.size} orders to status ${bulkStatus}`,
        variant: "default",
      })
      setSelectedOrderIds(new Set())
    } catch (err) {
      console.error("Failed to bulk update order statuses:", err)
      setError("Failed to bulk update order statuses.")
      toast({
        title: "Bulk Update Failed",
        description: "Failed to bulk update order statuses. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsBulkUpdating(false)
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

      {isAdmin && (
        <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={selectedOrderIds.size === filteredOrders.length && filteredOrders.length > 0}
              onChange={(e) => {
                if (e.target.checked) {
                  setSelectedOrderIds(new Set(filteredOrders.map(order => order.id)))
                } else {
                  setSelectedOrderIds(new Set())
                }
              }}
              className="rounded"
            />
            <span className="text-sm font-medium">Select All ({selectedOrderIds.size} selected)</span>
          </div>
          <div className="flex items-center space-x-2">
            <select
              value={bulkStatus}
              onChange={(e) => setBulkStatus(e.target.value)}
              className="rounded border border-gray-300 px-3 py-1"
            >
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <Button
              onClick={handleBulkStatusChange}
              disabled={isBulkUpdating || selectedOrderIds.size === 0}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isBulkUpdating ? "Updating..." : "Bulk Update"}
            </Button>
          </div>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      <Card className="bg-white shadow-sm">
        <CardContent className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  {isAdmin && (
                    <th className="py-3 px-4 font-semibold text-gray-900">
                      <input
                        type="checkbox"
                        checked={selectedOrderIds.size === filteredOrders.length && filteredOrders.length > 0}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedOrderIds(new Set(filteredOrders.map(order => order.id)))
                          } else {
                            setSelectedOrderIds(new Set())
                          }
                        }}
                        className="rounded"
                      />
                    </th>
                  )}
                  <th
                    className="text-left py-3 px-4 font-semibold text-gray-900 cursor-pointer"
                    onClick={() => handleSort('id')}
                  >
                    Order {getSortIndicator('id')}
                  </th>
                  <th
                    className="text-left py-3 px-4 font-semibold text-gray-900 cursor-pointer"
                    onClick={() => handleSort('parentName')}
                  >
                    Parent Info {getSortIndicator('parentName')}
                  </th>
                  <th
                    className="text-left py-3 px-4 font-semibold text-gray-900 cursor-pointer"
                    onClick={() => handleSort('studentName')}
                  >
                    Student Info {getSortIndicator('studentName')}
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Total Items</th>
                  <th
                    className="text-left py-3 px-4 font-semibold text-gray-900 cursor-pointer"
                    onClick={() => handleSort('totalAmount')}
                  >
                    Total {getSortIndicator('totalAmount')}
                  </th>
                  <th
                    className="text-left py-3 px-4 font-semibold text-gray-900 cursor-pointer"
                    onClick={() => handleSort('status')}
                  >
                    Status {getSortIndicator('status')}
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedItems.map((order) => (
                  <tr key={order.id} className="border-b hover:bg-gray-50">
                    {isAdmin && (
                      <td className="py-3 px-4">
                        <input
                          type="checkbox"
                          checked={selectedOrderIds.has(order.id)}
                          onChange={() => toggleSelectOrder(order.id)}
                          className="rounded"
                        />
                      </td>
                    )}
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium text-gray-900">
                          {new Date(order.orderDate).getFullYear()}-{String(new Date(order.orderDate).getMonth() + 1).padStart(2, '0')}-{order.id.slice(-6).toUpperCase()}
                        </p>
                        <p className="text-sm text-gray-600">{new Date(order.orderDate).toLocaleDateString()}</p>
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
                      <p className="font-bold text-gray-900 text-center">
                        {order.items.reduce((total, item) => total + item.quantity, 0)}
                      </p>
                      <p className="text-xs text-gray-500 text-center">items</p>
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-bold text-gray-900">RWF {order.totalAmount.toLocaleString()}</p>
                      <p className="text-sm text-gray-600">{order.paymentMethod}</p>
                    </td>
                    <td className="py-3 px-4">
                      {isAdmin ? (
                        <select
                          value={order.status}
                          onChange={(e) => handleSingleStatusChange(order.id, e.target.value)}
                          disabled={isSingleUpdating}
                          className="text-sm rounded border border-gray-300 px-3 py-2 min-w-[120px] w-full"
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      ) : (
                        <Badge
                          className={
                            order.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : order.status === "processing"
                                ? "bg-blue-100 text-blue-800"
                                : order.status === "delivered"
                                  ? "bg-purple-100 text-purple-800"
                                  : "bg-green-100 text-green-800"
                          }
                        >
                          {order.status}
                        </Badge>
                      )}
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
          order={{
            ...selectedOrder,
            items: selectedOrder.items.map(item => ({
              name: item.name,
              quantity: item.quantity,
              price: item.price,
              category: item.category
            }))
          }}
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
