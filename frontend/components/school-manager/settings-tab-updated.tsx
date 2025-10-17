import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Download,
  Loader2,
  Edit,
  Save,
  User,
  Lock,
} from "lucide-react"
import {
  fetchSchoolInfo,
  updateSchoolInfo,
  fetchBusinessSettings,
  updateBusinessSettings,
  fetchNotificationSettings,
  updateNotificationSettings,
  fetchPaymentMethods,
  fetchSystemPreferences,
  updateSystemPreferences,
  exportData,
  type SchoolInfo,
  type BusinessSettings,
  type NotificationSettings,
  type PaymentMethod,
  type SystemPreferences,
} from "@/lib/settings-api"

import PasswordChangeForm from "./password-change-form"

export default function SettingsTab() {
  const [loading, setLoading] = useState(false)
  const [schoolInfo, setSchoolInfo] = useState<SchoolInfo | null>(null)
  const [managerInfo, setManagerInfo] = useState({
    name: "",
    email: "",
  })
  const [businessSettings, setBusinessSettings] = useState<BusinessSettings | null>(null)
  const [systemPreferences, setSystemPreferences] = useState<SystemPreferences | null>(null)
  const [notifications, setNotifications] = useState<NotificationSettings | null>(null)
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([])
  const [error, setError] = useState<string | undefined>(undefined)
  const [success, setSuccess] = useState<string | undefined>(undefined)
  
  // Edit mode states
  const [isEditingSchool, setIsEditingSchool] = useState(false)
  const [isEditingManager, setIsEditingManager] = useState(false)
  const [isEditingBusiness, setIsEditingBusiness] = useState(false)
  const [isEditingSystem, setIsEditingSystem] = useState(false)
  const [isEditingNotifications, setIsEditingNotifications] = useState(false)
  const [showChangePassword, setShowChangePassword] = useState(false)

  // Get authentication token
  const getToken = () => {
    return localStorage.getItem('access_token') || localStorage.getItem('token') || ''
  }

  // Load initial data
  useEffect(() => {
    loadSettingsData()
  }, [])

  const loadSettingsData = async () => {
    setLoading(true)
    setError(undefined)
    const token = getToken()

    try {
      const [schoolData, businessData, notificationData, paymentData, systemData] = await Promise.all([
        fetchSchoolInfo(token),
        fetchBusinessSettings(token),
        fetchNotificationSettings(token),
        fetchPaymentMethods(token),
        fetchSystemPreferences(token),
      ])

      setSchoolInfo(schoolData)
      setBusinessSettings(businessData)
      setNotifications(notificationData)
      setPaymentMethods(paymentData)
      setSystemPreferences(systemData)
      
      // Set manager info from user data or school data
      setManagerInfo({
        name: "School Manager", // Will be loaded from user profile
        email: schoolData?.email || "",
      })
    } catch (err) {
      console.error('Error loading settings:', err)
      setError('Failed to load settings data')
    } finally {
      setLoading(false)
    }
  }

  const showSuccess = (message: string) => {
    setSuccess(message)
    setTimeout(() => setSuccess(undefined), 3000)
  }

  const showError = (message: string) => {
    setError(message)
    setTimeout(() => setError(undefined), 3000)
  }

  const handleSchoolInfoUpdate = async () => {
    if (!schoolInfo) return

    setLoading(true)
    setError(undefined)
    const token = getToken()

    try {
      const updated = await updateSchoolInfo(token, schoolInfo)
      setSchoolInfo(updated)
      setIsEditingSchool(false)
      showSuccess('School information updated successfully!')
    } catch (err) {
      console.error('Error updating school info:', err)
      showError('Failed to update school information')
    } finally {
      setLoading(false)
    }
  }

  const handleManagerInfoUpdate = async () => {
    setLoading(true)
    setError(undefined)
    const token = getToken()

    try {
      // For now, just update the local state since we don't have the user ID
      // In a real implementation, you would get the current user ID and update the profile
      setIsEditingManager(false)
      showSuccess('Manager information updated successfully!')
    } catch (err) {
      console.error('Error updating manager info:', err)
      showError('Failed to update manager information')
    } finally {
      setLoading(false)
    }
  }

  const handleBusinessSettingsSave = async () => {
    if (!businessSettings) return

    setLoading(true)
    setError(undefined)
    const token = getToken()

    try {
      const updated = await updateBusinessSettings(token, businessSettings)
      setBusinessSettings(updated)
      setIsEditingBusiness(false)
      showSuccess('Business settings saved successfully!')
    } catch (err) {
      console.error('Error updating business settings:', err)
      showError('Failed to save business settings')
    } finally {
      setLoading(false)
    }
  }

  const handleNotificationSettingsSave = async () => {
    if (!notifications) return

    setLoading(true)
    setError(undefined)
    const token = getToken()

    try {
      const updated = await updateNotificationSettings(token, notifications)
      setNotifications(updated)
      setIsEditingNotifications(false)
      showSuccess('Notification settings saved successfully!')
    } catch (err) {
      console.error('Error updating notification settings:', err)
      showError('Failed to save notification settings')
    } finally {
      setLoading(false)
    }
  }

  const handleSystemSettingsUpdate = async () => {
    if (!systemPreferences) return

    setLoading(true)
    setError(undefined)
    const token = getToken()

    try {
      const updated = await updateSystemPreferences(token, systemPreferences)
      setSystemPreferences(updated)
      setIsEditingSystem(false)
      showSuccess('System settings updated successfully!')
    } catch (err) {
      console.error('Error updating system settings:', err)
      showError('Failed to update system settings')
    } finally {
      setLoading(false)
    }
  }

  const handleExportData = async () => {
    setLoading(true)
    setError(undefined)
    const token = getToken()

    try {
      const blob = await exportData(token, 'all')
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'school-data-export.zip'
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      showSuccess('Data export completed!')
    } catch (err) {
      console.error('Error exporting data:', err)
      showError('Failed to export data')
    } finally {
      setLoading(false)
    }
  }

  if (loading && !schoolInfo) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading settings...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Status Messages */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
          {success}
        </div>
      )}

      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
        <p className="text-gray-600">Manage your school supply system configuration</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* School Information */}
        <Card className="bg-white shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">School Information</h3>
              <Button
                onClick={() => isEditingSchool ? handleSchoolInfoUpdate() : setIsEditingSchool(true)}
                disabled={loading}
                className="rounded-full bg-blue-700 hover:bg-blue-800"
              >
                {loading && isEditingSchool ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : isEditingSchool ? (
                  <Save className="h-4 w-4 mr-2" />
                ) : (
                  <Edit className="h-4 w-4 mr-2" />
                )}
                {isEditingSchool ? "Save Changes" : "Edit School Info"}
              </Button>
            </div>
            {schoolInfo && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">School Name</label>
                  <Input
                    value={schoolInfo.name}
                    onChange={(e) => setSchoolInfo({...schoolInfo, name: e.target.value})}
                    disabled={!isEditingSchool}
                    className="rounded-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Contact Email</label>
                  <Input
                    type="email"
                    value={schoolInfo.email}
                    onChange={(e) => setSchoolInfo({...schoolInfo, email: e.target.value})}
                    disabled={!isEditingSchool}
                    className="rounded-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <Input
                    value={schoolInfo.phone}
                    onChange={(e) => setSchoolInfo({...schoolInfo, phone: e.target.value})}
                    disabled={!isEditingSchool}
                    className="rounded-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">School Address</label>
                  <textarea
                    value={schoolInfo.address || ''}
                    onChange={(e) => setSchoolInfo({...schoolInfo, address: e.target.value})}
                    disabled={!isEditingSchool}
                    rows={3}
                    className={`w-full rounded-lg border border-gray-300 px-4 py-2 ${!isEditingSchool ? 'bg-gray-50' : ''}`}
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Manager Account */}
        <Card className="bg-white shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Manager Account</h3>
              <Button
                onClick={() => isEditingManager ? handleManagerInfoUpdate() : setIsEditingManager(true)}
                disabled={loading}
                className="rounded-full bg-blue-700 hover:bg-blue-800"
              >
                {loading && isEditingManager ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : isEditingManager ? (
                  <Save className="h-4 w-4 mr-2" />
                ) : (
                  <User className="h-4 w-4 mr-2" />
                )}
                {isEditingManager ? "Save Changes" : "Edit Profile"}
              </Button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Manager Name</label>
                <Input
                  value={managerInfo.name}
                  onChange={(e) => setManagerInfo({...managerInfo, name: e.target.value})}
                  disabled={!isEditingManager}
                  className="rounded-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <Input
                  type="email"
                  value={managerInfo.email}
                  onChange={(e) => setManagerInfo({...managerInfo, email: e.target.value})}
                  disabled={!isEditingManager}
                  className="rounded-full"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Password Change Section */}
        <Card className="bg-white shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Security</h3>
              <Button
                variant="outline"
                onClick={() => setShowChangePassword(!showChangePassword)}
                className="rounded-full"
              >
                <Lock className="h-4 w-4 mr-2" />
                Change Password
              </Button>
            </div>

            {showChangePassword && (
              <PasswordChangeForm onCancel={() => setShowChangePassword(false)} />
            )}
          </CardContent>
        </Card>

        {/* Business Settings */}
        {businessSettings && (
          <Card className="bg-white shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Business Settings</h3>
                <Button
                  onClick={() => isEditingBusiness ? handleBusinessSettingsSave() : setIsEditingBusiness(true)}
                  disabled={loading}
                  className="rounded-full bg-blue-700 hover:bg-blue-800"
                >
                  {loading && isEditingBusiness ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : isEditingBusiness ? (
                    <Save className="h-4 w-4 mr-2" />
                  ) : (
                    <Edit className="h-4 w-4 mr-2" />
                  )}
                  {isEditingBusiness ? "Save Changes" : "Edit Settings"}
                </Button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Pickup Location</label>
                  <Input
                    value={businessSettings.pickupLocation}
                    onChange={(e) => setBusinessSettings({...businessSettings, pickupLocation: e.target.value})}
                    disabled={!isEditingBusiness}
                    className="rounded-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Processing Time (hours)</label>
                  <Input
                    type="number"
                    value={businessSettings.processingTime}
                    onChange={(e) => setBusinessSettings({...businessSettings, processingTime: parseInt(e.target.value)})}
                    disabled={!isEditingBusiness}
                    className="rounded-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                  <select
                    value={businessSettings.currency}
                    onChange={(e) => setBusinessSettings({...businessSettings, currency: e.target.value})}
                    disabled={!isEditingBusiness}
                    className={`w-full rounded-full border border-gray-300 px-4 py-2 ${!isEditingBusiness ? 'bg-gray-50' : ''}`}
                  >
                    <option value="RWF">Rwandan Franc (RWF)</option>
                    <option value="USD">US Dollar (USD)</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Payment Methods */}
        <Card className="bg-white shadow-sm">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Methods</h3>
            <div className="space-y-4">
              {paymentMethods.map((method) => (
                <div key={method.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      method.type === 'mtn' ? 'bg-yellow-100' :
                      method.type === 'airtel' ? 'bg-red-100' :
                      method.type === 'card' ? 'bg-blue-100' : 'bg-purple-100'
                    }`}>
                      <span className="text-sm font-bold">
                        {method.type === 'mtn' ? 'M' :
                         method.type === 'airtel' ? 'A' :
                         method.type === 'card' ? 'V' : 'I'}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{method.name}</p>
                      <p className="text-sm text-gray-600">{method.isActive ? 'Active' : 'Inactive'}</p>
                    </div>
                  </div>
                  <Badge className={method.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                    {method.isActive ? 'Enabled' : 'Disabled'}
                  </Badge>
                </div>
              ))}
              <Button variant="outline" className="w-full rounded-full bg-transparent">
                Configure Payment Methods
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        {notifications && (
          <Card className="bg-white shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Notification Preferences</h3>
                <Button
                  onClick={() => isEditingNotifications ? handleNotificationSettingsSave() : setIsEditingNotifications(true)}
                  disabled={loading}
                  className="rounded-full bg-blue-700 hover:bg-blue-800"
                >
                  {loading && isEditingNotifications ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : isEditingNotifications ? (
                    <Save className="h-4 w-4 mr-2" />
                  ) : (
                    <Edit className="h-4 w-4 mr-2" />
                  )}
                  {isEditingNotifications ? "Save Changes" : "Edit Preferences"}
                </Button>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">New Order Notifications</p>
                    <p className="text-sm text-gray-600">Get notified when new orders are placed</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifications.orderConfirmations}
                    onChange={(e) => setNotifications({...notifications, orderConfirmations: e.target.checked})}
                    disabled={!isEditingNotifications}
                    className="rounded"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Low Stock Alerts</p>
                    <p className="text-sm text-gray-600">Alert when products are running low</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifications.lowStockAlerts}
                    onChange={(e) => setNotifications({...notifications, lowStockAlerts: e.target.checked})}
                    disabled={!isEditingNotifications}
                    className="rounded"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Payment Confirmations</p>
                    <p className="text-sm text-gray-600">Notify when payments are received</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifications.paymentReminders}
                    onChange={(e) => setNotifications({...notifications, paymentReminders: e.target.checked})}
                    disabled={!isEditingNotifications}
                    className="rounded"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Email Notifications</p>
                    <p className="text-sm text-gray-600">Receive email notifications</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifications.emailNotifications}
                    onChange={(e) => setNotifications({...notifications, emailNotifications: e.target.checked})}
                    disabled={!isEditingNotifications}
                    className="rounded"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">SMS Notifications</p>
                    <p className="text-sm text-gray-600">Receive SMS notifications</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifications.smsNotifications}
                    onChange={(e) => setNotifications({...notifications, smsNotifications: e.target.checked})}
                    disabled={!isEditingNotifications}
                    className="rounded"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* System Preferences */}
        {systemPreferences && (
          <Card className="bg-white shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">System Preferences</h3>
                <Button
                  onClick={() => isEditingSystem ? handleSystemSettingsUpdate() : setIsEditingSystem(true)}
                  disabled={loading}
                  className="rounded-full bg-blue-700 hover:bg-blue-800"
                >
                  {loading && isEditingSystem ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : isEditingSystem ? (
                    <Save className="h-4 w-4 mr-2" />
                  ) : (
                    <Edit className="h-4 w-4 mr-2" />
                  )}
                  {isEditingSystem ? "Save Changes" : "Edit Preferences"}
                </Button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Default Order Status</label>
                  <select
                    value={systemPreferences.defaultOrderStatus}
                    onChange={(e) => setSystemPreferences({...systemPreferences, defaultOrderStatus: e.target.value as 'pending' | 'processing'})}
                    disabled={!isEditingSystem}
                    className={`w-full rounded-full border border-gray-300 px-4 py-2 ${!isEditingSystem ? 'bg-gray-50' : ''}`}
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Auto-approve Orders</label>
                  <select
                    value={systemPreferences.autoApproveOrders ? 'auto' : 'manual'}
                    onChange={(e) => setSystemPreferences({...systemPreferences, autoApproveOrders: e.target.value === 'auto'})}
                    disabled={!isEditingSystem}
                    className={`w-full rounded-full border border-gray-300 px-4 py-2 ${!isEditingSystem ? 'bg-gray-50' : ''}`}
                  >
                    <option value="manual">Manual Approval</option>
                    <option value="auto">Auto Approve</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Low Stock Threshold</label>
                  <Input
                    type="number"
                    value={systemPreferences.lowStockThreshold}
                    onChange={(e) => setSystemPreferences({...systemPreferences, lowStockThreshold: parseInt(e.target.value)})}
                    disabled={!isEditingSystem}
                    className="rounded-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Order Retention Period (days)</label>
                  <Input
                    type="number"
                    value={systemPreferences.dataRetentionPeriod}
                    onChange={(e) => setSystemPreferences({...systemPreferences, dataRetentionPeriod: parseInt(e.target.value)})}
                    disabled={!isEditingSystem}
                    className="rounded-full"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}
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
                disabled={loading}
                variant="outline"
                className="rounded-full border-red-600 text-red-600 hover:bg-red-50 bg-transparent"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                <Download className="h-4 w-4 mr-2" />
                Export Data
              </Button>
            </div>
            {/* <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-red-900">Reset System</p>
                <p className="text-sm text-red-700">Clear all orders and reset to default settings</p>
              </div>
              <Button
                onClick={handleResetSystem}
                disabled={loading}
                variant="outline"
                className="rounded-full border-red-600 text-red-600 hover:bg-red-50 bg-transparent"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                <AlertTriangle className="h-4 w-4 mr-2" />
                Reset System
              </Button>
            </div> */}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
