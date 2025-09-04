import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export interface Notification {
  id: string
  message: string
  date: string
  read: boolean
  type: string
  priority: string
}

interface NotificationsTabProps {
  notifications: Notification[]
  onMarkAllAsRead: () => void
}

export default function NotificationsTab({ notifications, onMarkAllAsRead }: NotificationsTabProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
        <Button variant="outline" className="rounded-full bg-transparent" onClick={onMarkAllAsRead}>
          Mark All as Read
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="bg-white shadow-sm">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-red-600">{notifications.filter((n) => !n.read).length}</p>
            <p className="text-sm text-gray-600">Unread</p>
          </CardContent>
        </Card>
        <Card className="bg-white shadow-sm">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-yellow-600">
              {notifications.filter((n) => n.priority === "high").length}
            </p>
            <p className="text-sm text-gray-600">High Priority</p>
          </CardContent>
        </Card>
        <Card className="bg-white shadow-sm">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-blue-600">
              {notifications.filter((n) => n.type === "school").length}
            </p>
            <p className="text-sm text-gray-600">From School</p>
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
                    <p className="text-gray-900">{notification.message}</p>
                    <p className="text-sm text-gray-600 mt-1">{notification.date}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {!notification.read && <Badge className="bg-blue-500 text-white">New</Badge>}
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
