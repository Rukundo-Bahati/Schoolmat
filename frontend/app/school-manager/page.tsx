"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  BarChart3,
  ShoppingCart,
  Package,
  Users,
  TrendingUp,
  Settings,
  Search,
  Download,
  Eye,
  Edit,
  Plus,
  Trash2,
  AlertTriangle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import DashboardNavbar from "@/components/school-manager/dashboard-navbar"
import Sidebar from "@/components/school-manager/sidebar"
import OverviewTab from "@/components/school-manager/overview-tab"
import OrdersTab from "@/components/school-manager/orders-tab"
import StockTab from "@/components/school-manager/stock-tab"
import AnalyticsTab from "@/components/school-manager/analytics-tab"
import CustomersTab from "@/components/school-manager/customers-tab"
import SettingsTab from "@/components/school-manager/settings-tab-updated"
import ProductFormModal from "@/components/school-manager/product-form-modal"

import { generateOrderHistoryPDF, downloadPDF, type OrderData } from "@/lib/pdf-generator"

import {
  fetchSchoolProducts,
  fetchSchoolOrders,
  fetchOrderStats,
  fetchCustomers,
  fetchSalesAnalytics,
  createSchoolProduct,
  updateSchoolProduct,
  deleteSchoolProduct,
  updateOrderStatus,
  type SchoolManagerProduct,
  type SchoolManagerOrder,
  type CustomerData,
  type SalesAnalytics,
  type Product,
} from "@/lib/api"

import CustomerDetailsModal from "@/components/school-manager/customer-details-modal"

import {
  schoolManagerSidebarItems,
} from "@/mock-data"

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
import { useAuth } from "@/lib/auth-context"

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement)

