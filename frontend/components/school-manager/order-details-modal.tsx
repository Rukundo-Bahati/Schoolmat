import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

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

interface OrderDetailsModalProps {
  order: Order
  isOpen: boolean
  onClose: () => void
}

export default function OrderDetailsModal({ order, isOpen, onClose }: OrderDetailsModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[90vw] max-w-none max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Order Details - {order.id}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Order Status and Date */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Badge
                className={
                  order.status === "pending"
                    ? "bg-yellow-100 text-yellow-800"
                    : order.status === "processing"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-green-100 text-green-800"
                }
              >
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </Badge>
              <span className="text-sm text-gray-600">Ordered on {order.orderDate}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Parent Information */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Parent Information</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Name</label>
                    <p className="text-gray-900">{order.parentName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Email</label>
                    <p className="text-gray-900">{order.parentEmail}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Phone</label>
                    <p className="text-gray-900">{order.parentPhone}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Student Information */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Student Information</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Name</label>
                    <p className="text-gray-900">{order.studentName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Grade</label>
                    <p className="text-gray-900">{order.studentGrade}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Class</label>
                    <p className="text-gray-900">{order.studentClass}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Items */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Order Items</h3>
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{item.name}</h4>
                      <p className="text-sm text-gray-600">Category: {item.category}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">Qty: {item.quantity}</p>
                      <p className="text-sm text-gray-600">RWF {item.price.toLocaleString()}</p>
                      <p className="font-medium text-gray-900">Subtotal: RWF {(item.quantity * item.price).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="my-4 border-t border-gray-200" />
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">Total Amount</span>
                <span className="text-2xl font-bold text-blue-700">RWF {order.totalAmount.toLocaleString()}</span>
              </div>
            </CardContent>
          </Card>

          {/* Payment and Delivery Information */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Payment Information</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Payment Method</label>
                    <p className="text-gray-900">{order.paymentMethod}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Amount Paid</label>
                    <p className="text-gray-900">RWF {order.totalAmount.toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Delivery Information</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Delivery Address</label>
                    <p className="text-gray-900">{order.deliveryAddress}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
