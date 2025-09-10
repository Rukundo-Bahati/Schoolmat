import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import {
  DollarSign,
  AlertTriangle,
  Download,
  Edit,
} from "lucide-react"
import PaymentMethodModal from "./payment-method-modal"

export default function SettingsTab() {
  const [schoolInfo, setSchoolInfo] = useState({
    name: "Kigali Primary School",
    email: "admin@kigaliprimary.edu.rw",
    phone: "+250 788 000 000",
    address: "KG 123 St, Kigali, Rwanda"
  })

  const [accountInfo, setAccountInfo] = useState({
    name: "School Administrator",
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  })

  const [businessSettings, setBusinessSettings] = useState({
    pickupLocation: "School Main Office",
    pickupStartTime: "8:00 AM",
    pickupEndTime: "4:00 PM",
    processingTime: "2",
    currency: "RWF"
  })

  const [systemPreferences, setSystemPreferences] = useState({
    defaultOrderStatus: "pending",
    autoApprove: "manual",
    lowStockThreshold: "10",
    retentionPeriod: "365"
  })

  const [notifications, setNotifications] = useState({
    newOrders: true,
    lowStock: true,
    payments: true,
    dailyReports: false,
    weeklyAnalytics: true
  })

  // Payment methods state
  const [paymentMethods, setPaymentMethods] = useState<{
    id: string;
    type: "mtn" | "airtel" | "card" | "bank";
    name: string;
    accountNumber: string;
    accountName: string;
    isActive: boolean;
  }[]>([
    {
      id: "1",
      type: "mtn",
      name: "MTN Mobile Money",
      accountNumber: "",
      accountName: "",
      isActive: true,
    },
    {
      id: "2",
      type: "airtel",
      name: "Airtel Money",
      accountNumber: "",
      accountName: "",
      isActive: true,
    },
    {
      id: "3",
      type: "card",
      name: "Visa Card",
      accountNumber: "",
      accountName: "",
      isActive: true,
    },
    {
      id: "4",
      type: "bank",
      name: "Irembo Pay",
      accountNumber: "",
      accountName: "",
      isActive: false,
    },
  ])

  // Modal state
  const [paymentModalOpen, setPaymentModalOpen] = useState(false)
  const [editingMethod, setEditingMethod] = useState<typeof paymentMethods[0] | null>(null)

  const handleSchoolInfoUpdate = async () => {
    try {
      // TODO: Replace with actual API call when backend endpoint is available
      // await updateSchoolInfo(schoolInfo)
      
      // Validate required fields
      if (!schoolInfo.name.trim() || !schoolInfo.email.trim() || !schoolInfo.phone.trim()) {
        alert("Please fill in all required fields!")
        return
      }
      
      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(schoolInfo.email)) {
        alert("Please enter a valid email address!")
        return
      }
      
      alert("School information updated successfully!")
    } catch (error) {
      console.error("Error updating school info:", error)
      alert("Failed to update school information. Please try again.")
    }
  }

  const handleAccountUpdate = () => {
    if (accountInfo.newPassword !== accountInfo.confirmPassword) {
      alert("New passwords do not match!")
      return
    }
    if (!accountInfo.currentPassword) {
      alert("Please enter your current password!")
      return
    }
    alert("Account information updated successfully!")
    setAccountInfo(prev => ({ ...prev, currentPassword: "", newPassword: "", confirmPassword: "" }))
  }

  const handleBusinessSettingsSave = () => {
    alert("Business settings saved successfully!")
  }

  const handleNotificationSettingsSave = () => {
    alert("Notification settings saved successfully!")
  }

  const handleSystemSettingsUpdate = () => {
    alert("System settings updated successfully!")
  }

  const handleExportData = () => {
    alert("Data export initiated. You will receive a download link via email.")
  }

  const handleResetSystem = () => {
    if (confirm("Are you sure you want to reset the system? This action cannot be undone!")) {
      alert("System reset initiated. This may take a few minutes.")
    }
  }
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
        <p className="text-gray-600">Manage your school supply system configuration</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* School Information */}
        <Card className="bg-white shadow-sm">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">School Information</h3>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">School Name</label>
                <Input 
                  value={schoolInfo.name}
                  onChange={(e) => setSchoolInfo(prev => ({ ...prev, name: e.target.value }))}
                  className="rounded-full" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Contact Email</label>
                <Input 
                  type="email" 
                  value={schoolInfo.email}
                  onChange={(e) => setSchoolInfo(prev => ({ ...prev, email: e.target.value }))}
                  className="rounded-full" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                <Input 
                  value={schoolInfo.phone}
                  onChange={(e) => setSchoolInfo(prev => ({ ...prev, phone: e.target.value }))}
                  className="rounded-full" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">School Address</label>
                <textarea
                  value={schoolInfo.address}
                  onChange={(e) => setSchoolInfo(prev => ({ ...prev, address: e.target.value }))}
                  rows={3}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2"
                />
              </div>
              <Button onClick={handleSchoolInfoUpdate} className="rounded-full bg-blue-700 hover:bg-blue-800">Update School Info</Button>
            </form>
          </CardContent>
        </Card>

        {/* Account Management */}
        <Card className="bg-white shadow-sm">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Management</h3>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Manager Name</label>
                <Input 
                  value={accountInfo.name}
                  onChange={(e) => setAccountInfo(prev => ({ ...prev, name: e.target.value }))}
                  className="rounded-full" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                <Input 
                  type="password" 
                  value={accountInfo.currentPassword}
                  onChange={(e) => setAccountInfo(prev => ({ ...prev, currentPassword: e.target.value }))}
                  placeholder="Enter current password" 
                  className="rounded-full" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                <Input 
                  type="password" 
                  value={accountInfo.newPassword}
                  onChange={(e) => setAccountInfo(prev => ({ ...prev, newPassword: e.target.value }))}
                  placeholder="Enter new password" 
                  className="rounded-full" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                <Input 
                  type="password" 
                  value={accountInfo.confirmPassword}
                  onChange={(e) => setAccountInfo(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  placeholder="Confirm new password" 
                  className="rounded-full" 
                />
              </div>
              <Button onClick={handleAccountUpdate} className="rounded-full bg-blue-700 hover:bg-blue-800">Update Account</Button>
            </form>
          </CardContent>
        </Card>

        {/* Business Settings */}
        <Card className="bg-white shadow-sm">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Business Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pickup Location</label>
                <Input defaultValue="School Main Office" className="rounded-full" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pickup Hours</label>
                <div className="grid grid-cols-2 gap-2">
                  <Input defaultValue="8:00 AM" placeholder="Start time" className="rounded-full" />
                  <Input defaultValue="4:00 PM" placeholder="End time" className="rounded-full" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Order Processing Time</label>
                <select className="w-full rounded-full border border-gray-300 px-4 py-2">
                  <option value="1">1 Business Day</option>
                  <option value="2" selected>
                    2 Business Days
                  </option>
                  <option value="3">3 Business Days</option>
                  <option value="5">1 Week</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                <select className="w-full rounded-full border border-gray-300 px-4 py-2">
                  <option value="RWF" selected>
                    Rwandan Franc (RWF)
                  </option>
                  <option value="USD">US Dollar (USD)</option>
                </select>
              </div>
              <Button onClick={handleBusinessSettingsSave} className="rounded-full bg-blue-700 hover:bg-blue-800">Save Business Settings</Button>
            </div>
          </CardContent>
        </Card>

        {/* Payment Methods */}
        <Card className="bg-white shadow-sm">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Methods</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                {paymentMethods.map((method) => (
                  <div key={method.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        method.type === 'mtn' ? 'bg-yellow-100 text-yellow-700' :
                        method.type === 'airtel' ? 'bg-red-100 text-red-700' :
                        method.type === 'card' ? 'bg-blue-100 text-blue-700' :
                        'bg-purple-100 text-purple-700'
                      }`}>
                        <span className="text-sm font-bold">
                          {method.type === 'mtn' ? 'M' :
                           method.type === 'airtel' ? 'A' :
                           method.type === 'card' ? 'V' : 'B'}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{method.name}</p>
                        <p className="text-sm text-gray-600">
                          {method.accountNumber ? `****${method.accountNumber.slice(-4)}` : 'Not configured'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={method.isActive}
                          onCheckedChange={(checked) => {
                            setPaymentMethods(prev =>
                              prev.map(m =>
                                m.id === method.id ? { ...m, isActive: checked } : m
                              )
                            )
                          }}
                        />
                        <span className={`text-sm font-medium ${method.isActive ? 'text-green-600' : 'text-gray-500'}`}>
                          {method.isActive ? 'Enabled' : 'Disabled'}
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setEditingMethod(method)
                          setPaymentModalOpen(true)
                        }}
                        title="Configure payment method"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                <Button
                  variant="outline"
                  className="w-full rounded-full bg-transparent"
                  onClick={() => {
                    setEditingMethod(null)
                    setPaymentModalOpen(true)
                  }}
                  title="Configure payment method"
                >
                  Configure Payment Method
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card className="bg-white shadow-sm">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Preferences</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">New Order Notifications</p>
                  <p className="text-sm text-gray-600">Get notified when new orders are placed</p>
                </div>
                <input type="checkbox" defaultChecked className="rounded" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Low Stock Alerts</p>
                  <p className="text-sm text-gray-600">Alert when products are running low</p>
                </div>
                <input type="checkbox" defaultChecked className="rounded" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Payment Confirmations</p>
                  <p className="text-sm text-gray-600">Notify when payments are received</p>
                </div>
                <input type="checkbox" defaultChecked className="rounded" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Daily Reports</p>
                  <p className="text-sm text-gray-600">Receive daily sales and order summaries</p>
                </div>
                <input type="checkbox" className="rounded" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Weekly Analytics</p>
                  <p className="text-sm text-gray-600">Weekly performance and insights reports</p>
                </div>
                <input type="checkbox" defaultChecked className="rounded" />
              </div>
              <Button onClick={handleNotificationSettingsSave} className="rounded-full bg-blue-700 hover:bg-blue-800">
                Save Notification Settings
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* System Preferences */}
        <Card className="bg-white shadow-sm">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">System Preferences</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Default Order Status</label>
                <select className="w-full rounded-full border border-gray-300 px-4 py-2">
                  <option value="pending" selected>
                    Pending
                  </option>
                  <option value="processing">Processing</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Auto-approve Orders</label>
                <select className="w-full rounded-full border border-gray-300 px-4 py-2">
                  <option value="manual" selected>
                    Manual Approval
                  </option>
                  <option value="auto">Auto Approve</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Low Stock Threshold</label>
                <Input type="number" defaultValue="10" className="rounded-full" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Order Retention Period</label>
                <select className="w-full rounded-full border border-gray-300 px-4 py-2">
                  <option value="30">30 Days</option>
                  <option value="90">90 Days</option>
                  <option value="365" selected>
                    1 Year
                  </option>
                  <option value="forever">Forever</option>
                </select>
              </div>
              <Button onClick={handleSystemSettingsUpdate} className="rounded-full bg-blue-700 hover:bg-blue-800">Update System Settings</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Danger Zone */}
      <Card className="bg-red-50 border-red-200 shadow-sm">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-red-900 mb-4">Danger Zone</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-red-900">Export All Data</p>
                <p className="text-sm text-red-700">Download a complete backup of all system data</p>
              </div>
              <Button
                onClick={handleExportData}
                variant="outline"
                className="rounded-full border-red-600 text-red-600 hover:bg-red-50 bg-transparent"
              >
                <Download className="h-4 w-4 mr-2" />
                Export Data
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-red-900">Reset System</p>
                <p className="text-sm text-red-700">Clear all orders and reset to default settings</p>
              </div>
              <Button
                onClick={handleResetSystem}
                variant="outline"
                className="rounded-full border-red-600 text-red-600 hover:bg-red-50 bg-transparent"
              >
                <AlertTriangle className="h-4 w-4 mr-2" />
                Reset System
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Method Modal */}
      <PaymentMethodModal
        isOpen={paymentModalOpen}
        onClose={() => {
          setPaymentModalOpen(false)
          setEditingMethod(null)
        }}
        onSave={(methodData) => {
          if (editingMethod) {
            // Update existing method
            setPaymentMethods(prev =>
              prev.map(m =>
                m.id === editingMethod.id ? { ...m, ...methodData } : m
              )
            )
          } else {
            // Add new method
            const newMethod = {
              ...methodData,
              id: Date.now().toString(),
              accountNumber: methodData.accountNumber || "",
              accountName: methodData.accountName || "",
            }
            setPaymentMethods(prev => [...prev, newMethod])
          }
        }}
        editingMethod={editingMethod}
      />
    </div>
  )
}