export default function SchoolManagerDashboard() {
  const router = useRouter()
  const { token, user, isLoading: authLoading } = useAuth()
  const [activeTab, setActiveTab] = useState("overview")
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [isAddingProduct, setIsAddingProduct] = useState(false)
  const [editingProduct, setEditingProduct] = useState<SchoolManagerProduct | null>(null)
  const [customerSearchQuery, setCustomerSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [customerDetailsModalOpen, setCustomerDetailsModalOpen] = useState(false)
  const [selectedCustomerEmail, setSelectedCustomerEmail] = useState<string | null>(null)

  // Redirect if user role is not school_manager
  useEffect(() => {
    if (user && user.role !== "school_manager") {
      router.push("/")
    }
  }, [user, router])

  // Load data from API on component mount - wait for auth to finish loading
  useEffect(() => {
    const loadData = async () => {
      // Don't load data until auth context has finished loading
      if (authLoading || !token) {
        return
      }

      try {
        setLoading(true)
        setError(null)

        // Load all data in parallel
        const [ordersData, productsData, analyticsData, customersData] = await Promise.all([
          fetchSchoolOrders(token),
          fetchSchoolProducts(token),
          fetchSalesAnalytics(token),
          fetchCustomers(token),
        ])

        setOrders(ordersData)
        setProducts(productsData)
        setSalesData(analyticsData)
        setCustomers(customersData)
      } catch (err) {
        console.error("Failed to load data:", err)
        setError("Failed to load data. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [token, authLoading])

  const handleLogout = () => {
    router.push("/")
  }

  const sidebarItems = schoolManagerSidebarItems.map(item => ({
    ...item,
    icon: item.icon === "BarChart3" ? BarChart3 :
          item.icon === "ShoppingCart" ? ShoppingCart :
          item.icon === "Package" ? Package :
          item.icon === "Users" ? Users :
          item.icon === "TrendingUp" ? TrendingUp :
          Settings
  }))

  // Orders data from backend API
  const [orders, setOrders] = useState<SchoolManagerOrder[]>([])

  // Products data from backend API
  const [products, setProducts] = useState<SchoolManagerProduct[]>([])

  // Sales analytics data from backend API
  const [salesData, setSalesData] = useState<SalesAnalytics | null>(null)

  // Helper function to convert SchoolManagerProduct to Product
  const convertSchoolManagerProductToProduct = (schoolProduct: SchoolManagerProduct): Product => {
    return {
      id: parseInt(schoolProduct.id),
      name: schoolProduct.name,
      price: schoolProduct.price.toString(),
      image: schoolProduct.imageUrl || '/placeholder.jpg',
      required: schoolProduct.required,
      description: schoolProduct.description,
      rating: 4.5, // Default rating since SchoolManagerProduct doesn't have this
      reviews: 0, // Default reviews since SchoolManagerProduct doesn't have this
      inStock: schoolProduct.stock > 0,
      category: schoolProduct.category,
    }
  }

  // Customers data from backend API
  const [customers, setCustomers] = useState<CustomerData[]>([])

  // Analytics-specific states
  const [loadingAnalytics, setLoadingAnalytics] = useState(false)
  const [analyticsError, setAnalyticsError] = useState<string | null>(null)

  // Refresh analytics data function
  const handleRefreshAnalytics = async () => {
    if (!token) return

    try {
      setLoadingAnalytics(true)
      setAnalyticsError(null)

      const analyticsData = await fetchSalesAnalytics(token, true) // Force refresh to bypass cache
      setSalesData(analyticsData)
    } catch (err) {
      console.error("Failed to refresh analytics data:", err)
      setAnalyticsError("Failed to refresh analytics data. Please try again.")
    } finally {
      setLoadingAnalytics(false)
    }
  }

  // Chart options
  const chartOptions = {
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
            // Format large numbers to be more readable
            if (typeof value === 'number') {
              if (value >= 1000000) {
                return 'RWF ' + (value / 1000000).toFixed(1) + 'M';
              } else if (value >= 1000) {
                return 'RWF ' + (value / 1000).toFixed(1) + 'K';
              } else {
                return 'RWF ' + value.toLocaleString();
              }
            }
            return value;
          }
        }
      },
      x: {
        ticks: {
          maxRotation: 45,
          minRotation: 0
        }
      }
    }
  }

  // Filtered orders based on search and status filter
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.parentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.id.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = filterStatus === "all" || order.status === filterStatus
    return matchesSearch && matchesStatus
  })

  // Low stock products
  const lowStockProducts = products.filter((product) => product.stock <= product.minStock)

  // Generate chart data from API data
  const orderStatusData = salesData ? {
    labels: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
    datasets: [
      {
        data: [
          salesData.orderStatusDistribution.find(s => s.status === "pending")?.count || 0,
          salesData.orderStatusDistribution.find(s => s.status === "processing")?.count || 0,
          salesData.orderStatusDistribution.find(s => s.status === "shipped")?.count || 0,
          salesData.orderStatusDistribution.find(s => s.status === "delivered")?.count || 0,
          salesData.orderStatusDistribution.find(s => s.status === "cancelled")?.count || 0,
        ],
        backgroundColor: ["#F59E0B", "#3B82F6", "#8B5CF6", "#10B981", "#EF4444"],
      },
    ],
  } : null

  // Calculate revenue from delivered orders grouped by month
  const calculateRevenueByMonth = () => {
    const deliveredOrders = orders.filter(order => order.status === "delivered")

    // Group orders by month-year
    const revenueByMonth: { [key: string]: number } = {}

    deliveredOrders.forEach(order => {
      const date = new Date(order.orderDate)
      const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      const monthName = date.toLocaleString('default', { month: 'short', year: 'numeric' })

      if (!revenueByMonth[monthName]) {
        revenueByMonth[monthName] = 0
      }
      revenueByMonth[monthName] += Number(order.totalAmount)
    })

    // Sort by date
    const sortedMonths = Object.keys(revenueByMonth).sort((a, b) => {
      const dateA = new Date(a)
      const dateB = new Date(b)
      return dateA.getTime() - dateB.getTime()
    })

    return {
      labels: sortedMonths,
      data: sortedMonths.map(month => revenueByMonth[month])
    }
  }

  const revenueData = calculateRevenueByMonth()

  const salesDataByTerm = {
    labels: revenueData.labels,
    datasets: [
      {
        label: "Revenue (RWF)",
        data: revenueData.data,
        backgroundColor: "rgba(59, 130, 246, 0.8)",
        borderColor: "rgba(59, 130, 246, 1)",
        borderWidth: 1,
      },
    ],
  }

  const productsSoldByTermData = salesData ? {
    labels: salesData.categoryPerformance.map(cat => cat.category),
    datasets: [
      {
        label: "Units Sold",
        data: salesData.categoryPerformance.map(cat => cat.unitsSold),
        borderColor: "rgba(59, 130, 246, 1)",
        backgroundColor: "rgba(59, 130, 246, 0.8)",
        tension: 0.4,
      },
    ],
  } : null

  // Delete product handler
  const handleDeleteProduct = async (productId: string) => {
    if (!token) return

    try {
      await deleteSchoolProduct(token, productId)
      setProducts(products.filter((p) => p.id !== productId))
    } catch (error) {
      console.error("Failed to delete product:", error)
      alert("Failed to delete product. Please try again.")
    }
  }

  // Edit product handler
  const handleEditProduct = (product: SchoolManagerProduct) => {
    setEditingProduct(product)
    setIsAddingProduct(true)
  }

  // Save product handler (create or update)
  const handleSaveProduct = async (productData: Partial<SchoolManagerProduct> & { imageFile?: File }) => {
    if (!token) return

    try {
      // Extract imageFile from productData before sending to API
      const { imageFile, ...productDataWithoutImage } = productData

      if (editingProduct) {
        // Update existing product
        const updatedProduct = await updateSchoolProduct(token, editingProduct.id, productDataWithoutImage)
        setProducts(
          products.map((p) =>
            p.id === editingProduct.id
              ? updatedProduct
              : p,
          ),
        )
      } else {
        // Add new product
        const newProduct = await createSchoolProduct(token, productDataWithoutImage)
        setProducts([...products, newProduct])
      }
      setIsAddingProduct(false)
      setEditingProduct(null)
    } catch (error) {
      console.error("Failed to save product:", error)
      alert("Failed to save product. Please try again.")
    }
  }

  const handleDownloadOrdersReport = async () => {
    // Use real school data from API or fallback to defaults
    const schoolInfo = {
      name: "Kigali Primary School", // TODO: Get from API when available
      address: "KG 123 St, Kigali, Rwanda", // TODO: Get from API when available
      phone: user?.phone || "+250 788 000 000",
      email: user?.email || "admin@kigaliprimary.edu.rw",
    }

    const ordersForPDF: OrderData[] = filteredOrders.map((order) => ({
      id: order.id,
      item: order.items.map((item) => `${item.quantity}x ${item.name}`).join(", "),
      date: order.orderDate,
      amount: order.totalAmount.toString(),
      status: order.status,
      category: order.items[0]?.category || "Mixed",
      student: `${order.studentName} (${order.studentGrade})`,
      parentName: order.parentName,
      parentEmail: order.parentEmail,
      parentPhone: order.parentPhone,
    }))

    // Use real user data for manager info
    const managerInfo = {
      parentName: user ? `${user.firstName} ${user.lastName}` : "School Manager",
      email: user?.email || "manager@kigaliprimary.edu.rw",
      phone: user?.phone || "+250 788 000 000",
      studentName: filteredOrders.length > 0 ? filteredOrders.map(o => o.studentName).join(", ") : "No Students",
      studentGrade: filteredOrders.length > 0 ? filteredOrders.map(o => o.studentGrade).join(", ") : "N/A",
      studentClass: filteredOrders.length > 0 ? filteredOrders.map(o => o.studentClass).join(", ") : "N/A",
    }

    try {
      const doc = await generateOrderHistoryPDF(ordersForPDF, managerInfo, schoolInfo)
      downloadPDF(doc, `orders-report-${new Date().toISOString().split("T")[0]}.pdf`)
    } catch (error) {
      console.error("Error generating PDF:", error)
      alert("Error generating PDF. Please try again.")
    }
  }

  const handleDownloadCustomersReport = async () => {
    // Use real school data from API or fallback to defaults
    const schoolInfo = {
      name: "Kigali Primary School", // TODO: Get from API when available
      address: "KG 123 St, Kigali, Rwanda", // TODO: Get from API when available
      phone: user?.phone || "+250 788 000 000",
      email: user?.email || "admin@kigaliprimary.edu.rw",
    }

    // Get filtered customers based on search query (same logic as in CustomersTab)
    const customerData = Array.from(new Set(orders.map((o) => o.parentEmail)))
      .map((parentEmail) => {
        const parentOrders = orders.filter((o) => o.parentEmail === parentEmail)
        const parent = parentOrders[0]
        return {
          parentEmail,
          parentName: parent.parentName,
          parentPhone: parent.parentPhone,
        }
      })

    const filteredCustomers = customerData.filter((customer) =>
      customer.parentName.toLowerCase().includes(customerSearchQuery.toLowerCase()) ||
      customer.parentEmail.toLowerCase().includes(customerSearchQuery.toLowerCase())
    )

    // Get orders only for filtered customers
    const filteredCustomerEmails = new Set(filteredCustomers.map(c => c.parentEmail))
    const filteredOrders = orders.filter(order => filteredCustomerEmails.has(order.parentEmail))

    // Create detailed order data for filtered customers only
    const customerOrderData: OrderData[] = filteredOrders.map((order) => ({
      id: order.id,
      item: order.items.map((item) => `${item.quantity}x ${item.name}`).join(", "),
      date: order.orderDate,
      amount: order.totalAmount.toString(),
      status: order.status,
      category: order.items[0]?.category || "Mixed",
      student: `${order.studentName} (${order.studentGrade})`,
      parentName: order.parentName,
      parentEmail: order.parentEmail,
      parentPhone: order.parentPhone,
    }))

    // Use real user data for manager info
    const managerInfo = {
      parentName: user ? `${user.firstName} ${user.lastName}` : "School Manager",
      email: user?.email || "manager@kigaliprimary.edu.rw",
      phone: user?.phone || "+250 788 000 000",
      studentName: filteredOrders.length > 0 ? filteredOrders.map(o => o.studentName).join(", ") : "No Students",
      studentGrade: filteredOrders.length > 0 ? filteredOrders.map(o => o.studentGrade).join(", ") : "N/A",
      studentClass: filteredOrders.length > 0 ? filteredOrders.map(o => o.studentClass).join(", ") : "N/A",
    }

    try {
      const doc = await generateOrderHistoryPDF(customerOrderData, managerInfo, schoolInfo)
      downloadPDF(doc, `customers-report-${new Date().toISOString().split("T")[0]}.pdf`)
    } catch (error) {
      console.error("Error generating PDF:", error)
      alert("Error generating PDF. Please try again.")
    }
  }

  const handleViewCustomerDetails = (parentEmail: string) => {
    setSelectedCustomerEmail(parentEmail)
    setCustomerDetailsModalOpen(true)
  }

  const handleDownloadCustomerReport = async (parentEmail: string) => {
    // Use real school data from API or fallback to defaults
    const schoolInfo = {
      name: "Kigali Primary School", // TODO: Get from API when available
      address: "KG 123 St, Kigali, Rwanda", // TODO: Get from API when available
      phone: user?.phone || "+250 788 000 000",
      email: user?.email || "admin@kigaliprimary.edu.rw",
    }

    const parentOrders = orders.filter((o) => o.parentEmail === parentEmail)
    const parent = parentOrders[0]

    const customerData: OrderData[] = parentOrders.map((order) => ({
      id: order.id,
      item: order.items.map((item) => `${item.quantity}x ${item.name}`).join(", "),
      date: order.orderDate,
      amount: order.totalAmount.toString(),
      status: order.status,
      category: order.items[0]?.category || "Mixed",
      student: `${order.studentName} (${order.studentGrade})`,
      parentName: parent.parentName,
      parentEmail: parent.parentEmail,
      parentPhone: parent.parentPhone,
    }))

    // Use real user data for manager info
    const managerInfo = {
      parentName: user ? `${user.firstName} ${user.lastName}` : "School Manager",
      email: user?.email || "manager@kigaliprimary.edu.rw",
      phone: user?.phone || "+250 788 000 000",
      studentName: parentOrders.map(o => o.studentName).join(", "),
      studentGrade: parentOrders.map(o => o.studentGrade).join(", "),
      studentClass: parentOrders.map(o => o.studentClass).join(", "),
    }

    try {
      const doc = await generateOrderHistoryPDF(customerData, managerInfo, schoolInfo)
      downloadPDF(doc, `customer-${parent.parentName.replace(/\s+/g, '-').toLowerCase()}-report-${new Date().toISOString().split("T")[0]}.pdf`)
    } catch (error) {
      console.error("Error generating PDF:", error)
      alert("Error generating PDF. Please try again.")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNavbar
        notificationsCount={lowStockProducts.length}
        onLogout={handleLogout}
      />

      <div className="flex">
        <Sidebar
          sidebarItems={sidebarItems}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          lowStockProducts={lowStockProducts}
        />

        <main className="flex-1 ml-0 md:ml-80 mt-16 p-4 md:p-8">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading dashboard data...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="text-red-500 mb-4">
                  <AlertTriangle className="h-12 w-12 mx-auto" />
                </div>
                <p className="text-red-600 mb-4">{error}</p>
                <Button onClick={() => window.location.reload()} className="rounded-full">
                  Try Again
                </Button>
              </div>
            </div>
          ) : (
            <>
              {activeTab === "overview" && (
                <OverviewTab
                  orders={orders}
                  lowStockProducts={lowStockProducts}
                  salesData={salesData}
                  orderStatusData={orderStatusData}
                  chartOptions={chartOptions}
                  loadingAnalytics={loadingAnalytics}
                  analyticsError={analyticsError}
                  onRefreshAnalytics={handleRefreshAnalytics}
                />
              )}

              {activeTab === "orders" && (
                <OrdersTab
                  orders={orders}
                  searchQuery={searchQuery}
                  filterStatus={filterStatus}
                  onSearchChange={setSearchQuery}
                  onFilterChange={setFilterStatus}
                  onDownloadReport={handleDownloadOrdersReport}
                  isAdmin={user?.role === "admin" || user?.role === "school_manager"}
                  token={token || undefined}
                />
              )}

              {activeTab === "stock" && (
                <StockTab
                  products={products}
                  onAddProduct={() => setIsAddingProduct(true)}
                  onEditProduct={handleEditProduct}
                  onDeleteProduct={handleDeleteProduct}
                />
              )}

              {activeTab === "analytics" && (
                <AnalyticsTab
                  orders={orders}
                  salesData={salesData}
                  salesDataByTerm={salesDataByTerm}
                  productsSoldByTermData={productsSoldByTermData}
                  chartOptions={chartOptions}
                />
              )}

              {activeTab === "customers" && (
                <CustomersTab
                  orders={orders}
                  searchQuery={customerSearchQuery}
                  onSearchChange={setCustomerSearchQuery}
                  onDownloadReport={handleDownloadCustomersReport}
                  onViewCustomerDetails={handleViewCustomerDetails}
                  onDownloadCustomerReport={handleDownloadCustomerReport}
                />
              )}

              {selectedCustomerEmail && (
                <CustomerDetailsModal
                  orders={orders}
                  parentEmail={selectedCustomerEmail}
                  isOpen={customerDetailsModalOpen}
                  onClose={() => setCustomerDetailsModalOpen(false)}
                />
              )}
            </>
          )}

            {activeTab === "settings" && (
              <SettingsTab />
            )}
        </main>
      </div>

      {/* Product Form Modal */}
      <ProductFormModal
        isOpen={isAddingProduct}
        onClose={() => {
          setIsAddingProduct(false)
          setEditingProduct(null)
        }}
        onSave={handleSaveProduct}
        editingProduct={editingProduct}
      />
    </div>
  )
}
