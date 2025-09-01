"use client"

import { useState } from "react"
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
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import DashboardNavbar from "@/components/school-manager/dashboard-navbar"
import Sidebar from "@/components/school-manager/sidebar"
import OverviewTab from "@/components/school-manager/overview-tab"
import OrdersTab from "@/components/school-manager/orders-tab"
import StockTab from "@/components/school-manager/stock-tab"
import AnalyticsTab from "@/components/school-manager/analytics-tab"
import CustomersTab from "@/components/school-manager/customers-tab"
import SettingsTab from "@/components/school-manager/settings-tab"
import ProductFormModal from "@/components/school-manager/product-form-modal"

import { generateOrderHistoryPDF, downloadPDF, type OrderData } from "@/lib/pdf-generator"

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

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement)

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
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  orderDate: string
  paymentMethod: string
  deliveryAddress: string
}

interface Product {
  id: string
  name: string
  category: string
  price: number
  stock: number
  minStock: number
  required: boolean
  description: string
  supplier: string
  lastUpdated: string
}

export default function SchoolManagerDashboard() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("overview")
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [isAddingProduct, setIsAddingProduct] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [customerSearchQuery, setCustomerSearchQuery] = useState("")

  const handleLogout = () => {
    router.push("/")
  }

  const sidebarItems = [
    { id: "overview", label: "Dashboard Overview", icon: BarChart3 },
    { id: "orders", label: "Orders Management", icon: ShoppingCart },
    { id: "stock", label: "Stock Management", icon: Package },
    { id: "customers", label: "Customer Management", icon: Users },
    { id: "analytics", label: "Analytics & Reports", icon: TrendingUp },
    { id: "settings", label: "Settings", icon: Settings },
  ]

  // Mock orders data
  const orders: Order[] = [
    {
      id: "ORD-001",
      parentName: "John Doe",
      parentEmail: "john.doe@email.com",
      parentPhone: "+250 788 123 456",
      studentName: "Jane Doe",
      studentGrade: "Grade 5",
      studentClass: "5A",
      items: [
        { name: "Premium School Backpack", quantity: 1, price: 15000, category: "School Bags" },
        { name: "Scientific Calculator", quantity: 1, price: 8500, category: "Calculators" },
      ],
      totalAmount: 23500,
      status: "pending",
      orderDate: "2024-01-20",
      paymentMethod: "MTN MoMo",
      deliveryAddress: "Kigali, Rwanda",
    },
    {
      id: "ORD-002",
      parentName: "Mary Smith",
      parentEmail: "mary.smith@email.com",
      parentPhone: "+250 788 987 654",
      studentName: "Tom Smith",
      studentGrade: "Grade 4",
      studentClass: "4B",
      items: [
        { name: "Notebook Set (5 Pack)", quantity: 2, price: 3200, category: "Notebooks" },
        { name: "Art Supply Kit", quantity: 1, price: 12000, category: "Art Supplies" },
      ],
      totalAmount: 18400,
      status: "processing",
      orderDate: "2024-01-19",
      paymentMethod: "Airtel Money",
      deliveryAddress: "Kigali, Rwanda",
    },
    {
      id: "ORD-003",
      parentName: "David Wilson",
      parentEmail: "david.wilson@email.com",
      parentPhone: "+250 788 456 789",
      studentName: "Sarah Wilson",
      studentGrade: "Grade 6",
      studentClass: "6A",
      items: [
        { name: "School Uniform", quantity: 2, price: 18000, category: "Uniforms" },
        { name: "Geometry Set", quantity: 1, price: 4800, category: "Writing Materials" },
      ],
      totalAmount: 40800,
      status: "shipped",
      orderDate: "2024-01-18",
      paymentMethod: "Visa Card",
      deliveryAddress: "Kigali, Rwanda",
    },
    {
      id: "ORD-004",
      parentName: "Alice Johnson",
      parentEmail: "alice.johnson@email.com",
      parentPhone: "+250 788 321 654",
      studentName: "Mike Johnson",
      studentGrade: "Grade 3",
      studentClass: "3C",
      items: [
        { name: "Water Bottle", quantity: 1, price: 3800, category: "Accessories" },
        { name: "Lunch Box", quantity: 1, price: 5200, category: "Accessories" },
        { name: "Colored Pencils", quantity: 1, price: 2500, category: "Art Supplies" },
      ],
      totalAmount: 11500,
      status: "delivered",
      orderDate: "2024-01-17",
      paymentMethod: "MTN MoMo",
      deliveryAddress: "Kigali, Rwanda",
    },
  ]

  // Mock products data
  const [products, setProducts] = useState<Product[]>([
    {
      id: "PRD-001",
      name: "Premium School Backpack",
      category: "School Bags",
      price: 15000,
      stock: 25,
      minStock: 10,
      required: true,
      description: "Spacious and durable backpack with multiple compartments",
      supplier: "BagCorp Ltd",
      lastUpdated: "2024-01-20",
    },
    {
      id: "PRD-002",
      name: "Scientific Calculator",
      category: "Calculators",
      price: 8500,
      stock: 15,
      minStock: 5,
      required: false,
      description: "Advanced scientific calculator with 240+ functions",
      supplier: "TechSupply Co",
      lastUpdated: "2024-01-19",
    },
    {
      id: "PRD-003",
      name: "Notebook Set (5 Pack)",
      category: "Notebooks",
      price: 3200,
      stock: 50,
      minStock: 20,
      required: true,
      description: "Set of 5 high-quality notebooks with lined pages",
      supplier: "Paper Plus",
      lastUpdated: "2024-01-18",
    },
    {
      id: "PRD-004",
      name: "Art Supply Kit",
      category: "Art Supplies",
      price: 12000,
      stock: 8,
      minStock: 15,
      required: false,
      description: "Complete art set including colored pencils, markers, and paints",
      supplier: "Creative Arts Ltd",
      lastUpdated: "2024-01-17",
    },
    {
      id: "PRD-005",
      name: "School Uniform",
      category: "Uniforms",
      price: 18000,
      stock: 30,
      minStock: 10,
      required: true,
      description: "High-quality school uniform shirt",
      supplier: "Uniform Masters",
      lastUpdated: "2024-01-16",
    },
  ])

  // Chart data
  const salesData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Sales (RWF)",
        data: [450000, 520000, 480000, 600000, 580000, 650000],
        backgroundColor: "rgba(59, 130, 246, 0.8)",
        borderColor: "rgba(59, 130, 246, 1)",
        borderWidth: 1,
      },
    ],
  }

  const orderStatusData = {
    labels: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
    datasets: [
      {
        data: [12, 8, 15, 45, 3],
        backgroundColor: ["#F59E0B", "#3B82F6", "#8B5CF6", "#10B981", "#EF4444"],
      },
    ],
  }

  const productsSoldByTermData = {
    labels: ["Term 1", "Term 2", "Term 3"],
    datasets: [
      {
        label: "School Bags",
        data: [120, 95, 110],
        borderColor: "rgba(59, 130, 246, 1)",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        tension: 0.4,
      },
      {
        label: "Notebooks",
        data: [85, 110, 95],
        borderColor: "rgba(16, 185, 129, 1)",
        backgroundColor: "rgba(16, 185, 129, 0.1)",
        tension: 0.4,
      },
      {
        label: "Uniforms",
        data: [65, 80, 75],
        borderColor: "rgba(245, 158, 11, 1)",
        backgroundColor: "rgba(245, 158, 11, 0.1)",
        tension: 0.4,
      },
      {
        label: "Calculators",
        data: [40, 55, 45],
        borderColor: "rgba(139, 92, 246, 1)",
        backgroundColor: "rgba(139, 92, 246, 0.1)",
        tension: 0.4,
      },
      {
        label: "Art Supplies",
        data: [35, 50, 40],
        borderColor: "rgba(239, 68, 68, 1)",
        backgroundColor: "rgba(239, 68, 68, 0.1)",
        tension: 0.4,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
    },
  }

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.parentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.id.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = filterStatus === "all" || order.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const lowStockProducts = products.filter((product) => product.stock <= product.minStock)

  const handleDeleteProduct = (productId: string) => {
    setProducts(products.filter((p) => p.id !== productId))
  }

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product)
    setIsAddingProduct(true)
  }

  const handleSaveProduct = (productData: Partial<Product>) => {
    if (editingProduct) {
      // Update existing product
      setProducts(
        products.map((p) =>
          p.id === editingProduct.id
            ? { ...p, ...productData, lastUpdated: new Date().toISOString().split("T")[0] }
            : p,
        ),
      )
    } else {
      // Add new product
      const newProduct: Product = {
        id: `PRD-${String(products.length + 1).padStart(3, "0")}`,
        name: productData.name || "",
        category: productData.category || "",
        price: productData.price || 0,
        stock: productData.stock || 0,
        minStock: productData.minStock || 0,
        required: productData.required || false,
        description: productData.description || "",
        supplier: productData.supplier || "",
        lastUpdated: new Date().toISOString().split("T")[0],
      }
      setProducts([...products, newProduct])
    }
    setIsAddingProduct(false)
    setEditingProduct(null)
  }

  const handleDownloadOrdersReport = async () => {
    const schoolInfo = {
      name: "Kigali Primary School",
      address: "KG 123 St, Kigali, Rwanda",
      phone: "+250 788 000 000",
      email: "admin@kigaliprimary.edu.rw",
    }

    const ordersForPDF: OrderData[] = filteredOrders.map((order) => ({
      id: order.id,
      item: order.items.map((item) => `${item.quantity}x ${item.name}`).join(", "),
      date: order.orderDate,
      amount: order.totalAmount.toString(),
      status: order.status,
      category: order.items[0]?.category || "Mixed",
      student: order.studentName,
      parentName: order.parentName,
      parentEmail: order.parentEmail,
      parentPhone: order.parentPhone,
    }))

    const managerInfo = {
      parentName: "School Manager",
      email: "manager@kigaliprimary.edu.rw",
      phone: "+250 788 000 000",
      studentName: "All Students",
      studentGrade: "All Grades",
      studentClass: "All Classes",
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
    const schoolInfo = {
      name: "Kigali Primary School",
      address: "KG 123 St, Kigali, Rwanda",
      phone: "+250 788 000 000",
      email: "admin@kigaliprimary.edu.rw",
    }

    // Create customer summary data
    const customerData: OrderData[] = Array.from(new Set(orders.map((o) => o.parentEmail))).map((parentEmail) => {
      const parentOrders = orders.filter((o) => o.parentEmail === parentEmail)
      const parent = parentOrders[0]
      const totalSpent = parentOrders.reduce((sum, order) => sum + order.totalAmount, 0)
      const students = Array.from(new Set(parentOrders.map((o) => o.studentName))).join(", ")

      return {
        id: `CUST-${parentEmail.split("@")[0]}`,
        item: `${parentOrders.length} orders`,
        date: parentOrders.sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime())[0]
          .orderDate,
        amount: totalSpent.toString(),
        status: parentOrders.some((o) => o.status === "pending" || o.status === "processing") ? "active" : "inactive",
        category: "Customer Summary",
        student: students,
        parentName: parent.parentName,
        parentEmail: parent.parentEmail,
        parentPhone: parent.parentPhone,
      }
    })

    const managerInfo = {
      parentName: "School Manager",
      email: "manager@kigaliprimary.edu.rw",
      phone: "+250 788 000 000",
      studentName: "Customer Report",
      studentGrade: "All Grades",
      studentClass: "All Classes",
    }

    try {
      const doc = await generateOrderHistoryPDF(customerData, managerInfo, schoolInfo)
      downloadPDF(doc, `customers-report-${new Date().toISOString().split("T")[0]}.pdf`)
    } catch (error) {
      console.error("Error generating PDF:", error)
      alert("Error generating PDF. Please try again.")
    }
  }

  const handleViewCustomerDetails = (parentEmail: string) => {
    const parentOrders = orders.filter((o) => o.parentEmail === parentEmail)
    const parent = parentOrders[0]
    const totalSpent = parentOrders.reduce((sum, order) => sum + order.totalAmount, 0)
    const students = Array.from(new Set(parentOrders.map((o) => `${o.studentName} (${o.studentGrade})`)))

    alert(`Customer Details:\n\nName: ${parent.parentName}\nEmail: ${parent.parentEmail}\nPhone: ${parent.parentPhone}\n\nStudents: ${students.join(", ")}\nTotal Orders: ${parentOrders.length}\nTotal Spent: RWF ${totalSpent.toLocaleString()}\n\nLast Order: ${parentOrders.sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime())[0].orderDate}`)
  }

  const handleDownloadCustomerReport = async (parentEmail: string) => {
    const schoolInfo = {
      name: "Kigali Primary School",
      address: "KG 123 St, Kigali, Rwanda",
      phone: "+250 788 000 000",
      email: "admin@kigaliprimary.edu.rw",
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
      student: order.studentName,
      parentName: parent.parentName,
      parentEmail: parent.parentEmail,
      parentPhone: parent.parentPhone,
    }))

    const managerInfo = {
      parentName: "School Manager",
      email: "manager@kigaliprimary.edu.rw",
      phone: "+250 788 000 000",
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

        <main className="flex-1 ml-80 mt-16 p-8">
            {activeTab === "overview" && (
              <OverviewTab
                orders={orders}
                lowStockProducts={lowStockProducts}
                salesData={salesData}
                orderStatusData={orderStatusData}
                chartOptions={chartOptions}
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

            {activeTab === "settings" && (
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
                          <Input defaultValue="Kigali Primary School" className="rounded-full" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Contact Email</label>
                          <Input type="email" defaultValue="admin@kigaliprimary.edu.rw" className="rounded-full" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                          <Input defaultValue="+250 788 000 000" className="rounded-full" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">School Address</label>
                          <textarea
                            defaultValue="KG 123 St, Kigali, Rwanda"
                            rows={3}
                            className="w-full rounded-lg border border-gray-300 px-4 py-2"
                          />
                        </div>
                        <Button className="rounded-full bg-blue-700 hover:bg-blue-800">Update School Info</Button>
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
                          <Input defaultValue="School Administrator" className="rounded-full" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                          <Input type="password" placeholder="Enter current password" className="rounded-full" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                          <Input type="password" placeholder="Enter new password" className="rounded-full" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                          <Input type="password" placeholder="Confirm new password" className="rounded-full" />
                        </div>
                        <Button className="rounded-full bg-blue-700 hover:bg-blue-800">Update Account</Button>
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
                        <select
                          className="w-full rounded-full border border-gray-300 px-4 py-2"
                          defaultValue="2"
                        >
                          <option value="1">1 Business Day</option>
                          <option value="2">
                            2 Business Days
                          </option>
                          <option value="3">3 Business Days</option>
                          <option value="5">1 Week</option>
                        </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                        <select
                          className="w-full rounded-full border border-gray-300 px-4 py-2"
                          defaultValue="RWF"
                        >
                          <option value="RWF">
                            Rwandan Franc (RWF)
                          </option>
                          <option value="USD">US Dollar (USD)</option>
                        </select>
                        </div>
                        <Button className="rounded-full bg-blue-700 hover:bg-blue-800">Save Business Settings</Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Payment Methods */}
                  <Card className="bg-white shadow-sm">
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Methods</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                              <span className="text-sm font-bold text-yellow-700">M</span>
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">MTN Mobile Money</p>
                              <p className="text-sm text-gray-600">Active</p>
                            </div>
                          </div>
                          <Badge className="bg-green-100 text-green-800">Enabled</Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                              <span className="text-sm font-bold text-red-700">A</span>
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">Airtel Money</p>
                              <p className="text-sm text-gray-600">Active</p>
                            </div>
                          </div>
                          <Badge className="bg-green-100 text-green-800">Enabled</Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-sm font-bold text-blue-700">V</span>
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">Visa Card</p>
                              <p className="text-sm text-gray-600">Active</p>
                            </div>
                          </div>
                          <Badge className="bg-green-100 text-green-800">Enabled</Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                              <span className="text-sm font-bold text-purple-700">I</span>
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">Irembo Pay</p>
                              <p className="text-sm text-gray-600">Available</p>
                            </div>
                          </div>
                          <Badge className="bg-gray-100 text-gray-800">Disabled</Badge>
                        </div>
                        <Button variant="outline" className="w-full rounded-full bg-transparent">
                          Configure Payment Methods
                        </Button>
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
                        <Button className="rounded-full bg-blue-700 hover:bg-blue-800">
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
                        <select
                          className="w-full rounded-full border border-gray-300 px-4 py-2"
                          defaultValue="pending"
                        >
                          <option value="pending">
                            Pending
                          </option>
                          <option value="processing">Processing</option>
                        </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Auto-approve Orders</label>
                        <select
                          className="w-full rounded-full border border-gray-300 px-4 py-2"
                          defaultValue="manual"
                        >
                          <option value="manual">
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
                        <select
                          className="w-full rounded-full border border-gray-300 px-4 py-2"
                          defaultValue="365"
                        >
                          <option value="30">30 Days</option>
                          <option value="90">90 Days</option>
                          <option value="365">
                            1 Year
                          </option>
                          <option value="forever">Forever</option>
                        </select>
                        </div>
                        <Button className="rounded-full bg-blue-700 hover:bg-blue-800">Update System Settings</Button>
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
                          variant="outline"
                          className="rounded-full border-red-600 text-red-600 hover:bg-red-50 bg-transparent"
                        >
                          Export Data
                        </Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-red-900">Reset System</p>
                          <p className="text-sm text-red-700">Clear all orders and reset to default settings</p>
                        </div>
                        <Button
                          variant="outline"
                          className="rounded-full border-red-600 text-red-600 hover:bg-red-50 bg-transparent"
                        >
                          Reset System
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
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
