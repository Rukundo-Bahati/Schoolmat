"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import ProtectedRoute from "@/components/protected-route"
import {
  User,
  ShoppingBag,
  Bell,
  Settings,
  LogOut,
  TrendingUp,
  Clock,
} from "lucide-react"

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from "chart.js"
import { Bar, Doughnut, Line } from "react-chartjs-2"

import { generateOrderHistoryPDF, generateSingleOrderPDF, downloadPDF, type OrderData } from "@/lib/pdf-generator"
import DashboardNavbar from "@/components/parent-dashboard/dashboard-navbar"
import Sidebar from "@/components/parent-dashboard/sidebar"
import OverviewTab from "@/components/parent-dashboard/overview-tab"
import PurchasesTab from "@/components/parent-dashboard/purchases-tab"
import PendingOrdersTab from "@/components/parent-dashboard/pending-orders-tab"
import NotificationsTab from "@/components/parent-dashboard/notifications-tab"
import ProfileTab from "@/components/parent-dashboard/profile-tab"
import SettingsTab from "@/components/parent-dashboard/settings-tab"

import {
  fetchParentDashboardOverview,
  fetchParentOrders,
  fetchParentNotifications,
  fetchParentProfile,
  type ParentDashboardOverview,
  type ParentOrder,
  type ParentNotification,
  type ParentProfile,
} from "@/lib/api"

import { sidebarItems } from "@/mock-data"

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement)

