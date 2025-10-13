import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

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
      <DialogContent className="!max-w-[1000px] w-[96vw] max-h-[96vh] overflow-hidden flex flex-col p-0 sm:!max-w-[1000px]">
        <DialogHeader className="px-8 pt-6 pb-4 border-b">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold">Order #{order.id}</DialogTitle>
            <div className="flex items-center gap-4">
              <Badge
                className={`px-4 py-2 text-base ${order.status === "pending"
                  ? "bg-yellow-100 text-yellow-800"
                  : order.status === "processing"
                    ? "bg-blue-100 text-blue-800"
                    : order.status === "cancelled"
                      ? "bg-red-100 text-red-800"
                      : "bg-green-100 text-green-800"
                  }`}
              >
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </Badge>
              <span className="text-base text-gray-600">{order.orderDate}</span>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-8 py-6">
          <div className="space-y-8">
            {/* Customer & Student Info - Side by Side */}
            <div className="grid grid-cols-3 gap-8">
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-900">Parent Information</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Name</p>
                    <p className="text-base font-medium text-gray-900">{order.parentName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="text-base font-medium text-gray-900">{order.parentEmail}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="text-base font-medium text-gray-900">{order.parentPhone}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-900">Student Information</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Name</p>
                    <p className="text-base font-medium text-gray-900">{order.studentName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Grade</p>
                    <p className="text-base font-medium text-gray-900">{order.studentGrade}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Class</p>
                    <p className="text-base font-medium text-gray-900">{order.studentClass}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-900">Delivery & Payment</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Payment Method</p>
                    <p className="text-base font-medium text-gray-900">{order.paymentMethod}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Delivery Address</p>
                    <p className="text-base font-medium text-gray-900">{order.deliveryAddress}</p>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Order Items Table */}
            <div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900">Order Items</h3>
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-100 border-b">
                    <tr>
                      <th className="text-left py-4 px-6 font-semibold text-gray-700">Item Name</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-700">Category</th>
                      <th className="text-center py-4 px-6 font-semibold text-gray-700">Quantity</th>
                      <th className="text-right py-4 px-6 font-semibold text-gray-700">Unit Price</th>
                      <th className="text-right py-4 px-6 font-semibold text-gray-700">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items.map((item, index) => (
                      <tr key={index} className="border-b last:border-b-0 hover:bg-gray-50">
                        <td className="py-4 px-6 font-medium text-gray-900">{item.name}</td>
                        <td className="py-4 px-6 text-gray-700">{item.category}</td>
                        <td className="py-4 px-6 text-center text-gray-900">{item.quantity}</td>
                        <td className="py-4 px-6 text-right text-gray-900">RWF {item.price.toLocaleString()}</td>
                        <td className="py-4 px-6 text-right font-medium text-gray-900">
                          RWF {(item.quantity * item.price).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Total */}
              <div className="mt-6 flex justify-end">
                <div className="bg-blue-50 rounded-lg px-8 py-6 min-w-[400px]">
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-semibold text-gray-900">Total Amount</span>
                    <span className="text-3xl font-bold text-blue-700">RWF {order.totalAmount.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
