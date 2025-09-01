import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Order {
  id: number
  item: string
  date: string
  amount: string
  status: string
  category: string
  student: string
}

interface PendingOrdersTabProps {
  pendingOrders: Order[]
}

export default function PendingOrdersTab({ pendingOrders }: PendingOrdersTabProps) {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Pending Orders</h1>

      <Card className="bg-white shadow-sm">
        <CardContent className="p-6">
          <div className="space-y-4">
            {pendingOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <Clock className="h-6 w-6 text-yellow-500" />
                  <div>
                    <p className="font-medium text-gray-900">{order.item}</p>
                    <p className="text-sm text-gray-600">
                      Ordered on {order.date} • {order.category} • For {order.student}
                    </p>
                    <div className="mt-2">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            order.status === "processing" ? "bg-yellow-500 w-1/3" : "bg-blue-500 w-2/3"
                          }`}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {order.status === "processing" ? "Order being prepared" : "In transit"}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900">RWF {order.amount}</p>
                  <Badge
                    className={
                      order.status === "processing"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-blue-100 text-blue-800"
                    }
                  >
                    {order.status === "processing" ? "Processing" : "Shipped"}
                  </Badge>
                  <Button variant="outline" size="sm" className="mt-2 rounded-full bg-transparent">
                    <Eye className="h-3 w-3 mr-1" />
                    Track
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
