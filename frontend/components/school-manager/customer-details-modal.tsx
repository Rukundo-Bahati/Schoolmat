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

interface CustomerDetailsModalProps {
  orders: Order[]
  parentEmail: string
  isOpen: boolean
  onClose: () => void
}

export default function CustomerDetailsModal({ orders, parentEmail, isOpen, onClose }: CustomerDetailsModalProps) {
  // Aggregate customer data
  const parentOrders = orders.filter((o) => o.parentEmail === parentEmail)
  if (parentOrders.length === 0) return null

  const parent = parentOrders[0]
  const totalSpent = parentOrders.filter(order => order.status === 'delivered').reduce((sum, order) => sum + Number(order.totalAmount), 0)
  const totalOrders = parentOrders.filter(order => order.status === 'delivered').length
  const students = Array.from(new Set(parentOrders.map((o) => `${o.studentName} (${o.studentGrade})`)))
  const allItems = parentOrders.filter(order => order.status === 'delivered').flatMap(order => order.items)
  const itemCounts = allItems.reduce((acc, item) => {
    acc[item.name] = (acc[item.name] || 0) + item.quantity
    return acc
  }, {} as Record<string, number>)
  const topItems = Object.entries(itemCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([name, count]) => `${name} (${count})`)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="!max-w-[1000px] w-[96vw] max-h-[96vh] overflow-hidden flex flex-col p-0 sm:!max-w-[1000px]">
        <DialogHeader className="px-6 pt-6 pb-4">
          <DialogTitle className="text-2xl font-bold">Customer Details - {parent.parentName}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 px-6 pb-6 overflow-y-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Parent Information */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Parent Information</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Name</label>
                    <p className="text-gray-900">{parent.parentName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Email</label>
                    <p className="text-gray-900">{parent.parentEmail}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Phone</label>
                    <p className="text-gray-900">{parent.parentPhone}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Students */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Students</h3>
                <div className="space-y-2">
                  {students.map((student, index) => (
                    <p key={index} className="text-gray-900">{student}</p>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Purchase Summary */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Purchase Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Total Delivered Orders</label>
                  <p className="text-2xl font-bold text-gray-900">{totalOrders}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Total Spent</label>
                  <p className="text-2xl font-bold text-green-600">RWF {totalSpent.toLocaleString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Top Purchased Items</label>
                  <p className="text-sm text-gray-900">{topItems.join(', ')}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order History */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Order History</h3>
              <div className="space-y-4">
                {parentOrders.sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()).map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4">
                        <h4 className="font-medium text-gray-900">Order {order.id}</h4>
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
                      <p className="text-sm text-gray-600">Student: {order.studentName} ({order.studentGrade})</p>
                      <p className="text-sm text-gray-600">Date: {order.orderDate}</p>
                      <p className="text-sm text-gray-600">Items: {order.items.map(item => `${item.quantity}x ${item.name}`).join(', ')}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">RWF {order.totalAmount.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}
