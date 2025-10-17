import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trash2 } from "lucide-react"

export interface Notification {
  id: string // UUID for deletion
  displayId?: number // User-friendly display ID
  message: string
  date: string
  read: boolean
  type: string
  priority: string
  orderId?: string
}

interface NotificationsTabProps {
  notifications: Notification[]
  onMarkAllAsRead: () => void
  onDeleteNotification?: (id: string | number) => void
}

export default function NotificationsTab({ notifications, onMarkAllAsRead, onDeleteNotification }: NotificationsTabProps) {
  // Function to format order ID to user-friendly format
  const formatOrderId = (orderId: string, date: string) => {
    const orderDate = new Date(date)
    const year = orderDate.getFullYear()
    const month = String(orderDate.getMonth() + 1).padStart(2, '0')
    const shortId = orderId.slice(-6).toUpperCase()
    return `${year}-${month}-${shortId}`
  }

  // Function to replace UUID in message with user-friendly order number
  const formatNotificationMessage = (message: string, orderId?: string, date?: string) => {
    if (!orderId || !date) return message
    
    const userFriendlyId = formatOrderId(orderId, date)
    // Replace any occurrence of the UUID with the user-friendly format
    return message.replace(orderId, userFriendlyId)
  }
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
        <Button variant="outline" className="rounded-full bg-transparent" onClick={onMarkAllAsRead}>
          Mark All as Read
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="bg-gradient-to-br from-red-50 to-red-100 border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <CardContent className="p-6 text-center">
            <div className="flex flex-col items-center space-y-2">
              <div className="p-3 bg-red-500 rounded-full shadow-lg mb-2">
                <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-red-500">{notifications.filter((n) => !n.read).length}</span>
                </div>
              </div>
              <p className="text-3xl font-bold text-red-900">{notifications.filter((n) => !n.read).length}</p>
              <p className="text-sm font-medium text-red-700">Unread</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <CardContent className="p-6 text-center">
            <div className="flex flex-col items-center space-y-2">
              <div className="p-3 bg-yellow-500 rounded-full shadow-lg mb-2">
                <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-yellow-500">!</span>
                </div>
              </div>
              <p className="text-3xl font-bold text-yellow-900">
                {notifications.filter((n) => n.priority === "high").length}
              </p>
              <p className="text-sm font-medium text-yellow-700">High Priority</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <CardContent className="p-6 text-center">
            <div className="flex flex-col items-center space-y-2">
              <div className="p-3 bg-blue-500 rounded-full shadow-lg mb-2">
                <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-blue-500">📚</span>
                </div>
              </div>
              <p className="text-3xl font-bold text-blue-900">
                {notifications.filter((n) => n.type === "school").length}
              </p>
              <p className="text-sm font-medium text-blue-700">From School</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white shadow-sm">
        <CardContent className="p-6">
          <div className="space-y-4">
            {notifications.map((notification, index) => (
              <div
                key={`${notification.id}-${index}`}
                className={`p-4 border rounded-lg ${!notification.read ? "bg-blue-50 border-blue-200" : ""}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge
                        className={`text-xs ${
                          notification.type === "school"
                            ? "bg-blue-100 text-blue-800"
                            : notification.type === "order"
                              ? "bg-green-100 text-green-800"
                              : notification.type === "payment"
                                ? "bg-purple-100 text-purple-800"
                                : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {notification.type}
                      </Badge>
                      <Badge
                        className={`text-xs ${
                          notification.priority === "high"
                            ? "bg-red-100 text-red-800"
                            : notification.priority === "medium"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {notification.priority}
                      </Badge>
                    </div>
                    <p className="text-gray-900">
                      {formatNotificationMessage(notification.message, notification.orderId, notification.date)}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">{notification.date}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {!notification.read && <Badge className="bg-blue-500 text-white">New</Badge>}
                    {onDeleteNotification && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onDeleteNotification(notification.id)}
                        className="rounded-full text-red-600 border-red-600 hover:bg-red-50 bg-transparent p-2"
                        title="Delete notification"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