export default function ParentDashboard() {
  const router = useRouter()
  const { user, token } = useAuth()
  const [activeTab, setActiveTab] = useState("overview")
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [showChangePassword, setShowChangePassword] = useState(false)
  const [filterStatus, setFilterStatus] = useState("all")

  // API data states
  const [dashboardOverview, setDashboardOverview] = useState<ParentDashboardOverview | null>(null)
  const [parentOrders, setParentOrders] = useState<ParentOrder[]>([])
  const [parentNotifications, setParentNotifications] = useState<ParentNotification[]>([])
  const [parentProfile, setParentProfile] = useState<ParentProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Legacy profile data for compatibility
  const [profileData, setProfileData] = useState({
    parentName: "John Doe",
    email: "john.doe@email.com",
    phone: "+250 788 123 456",
    studentName: "Jane Doe",
    studentGrade: "Grade 5",
    studentClass: "5A",
    address: "Kigali, Rwanda",
  })

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      if (!token) return

      try {
        setLoading(true)
        setError(null)

        // Fetch all data in parallel
        const [overviewData, ordersData, notificationsData, profileData] = await Promise.all([
          fetchParentDashboardOverview(token),
          fetchParentOrders(token),
          fetchParentNotifications(token),
          fetchParentProfile(token),
        ])

        setDashboardOverview(overviewData)
        setParentOrders(ordersData)
        setParentNotifications(notificationsData)
        setParentProfile(profileData)

        // Update legacy profile data for compatibility
        if (profileData) {
          // Get student information from the first order (assuming parent has orders for their child)
          const firstOrder = ordersData.length > 0 ? ordersData[0] : null

          setProfileData({
            parentName: `${profileData.firstName} ${profileData.lastName}`,
            email: profileData.email,
            phone: profileData.phone || "+250 788 123 456",
            studentName: firstOrder?.studentName || "No Student Information Available",
            studentGrade: firstOrder?.studentGrade || "Grade Not Specified",
            studentClass: firstOrder?.studentClass || "Class Not Specified",
            address: "Kigali, Rwanda",
          })
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err)
        setError('Failed to load dashboard data. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [token])

  // Transform API data to match component expectations
  const allPurchases = parentOrders.map((order, index) => ({
    id: parseInt(order.id) || index + 1,
    item: order.items[0]?.productName || 'Multiple Items',
    date: order.orderDate,
    amount: order.totalAmount.toString(),
    status: order.status,
    category: order.items[0]?.category || 'Mixed',
    student: order.studentName,
  }))

  // For purchases tab - only delivered orders
  const deliveredPurchases = parentOrders
    .filter(order => order.status === 'delivered')
    .map((order, index) => ({
      id: parseInt(order.id) || index + 1,
      item: order.items[0]?.productName || 'Multiple Items',
      date: order.orderDate,
      amount: order.totalAmount.toString(),
      status: order.status,
      category: order.items[0]?.category || 'Mixed',
      student: order.studentName,
    }))

  // For purchases tab filtering
  const filteredPurchases = deliveredPurchases.filter((order) => {
    if (filterStatus === "all") return true
    return order.status === filterStatus
  })

  const pendingOrders = parentOrders.filter(order =>
    order.status === 'pending' || order.status === 'processing'
  ).map((order, index) => ({
    id: parseInt(order.id) || index + 1,
    item: order.items[0]?.productName || 'Multiple Items',
    date: order.orderDate,
    amount: order.totalAmount.toString(),
    status: order.status,
    category: order.items[0]?.category || 'Mixed',
    student: order.studentName,
  }))

  const notifications = parentNotifications.map((notification) => ({
    id: notification.id,
    message: notification.message,
    date: notification.createdAt,
    read: notification.isRead,
    type: notification.type,
    priority: 'medium', // Default priority
  }))

  // Chart data from API
  const monthlySpendingData = dashboardOverview ? {
    labels: dashboardOverview.monthlySpending.map(item => item.month),
    datasets: [{
      label: "Monthly Spending (RWF)",
      data: dashboardOverview.monthlySpending.map(item => Number(item.total)),
      backgroundColor: "rgba(59, 130, 246, 0.8)",
      borderColor: "rgba(59, 130, 246, 1)",
      borderWidth: 1,
    }],
  } : null

  const categorySpendingData = dashboardOverview ? {
    labels: dashboardOverview.categorySpending.map(item => item.category),
    datasets: [{
      label: "Spending by Category",
      data: dashboardOverview.categorySpending.map(item => Number(item.total)),
      backgroundColor: ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#06B6D4"],
      borderColor: ["#2563EB", "#059669", "#D97706", "#DC2626", "#7C3AED", "#0891B2"],
      borderWidth: 2,
    }],
  } : null

  // Calculate term-based spending for the current year
  const currentYear = new Date().getFullYear()
  const termDeliveredPurchases = allPurchases.filter(p => p.status === 'delivered')

  // Function to get term based on month (1-12)
  const getTerm = (month: number) => {
    if (month >= 9 && month <= 12) return 1 // Term 1: Sep-Dec
    if (month >= 1 && month <= 3) return 2  // Term 2: Jan-Mar
    if (month >= 4 && month <= 6) return 3  // Term 3: Apr-Jun
    return null // Outside school terms
  }

  // Aggregate amounts by term for current year
  const termTotals = { 1: 0, 2: 0, 3: 0 }
  termDeliveredPurchases.forEach(purchase => {
    const orderDate = new Date(purchase.date)
    if (orderDate.getFullYear() === currentYear) {
      const month = orderDate.getMonth() + 1 // getMonth() returns 0-11
      const term = getTerm(month)
      if (term) {
        termTotals[term as keyof typeof termTotals] += Number.parseInt(purchase.amount.replace(",", ""))
      }
    }
  })

  const materialPurchasePerTermData = {
    labels: ["Term 1 (Sep-Dec)", "Term 2 (Jan-Mar)", "Term 3 (Apr-Jun)"],
    datasets: [{
      label: "Amount Paid per Term (RWF)",
      data: [termTotals[1], termTotals[2], termTotals[3]],
      borderColor: "rgba(59, 130, 246, 1)",
      backgroundColor: "rgba(59, 130, 246, 0.1)",
      tension: 0.4,
      fill: true,
    }],
  }

  const handleLogout = () => {
    router.push("/")
  }

  const handleDownloadOrderHistory = async () => {
    const schoolInfo = {
      name: "Kigali Primary School",
      address: "KG 123 St, Kigali, Rwanda",
      phone: "+250 788 000 000",
      email: "admin@kigaliprimary.edu.rw",
    }

    const ordersForPDF: OrderData[] = filteredPurchases.map((purchase) => ({
      id: `ORD-${purchase.id.toString().padStart(3, "0")}`,
      item: purchase.item,
      date: purchase.date,
      amount: purchase.amount,
      status: purchase.status,
      category: purchase.category,
      student: purchase.student,
    }))

    try {
      const doc = await generateOrderHistoryPDF(ordersForPDF, profileData, schoolInfo)
      downloadPDF(
        doc,
        `order-history-${profileData.studentName.replace(" ", "-")}-${new Date().toISOString().split("T")[0]}.pdf`,
      )
    } catch (error) {
      console.error("Error generating PDF:", error)
      alert("Error generating PDF. Please try again.")
    }
  }

  const handleDownloadSingleOrder = async (purchase: any) => {
    const schoolInfo = {
      name: "Kigali Primary School",
      address: "KG 123 St, Kigali, Rwanda",
      phone: "+250 788 000 000",
      email: "admin@kigaliprimary.edu.rw",
    }

    const orderForPDF: OrderData = {
      id: `ORD-${purchase.id.toString().padStart(3, "0")}`,
      item: purchase.item,
      date: purchase.date,
      amount: purchase.amount,
      status: purchase.status,
      category: purchase.category,
      student: purchase.student,
    }

    try {
      const doc = await generateSingleOrderPDF(orderForPDF, profileData, schoolInfo)
      downloadPDF(doc, `receipt-${orderForPDF.id}-${new Date().toISOString().split("T")[0]}.pdf`)
    } catch (error) {
      console.error("Error generating PDF:", error)
      alert("Error generating PDF. Please try again.")
    }
  }

  const lineChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
    },
    scales: {
      y: {
        ticks: {
          callback: function(value: any) {
            return 'RWF ' + Number(value).toLocaleString();
          }
        }
      }
    }
  }

  const doughnutChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false, // Disable built-in legend since we have custom legend below
      },
    },
  }

  if (loading) {
    return (
      <ProtectedRoute requiredRole="parent">
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  if (error) {
    return (
      <ProtectedRoute requiredRole="parent">
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute requiredRole="parent">
      <div className="min-h-screen bg-gray-50">
        <DashboardNavbar
          notificationsCount={notifications.filter((n) => !n.read).length}
          onLogout={handleLogout}
        />

        <div className="flex pt-16">
          <Sidebar
            sidebarItems={sidebarItems}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            profileData={profileData}
            notificationsCount={notifications.filter((n) => !n.read).length}
          />

          {/* Main Content */}
          <main className="flex-1 ml-80 p-6 lg:p-8 max-w-full overflow-x-hidden">
            <div className="max-w-7xl mx-auto">
              {activeTab === "overview" && dashboardOverview && monthlySpendingData && categorySpendingData && materialPurchasePerTermData && (
                <OverviewTab
                  allPurchases={filteredPurchases}
                  pendingOrders={pendingOrders}
                  monthlySpendingData={monthlySpendingData}
                  categorySpendingData={categorySpendingData}
                  orderTrendData={materialPurchasePerTermData}
                  lineChartOptions={lineChartOptions}
                  doughnutChartOptions={doughnutChartOptions}
                />
              )}

              {activeTab === "purchases" && (
                <PurchasesTab
                  filteredPurchases={filteredPurchases}
                  filterStatus={filterStatus}
                  onFilterChange={setFilterStatus}
                  onDownloadOrderHistory={handleDownloadOrderHistory}
                  onDownloadSingleOrder={handleDownloadSingleOrder}
                />
              )}

              {activeTab === "pending" && (
                <PendingOrdersTab pendingOrders={pendingOrders} />
              )}

              {activeTab === "notifications" && (
                <NotificationsTab
                  notifications={notifications as any}
                  onMarkAllAsRead={() => {}}
                />
              )}

              {activeTab === "profile" && (
                <ProfileTab
                  profileData={profileData}
                  isEditingProfile={isEditingProfile}
                  showChangePassword={showChangePassword}
                  onProfileDataChange={setProfileData}
                  onEditToggle={() => setIsEditingProfile(!isEditingProfile)}
                  onPasswordToggle={() => setShowChangePassword(!showChangePassword)}
                />
              )}

              {activeTab === "settings" && (
                <SettingsTab />
              )}
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}
