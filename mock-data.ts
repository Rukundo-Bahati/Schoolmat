// Centralized mock data for the SchoolMart application
// This file contains all mock data used throughout the app
// When integrating with a backend, replace these with API calls

export interface Product {
  id: number
  name: string
  price: string
  image: string
  required: boolean
  description?: string
  rating?: number
  reviews?: number
  inStock?: boolean
  category: string
}

export interface CartItem {
  id: number
  name: string
  price: string
  image: string
  quantity: number
  required: boolean
}

export interface Order {
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

export interface SchoolProduct {
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

export interface SidebarItem {
  id: string
  label: string
  icon: any
}

export interface Notification {
  id: number
  message: string
  date: string
  read: boolean
  type: string
  priority: string
}

export interface Purchase {
  id: number
  item: string
  date: string
  amount: string
  status: string
  category: string
  student: string
}

// Products for the main products page
export const allProducts: Product[] = [
  {
    id: 1,
    name: "Premium School Backpack",
    price: "15,000",
    image: "/premium-blue-school-backpack.png",
    required: true,
    rating: 5,
    reviews: 89,
    inStock: true,
    category: "School Bags",
    description:
      "Spacious and durable backpack with multiple compartments, padded straps, and water-resistant material.",
  },
  {
    id: 2,
    name: "Scientific Calculator",
    price: "8,500",
    image: "/scientific-calculator.png",
    required: false,
    rating: 4,
    reviews: 156,
    inStock: true,
    category: "Calculators",
    description: "Advanced scientific calculator with 240+ functions, perfect for mathematics and physics.",
  },
  {
    id: 3,
    name: "Art Supply Kit",
    price: "12,000",
    image: "/complete-art-supply-kit.png",
    required: false,
    rating: 5,
    reviews: 73,
    inStock: true,
    category: "Art Supplies",
    description: "Complete art set including colored pencils, markers, paints, and brushes.",
  },
  {
    id: 4,
    name: "Notebook Set (5 Pack)",
    price: "3,200",
    image: "/school-notebook-set.png",
    required: true,
    rating: 4,
    reviews: 234,
    inStock: true,
    category: "Notebooks & Paper",
    description: "Set of 5 high-quality notebooks with lined pages and durable covers.",
  },
  {
    id: 5,
    name: "Geometry Set",
    price: "4,800",
    image: "/geometry-compass-ruler-set.png",
    required: true,
    rating: 4,
    reviews: 98,
    inStock: true,
    category: "Writing Materials",
    description: "Complete geometry set with compass, protractor, rulers, and triangles.",
  },
  {
    id: 6,
    name: "Colored Pencils",
    price: "2,500",
    image: "/colored-pencils-set.png",
    required: false,
    rating: 4,
    reviews: 167,
    inStock: true,
    category: "Art Supplies",
    description: "Set of 24 vibrant colored pencils with smooth application.",
  },
  {
    id: 7,
    name: "School Uniform",
    price: "18,000",
    image: "/school-uniform-shirt.png",
    required: true,
    rating: 4,
    reviews: 45,
    inStock: true,
    category: "Uniforms",
    description: "High-quality school uniform shirt made from comfortable fabric.",
  },
  {
    id: 8,
    name: "Water Bottle",
    price: "3,800",
    image: "/school-water-bottle.png",
    required: false,
    rating: 5,
    reviews: 112,
    inStock: true,
    category: "Accessories",
    description: "BPA-free water bottle with leak-proof design.",
  },
  {
    id: 9,
    name: "Lunch Box",
    price: "5,200",
    image: "/colorful-school-lunch-box.png",
    required: false,
    rating: 4,
    reviews: 87,
    inStock: true,
    category: "Accessories",
    description: "Insulated lunch box with multiple compartments.",
  },
  {
    id: 10,
    name: "Exercise Books",
    price: "1,800",
    image: "/school-exercise-books.png",
    required: true,
    rating: 4,
    reviews: 298,
    inStock: true,
    category: "Notebooks & Paper",
    description: "Pack of exercise books with quality paper and durable covers.",
  },
  {
    id: 11,
    name: "Pencil Case",
    price: "2,800",
    image: "/school-pencil-case.png",
    required: false,
    rating: 4,
    reviews: 134,
    inStock: true,
    category: "Accessories",
    description: "Spacious pencil case with multiple compartments.",
  },
  {
    id: 12,
    name: "Ruler Set",
    price: "1,500",
    image: "/placeholder.svg?height=250&width=250",
    required: true,
    rating: 4,
    reviews: 189,
    inStock: true,
    category: "Writing Materials",
    description: "Set of rulers with clear markings in metric and imperial units.",
  },
  {
    id: 13,
    name: "Highlighter Set",
    price: "2,200",
    image: "/placeholder.svg?height=250&width=250",
    required: false,
    rating: 4,
    reviews: 76,
    inStock: true,
    category: "Writing Materials",
    description: "Set of 6 fluorescent highlighters in different colors.",
  },
  {
    id: 14,
    name: "Sports Equipment Kit",
    price: "25,000",
    image: "/school-sports-equipment.png",
    required: false,
    rating: 5,
    reviews: 42,
    inStock: true,
    category: "Sports Equipment",
    description: "Complete sports kit including ball, cones, and accessories.",
  },
  {
    id: 15,
    name: "Lab Coat",
    price: "8,000",
    image: "/placeholder.svg?height=250&width=250",
    required: true,
    rating: 4,
    reviews: 23,
    inStock: true,
    category: "Uniforms",
    description: "White lab coat for science experiments and practical sessions.",
  },
]

// Product categories
export const categories = [
  "All",
  "Notebooks & Paper",
  "Writing Materials",
  "Art Supplies",
  "School Bags",
  "Calculators",
  "Sports Equipment",
  "Uniforms",
  "Accessories",
]

// Cart items for cart page
export const cartItems: CartItem[] = [
  {
    id: 1,
    name: "Premium School Backpack",
    price: "15,000",
    image: "/premium-blue-school-backpack.png",
    quantity: 1,
    required: true,
  },
  {
    id: 2,
    name: "Scientific Calculator",
    price: "8,500",
    image: "/scientific-calculator.png",
    quantity: 2,
    required: false,
  },
  {
    id: 4,
    name: "Notebook Set (5 Pack)",
    price: "3,200",
    image: "/school-notebook-set.png",
    quantity: 1,
    required: true,
  },
]

// Checkout cart items
export const checkoutCartItems: CartItem[] = [
  {
    id: 1,
    name: "Premium School Backpack",
    price: "15,000",
    image: "/premium-blue-school-backpack.png",
    quantity: 1,
    required: true,
  },
  {
    id: 2,
    name: "Scientific Calculator",
    price: "8,500",
    image: "/scientific-calculator.png",
    quantity: 2,
    required: false,
  },
  {
    id: 4,
    name: "Notebook Set (5 Pack)",
    price: "3,200",
    image: "/school-notebook-set.png",
    quantity: 1,
    required: true,
  },
]

// Payment methods
export const paymentMethods = [
  { value: "mtn", label: "MTN Mobile Money", icon: null },
  { value: "airtel", label: "Airtel Money", icon: null },
  { value: "irembo", label: "Irembo Pay", icon: null },
  { value: "ussd", label: "USSD Payment", icon: null },
  { value: "visa", label: "Visa Card", icon: null },
]

// Parent dashboard sidebar items
export const sidebarItems: SidebarItem[] = [
  { id: "overview", label: "Overview", icon: "BarChart3" },
  { id: "purchases", label: "Purchase History", icon: "ShoppingBag" },
  { id: "pending", label: "Pending Orders", icon: "Clock" },
  { id: "notifications", label: "Notifications", icon: "Bell" },
  { id: "profile", label: "Profile", icon: "User" },
  { id: "settings", label: "Settings", icon: "Settings" },
]

// Parent dashboard purchases
export const allPurchases: Purchase[] = [
  {
    id: 1,
    item: "Premium School Backpack",
    date: "2024-01-15",
    amount: "15,000",
    status: "delivered",
    category: "School Bags",
    student: "Jane Doe",
  },
  {
    id: 2,
    item: "Scientific Calculator",
    date: "2024-01-10",
    amount: "8,500",
    status: "delivered",
    category: "Calculators",
    student: "Jane Doe",
  },
  {
    id: 3,
    item: "Notebook Set (5 Pack)",
    date: "2024-01-08",
    amount: "3,200",
    status: "delivered",
    category: "Notebooks",
    student: "Jane Doe",
  },
  {
    id: 4,
    item: "Art Supply Kit",
    date: "2024-01-05",
    amount: "12,000",
    status: "delivered",
    category: "Art Supplies",
    student: "Jane Doe",
  },
  {
    id: 5,
    item: "Geometry Set",
    date: "2024-01-03",
    amount: "4,800",
    status: "delivered",
    category: "Writing Materials",
    student: "Jane Doe",
  },
  {
    id: 6,
    item: "School Uniform",
    date: "2023-12-20",
    amount: "18,000",
    status: "delivered",
    category: "Uniforms",
    student: "Jane Doe",
  },
  {
    id: 7,
    item: "Water Bottle",
    date: "2023-12-15",
    amount: "3,800",
    status: "delivered",
    category: "Accessories",
    student: "Jane Doe",
  },
  {
    id: 8,
    item: "Lunch Box",
    date: "2023-12-10",
    amount: "5,200",
    status: "delivered",
    category: "Accessories",
    student: "Jane Doe",
  },
]

// Pending orders
export const pendingOrders: Purchase[] = [
  {
    id: 9,
    item: "Exercise Books",
    date: "2024-01-20",
    amount: "1,800",
    status: "processing",
    category: "Notebooks",
    student: "Jane Doe",
  },
  {
    id: 10,
    item: "Pencil Case",
    date: "2024-01-18",
    amount: "2,800",
    status: "shipped",
    category: "Accessories",
    student: "Jane Doe",
  },
]

// Notifications
export const notifications: Notification[] = [
  {
    id: 1,
    message: "New school supplies list available for Grade 5",
    date: "2024-01-20",
    read: false,
    type: "school",
    priority: "high",
  },
  {
    id: 2,
    message: "Your order #12345 has been delivered",
    date: "2024-01-19",
    read: true,
    type: "order",
    priority: "medium",
  },
  {
    id: 3,
    message: "Reminder: Science lab materials needed by Feb 1st",
    date: "2024-01-18",
    read: false,
    type: "school",
    priority: "high",
  },
  {
    id: 4,
    message: "Parent-teacher meeting scheduled for Feb 5th",
    date: "2024-01-17",
    read: false,
    type: "school",
    priority: "high",
  },
  {
    id: 5,
    message: "Payment confirmation for January supplies",
    date: "2024-01-15",
    read: true,
    type: "payment",
    priority: "low",
  },
  {
    id: 6,
    message: "New sports equipment available for purchase",
    date: "2024-01-12",
    read: true,
    type: "announcement",
    priority: "low",
  },
]

// Chart data for parent dashboard
export const monthlySpendingData = {
  labels: ["Sep", "Oct", "Nov", "Dec", "Jan"],
  datasets: [
    {
      label: "Monthly Spending (RWF)",
      data: [25000, 18000, 32000, 27000, 26500],
      backgroundColor: "rgba(59, 130, 246, 0.8)",
      borderColor: "rgba(59, 130, 246, 1)",
      borderWidth: 1,
    },
  ],
}

export const categorySpendingData = {
  labels: ["School Bags", "Notebooks", "Uniforms", "Calculators", "Art Supplies", "Accessories"],
  datasets: [
    {
      data: [15000, 5000, 18000, 8500, 12000, 11700],
      backgroundColor: ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#06B6D4"],
    },
  ],
}

export const materialPurchasePerTermData = {
  labels: ["Term 1 (Sep-Dec)", "Term 2 (Jan-Mar)", "Term 3 (Apr-Jun)"],
  datasets: [
    {
      label: "Material Purchases (RWF)",
      data: [45000, 32000, 38000],
      borderColor: "rgba(59, 130, 246, 1)",
      backgroundColor: "rgba(59, 130, 246, 0.1)",
      tension: 0.4,
      fill: true,
    },
  ],
}

// School manager orders
export const schoolOrders: Order[] = [
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

// School manager products
export const schoolProducts: SchoolProduct[] = [
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
]

// School manager sidebar items
export const schoolManagerSidebarItems = [
  { id: "overview", label: "Dashboard Overview", icon: null },
  { id: "orders", label: "Orders Management", icon: null },
  { id: "stock", label: "Stock Management", icon: null },
  { id: "customers", label: "Customer Management", icon: null },
  { id: "analytics", label: "Analytics & Reports", icon: null },
  { id: "settings", label: "Settings", icon: null },
]

// Chart data for school manager
export const salesData = {
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

export const orderStatusData = {
  labels: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
  datasets: [
    {
      data: [12, 8, 15, 45, 3],
      backgroundColor: ["#F59E0B", "#3B82F6", "#8B5CF6", "#10B981", "#EF4444"],
    },
  ],
}

export const categoryPerformanceData = {
  labels: ["School Bags", "Notebooks", "Uniforms", "Calculators", "Art Supplies"],
  datasets: [
    {
      label: "Units Sold",
      data: [25, 45, 30, 15, 20],
      borderColor: "rgba(59, 130, 246, 1)",
      backgroundColor: "rgba(59, 130, 246, 0.1)",
      tension: 0.4,
    },
  ],
}

// Featured products for product detail page
export const featuredProducts: Product[] = [
  {
    id: 1,
    name: "Premium School Backpack",
    price: "15,000",
    image: "/premium-blue-school-backpack.png",
    required: true,
    rating: 5,
    reviews: 89,
    inStock: true,
    category: "School Bags",
    description:
      "Spacious and durable backpack with multiple compartments, padded straps, and water-resistant material. Perfect for carrying books, supplies, and electronics safely.",
  },
  {
    id: 2,
    name: "Scientific Calculator",
    price: "8,500",
    image: "/scientific-calculator.png",
    required: false,
    rating: 4,
    reviews: 156,
    inStock: true,
    category: "Calculators",
    description:
      "Advanced scientific calculator with 240+ functions, perfect for mathematics, physics, and engineering courses. Features a clear display and intuitive button layout.",
  },
]
