"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
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
  allPurchases,
  pendingOrders,
  notifications,
  monthlySpendingData,
  categorySpendingData,
  materialPurchasePerTermData,
  sidebarItems,
  type Purchase,
  type Notification,
} from "@/mock-data"

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement)

export default function ParentDashboard() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("overview")
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [showChangePassword, setShowChangePassword] = useState(false)
  const [filterStatus, setFilterStatus] = useState("all")
  const [profileData, setProfileData] = useState({
    parentName: "John Doe",
    email: "john.doe@email.com",
    phone: "+250 788 123 456",
    studentName: "Jane Doe",
    studentGrade: "Grade 5",
    studentClass: "5A",
    address: "Kigali, Rwanda",
  })

  const filteredPurchases = allPurchases.filter((purchase) => {
    if (filterStatus === "all") return true
    return purchase.status === filterStatus
  })

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

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
    },
  }

  return (
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
            {activeTab === "overview" && (
              <OverviewTab
                allPurchases={allPurchases}
                pendingOrders={pendingOrders}
                monthlySpendingData={monthlySpendingData}
                categorySpendingData={categorySpendingData}
                orderTrendData={materialPurchasePerTermData}
                chartOptions={chartOptions}
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
                notifications={notifications}
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
  )
}
