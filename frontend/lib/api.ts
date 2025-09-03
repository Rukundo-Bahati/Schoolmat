// School Manager API functions
export interface SchoolManagerProduct {
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
  imageUrl?: string
}

export interface SchoolManagerOrder {
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
    productId?: string
  }>
  totalAmount: number
  status: "pending" | "processing" | "delivered" | "cancelled"
  orderDate: string
  paymentMethod: string
  deliveryAddress: string
  createdAt?: string
  updatedAt?: string
}

export interface OrderStats {
  totalOrders: number
  totalRevenue: number
  pendingOrders: number
  processingOrders: number
  deliveredOrders: number
  cancelledOrders: number
}

export interface CustomerData {
  id: string
  name: string
  email: string
  phone: string
  totalOrders: number
  totalSpent: number
  lastOrderDate: string
  students: string[]
}

export interface SalesAnalytics {
  monthlyRevenue: Array<{ month: string; revenue: number }>
  orderStatusDistribution: Array<{ status: string; count: number }>
  categoryPerformance: Array<{ category: string; unitsSold: number; revenue: number }>
  termRevenue: Array<{ term: string; revenue: number }>
  productPurchasesByTerm: Array<{ term: string; purchases: number }>
}

// Frontend Product Management
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
  category?: string
}

// Cart Management
export interface CartItem {
  id: string
  productId: number
  name: string
  price: number
  quantity: number
  image: string
  category?: string
}

export interface CartTotal {
  totalItems: number
  totalAmount: number
}

// Categories Management
export interface Category {
  id: string
  name: string
  image: string
}

// Products Management
export async function fetchSchoolProducts(token: string): Promise<SchoolManagerProduct[]> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }
    const products = await response.json();
    return products.map((product: any) => ({
      id: product.id,
      name: product.name,
      category: product.category?.name || product.category,
      price: parseFloat(product.price),
      stock: product.stock || 0,
      minStock: product.minStock || 10,
      required: product.required || false,
      description: product.description || '',
      supplier: product.supplier || '',
      lastUpdated: product.updatedAt || new Date().toISOString().split('T')[0],
      imageUrl: product.imageUrl,
    }));
  } catch (error) {
    console.error('Error fetching school products:', error);
    throw error;
  }
}

export async function createSchoolProduct(token: string, productData: Partial<SchoolManagerProduct>): Promise<SchoolManagerProduct> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: productData.name,
        price: productData.price,
        category: productData.category,
        stock: productData.stock,
        minStock: productData.minStock,
        required: productData.required,
        description: productData.description,
        supplier: productData.supplier,
        imageUrl: productData.imageUrl || '/placeholder-product.png', // Default placeholder image
      }),
    });
    if (!response.ok) {
      throw new Error('Failed to create product');
    }
    const product = await response.json();
    return {
      id: product.id,
      name: product.name,
      category: product.category?.name || product.category,
      price: parseFloat(product.price),
      stock: product.stock || 0,
      minStock: product.minStock || 10,
      required: product.required || false,
      description: product.description || '',
      supplier: product.supplier || '',
      lastUpdated: product.updatedAt || new Date().toISOString().split('T')[0],
      imageUrl: product.imageUrl,
    };
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
}

export async function updateSchoolProduct(token: string, productId: string, productData: Partial<SchoolManagerProduct>): Promise<SchoolManagerProduct> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${productId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: productData.name,
        price: productData.price,
        category: productData.category,
        stock: productData.stock,
        minStock: productData.minStock,
        required: productData.required,
        description: productData.description,
        supplier: productData.supplier,
        imageUrl: productData.imageUrl,
      }),
    });
    if (!response.ok) {
      throw new Error('Failed to update product');
    }
    const product = await response.json();
    return {
      id: product.id,
      name: product.name,
      category: product.category?.name || product.category,
      price: parseFloat(product.price),
      stock: product.stock || 0,
      minStock: product.minStock || 10,
      required: product.required || false,
      description: product.description || '',
      supplier: product.supplier || '',
      lastUpdated: product.updatedAt || new Date().toISOString().split('T')[0],
      imageUrl: product.imageUrl,
    };
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
}

export async function deleteSchoolProduct(token: string, productId: string): Promise<void> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${productId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error('Failed to delete product');
    }
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
}

export async function updateProductStock(token: string, productId: string, quantity: number): Promise<SchoolManagerProduct> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${productId}/stock`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ quantity }),
    });
    if (!response.ok) {
      throw new Error('Failed to update product stock');
    }
    const product = await response.json();
    return {
      id: product.id,
      name: product.name,
      category: product.category?.name || product.category,
      price: parseFloat(product.price),
      stock: product.stock || 0,
      minStock: product.minStock || 10,
      required: product.required || false,
      description: product.description || '',
      supplier: product.supplier || '',
      lastUpdated: product.updatedAt || new Date().toISOString().split('T')[0],
      imageUrl: product.imageUrl,
    };
  } catch (error) {
    console.error('Error updating product stock:', error);
    throw error;
  }
}

// Frontend Products
export async function fetchProducts(): Promise<Product[]> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`);
    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }
    const products = await response.json();
    return products.map((product: any) => ({
      id: product.id,
      name: product.name,
      price: product.price.toString(),
      image: product.imageUrl || '/placeholder.jpg',
      required: product.required || false,
      description: product.description || '',
      rating: product.rating || 4.5,
      reviews: product.reviews || 0,
      inStock: product.stock > 0,
      category: product.category?.name || product.category,
    }));
  } catch (error) {
    console.error('Error fetching products:', error);
    // Return mock data as fallback
    return [
      {
        id: 1,
        name: "School Notebook",
        price: "1500",
        image: "/placeholder.jpg",
        required: true,
        description: "Standard school notebook",
        rating: 4.5,
        reviews: 12,
        inStock: true,
        category: "Stationery"
      },
      {
        id: 2,
        name: "Math Textbook",
        price: "5000",
        image: "/placeholder.jpg",
        required: true,
        description: "Mathematics textbook for grade 7",
        rating: 4.2,
        reviews: 8,
        inStock: true,
        category: "Books"
      }
    ];
  }
}

export async function fetchProduct(id: string): Promise<Product> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch product');
    }
    const product = await response.json();
    return {
      id: product.id,
      name: product.name,
      price: product.price.toString(),
      image: product.imageUrl || '/placeholder.jpg',
      required: product.required || false,
      description: product.description || '',
      rating: product.rating || 4.5,
      reviews: product.reviews || 0,
      inStock: product.stock > 0,
      category: product.category?.name || product.category,
    };
  } catch (error) {
    console.error('Error fetching product:', error);
    // Return mock data as fallback
    return {
      id: parseInt(id),
      name: "Sample Product",
      price: "2500",
      image: "/placeholder.jpg",
      required: false,
      description: "Sample product description",
      rating: 4.0,
      reviews: 5,
      inStock: true,
      category: "Stationery"
    };
  }
}

export async function fetchFeaturedProducts(): Promise<Product[]> {
  try {
    // Return all products from the database for the featured section
    const allProducts = await fetchProducts();
    return allProducts; // Return all products instead of just 6
  } catch (error) {
    console.error('Error fetching featured products:', error);
    throw error;
  }
}

// Categories Management
export async function fetchCategories(): Promise<Category[]> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`);
    if (!response.ok) {
      throw new Error('Failed to fetch categories');
    }
    const categories = await response.json();
    return categories.map((category: any) => ({
      id: category.id,
      name: category.name,
      image: category.imageUrl || '/placeholder.jpg',
    }));
  } catch (error) {
    console.error('Error fetching categories:', error);
    // Return mock data as fallback
    const mockCategories: Category[] = [
      {
        id: "1",
        name: "Stationery",
        image: "/categories/stationery.jpg"
      },
      {
        id: "2",
        name: "Books",
        image: "/categories/books.jpg"
      },
      {
        id: "3",
        name: "Uniforms",
        image: "/categories/uniforms.jpg"
      },
      {
        id: "4",
        name: "Sports Equipment",
        image: "/categories/sports.jpg"
      },
      {
        id: "5",
        name: "Art Supplies",
        image: "/categories/art.jpg"
      },
      {
        id: "6",
        name: "Electronics",
        image: "/categories/electronics.jpg"
      }
    ];
    return mockCategories;
  }
}

export async function fetchProductsByCategory(categoryName: string): Promise<SchoolManagerProduct[]> {
  try {
    // For now, filter products by category from the existing products
    // TODO: Replace with actual API call when backend supports category filtering
    const allProducts = await fetchSchoolProducts('');
    return allProducts.filter(product =>
      product.category.toLowerCase() === categoryName.toLowerCase()
    )
  } catch (error) {
    console.error('Error fetching products by category:', error)
    throw error
  }
}

// Cart Management
export async function getCartTotal(token: string): Promise<CartTotal> {
  try {
    if (!token) {
      return { totalItems: 0, totalAmount: 0 };
    }
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart/total`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error('Failed to fetch cart total');
    }
    const data = await response.json();
    return {
      totalItems: data.totalItems || 0,
      totalAmount: data.totalAmount || 0,
    };
  } catch (error) {
    console.error('Error fetching cart total:', error);
    // Return mock data as fallback
    return { totalItems: 0, totalAmount: 0 };
  }
}

export async function fetchCartItems(token: string): Promise<CartItem[]> {
  try {
    if (!token) {
      return [];
    }
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error('Failed to fetch cart items');
    }
    const items = await response.json();
    return items.map((item: any) => ({
      id: item.id,
      productId: item.productId,
      name: item.productName || item.name,
      price: item.price,
      quantity: item.quantity,
      image: item.imageUrl || '/placeholder.jpg',
      category: item.category,
    }));
  } catch (error) {
    console.error('Error fetching cart items:', error);
    // Return mock data as fallback
    return [];
  }
}

export async function addToCart(token: string, productId: number, quantity: number = 1): Promise<void> {
  try {
    if (!token) {
      throw new Error('Authentication required');
    }
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ productId, quantity }),
    });
    if (!response.ok) {
      throw new Error('Failed to add item to cart');
    }
  } catch (error) {
    console.error('Error adding to cart:', error);
    throw error;
  }
}

export async function updateCartItem(token: string, itemId: string, quantity: number): Promise<void> {
  try {
    if (!token) {
      throw new Error('Authentication required');
    }
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart/${itemId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ quantity }),
    });
    if (!response.ok) {
      throw new Error('Failed to update cart item');
    }
  } catch (error) {
    console.error('Error updating cart item:', error);
    throw error;
  }
}

export async function removeFromCart(token: string, itemId: string): Promise<void> {
  try {
    if (!token) {
      throw new Error('Authentication required');
    }
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart/${itemId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error('Failed to remove item from cart');
    }
  } catch (error) {
    console.error('Error removing from cart:', error);
    throw error;
  }
}

// Orders Management
export async function fetchSchoolOrders(token: string): Promise<SchoolManagerOrder[]> {
  try {
    if (!token) {
      throw new Error('No authentication token provided');
    }
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error('Failed to fetch orders');
    }
    const orders = await response.json();
    return orders.map((order: any) => ({
      id: order.id,
      parentName: order.parentName,
      parentEmail: order.parentEmail,
      parentPhone: order.parentPhone,
      studentName: order.studentName,
      studentGrade: order.studentGrade,
      studentClass: order.studentClass,
      items: order.items.map((item: any) => ({
        name: item.productName || item.name,
        quantity: item.quantity,
        price: item.price,
        category: item.category,
        productId: item.productId,
      })),
      totalAmount: order.totalAmount,
      status: order.status,
      orderDate: order.createdAt ? new Date(order.createdAt).toISOString().split('T')[0] : order.orderDate,
      paymentMethod: order.paymentMethod,
      deliveryAddress: order.deliveryAddress,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    }));
  } catch (error) {
    console.error('Error fetching school orders:', error);
    throw error;
  }
}

export async function updateOrderStatus(token: string, orderId: string, status: string): Promise<SchoolManagerOrder> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/${orderId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    });
    if (!response.ok) {
      throw new Error('Failed to update order status');
    }
    const order = await response.json();
    return {
      id: order.id,
      parentName: order.parentName,
      parentEmail: order.parentEmail,
      parentPhone: order.parentPhone,
      studentName: order.studentName,
      studentGrade: order.studentGrade,
      studentClass: order.studentClass,
      items: order.items.map((item: any) => ({
        name: item.productName || item.name,
        quantity: item.quantity,
        price: item.price,
        category: item.category,
        productId: item.productId,
      })),
      totalAmount: order.totalAmount,
      status: order.status,
      orderDate: order.createdAt ? new Date(order.createdAt).toISOString().split('T')[0] : order.orderDate,
      paymentMethod: order.paymentMethod,
      deliveryAddress: order.deliveryAddress,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    };
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
}

export async function bulkUpdateOrderStatus(token: string, orderIds: string[], status: string): Promise<SchoolManagerOrder[]> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/bulk/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ orderIds, status }),
    });
    if (!response.ok) {
      throw new Error('Failed to bulk update order statuses');
    }
    const orders = await response.json();
    return orders.map((order: any) => ({
      id: order.id,
      parentName: order.parentName,
      parentEmail: order.parentEmail,
      parentPhone: order.parentPhone,
      studentName: order.studentName,
      studentGrade: order.studentGrade,
      studentClass: order.studentClass,
      items: order.items.map((item: any) => ({
        name: item.productName || item.name,
        quantity: item.quantity,
        price: item.price,
        category: item.category,
        productId: item.productId,
      })),
      totalAmount: order.totalAmount,
      status: order.status,
      orderDate: order.createdAt ? new Date(order.createdAt).toISOString().split('T')[0] : order.orderDate,
      paymentMethod: order.paymentMethod,
      deliveryAddress: order.deliveryAddress,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    }));
  } catch (error) {
    console.error('Error bulk updating order statuses:', error);
    throw error;
  }
}

export async function fetchOrderStats(token: string): Promise<OrderStats> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/stats`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error('Failed to fetch order stats');
    }
    const stats = await response.json();

    // Calculate average order value including pending and processing orders
    const allOrdersResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!allOrdersResponse.ok) {
      throw new Error('Failed to fetch all orders for average order value');
    }
    const allOrders = await allOrdersResponse.json();
    const totalAmountAllOrders = allOrders.reduce((sum: number, order: any) => sum + order.totalAmount, 0);
    const averageOrderValue = allOrders.length > 0 ? totalAmountAllOrders / allOrders.length : 0;

    return {
      ...stats,
      averageOrderValue,
    };
  } catch (error) {
    console.error('Error fetching order stats:', error);
    throw error;
  }
}

// Customers Management
export async function fetchCustomers(token: string): Promise<CustomerData[]> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error('Failed to fetch customers');
    }
    const users = await response.json();

    // For each user, we might need to fetch their orders to calculate stats
    // This is a simplified version - in a real app, you might want a dedicated customer stats endpoint
    const customersWithStats = await Promise.all(
      users.map(async (user: any) => {
        try {
          const ordersResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/user/${user.id}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
          const userOrders = ordersResponse.ok ? await ordersResponse.json() : [];

          const totalSpent = userOrders.reduce((sum: number, order: any) => sum + order.totalAmount, 0);
          const students = [...new Set(userOrders.map((order: any) => order.studentName))];
          const lastOrderDate = userOrders.length > 0
            ? userOrders.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0].createdAt
            : null;

          return {
            id: user.id,
            name: `${user.firstName} ${user.lastName}`,
            email: user.email,
            phone: user.phone || '',
            totalOrders: userOrders.length,
            totalSpent: totalSpent,
            lastOrderDate: lastOrderDate ? new Date(lastOrderDate).toISOString().split('T')[0] : '',
            students: students,
          };
        } catch (error) {
          console.error(`Error fetching orders for user ${user.id}:`, error);
          return {
            id: user.id,
            name: `${user.firstName} ${user.lastName}`,
            email: user.email,
            phone: user.phone || '',
            totalOrders: 0,
            totalSpent: 0,
            lastOrderDate: '',
            students: [],
          };
        }
      })
    );

    return customersWithStats;
  } catch (error) {
    console.error('Error fetching customers:', error);
    throw error;
  }
}

// Parent Dashboard API functions
export interface ParentProfile {
  id: string
  email: string
  firstName: string
  lastName: string
  phone: string
  role: string
  status: string
  isEmailVerified: boolean
  profileImageUrl?: string
  createdAt: string
  updatedAt: string
}

export interface ParentOrder {
  id: string
  userId: string
  parentName: string
  parentEmail: string
  parentPhone: string
  studentName: string
  studentGrade: string
  studentClass: string
  items: Array<{
    productId: string
    productName: string
    quantity: number
    price: number
    category: string
  }>
  totalAmount: number
  status: string
  orderDate: string
  paymentMethod: string
  deliveryAddress: string
  createdAt: string
  updatedAt: string
}

export interface ParentOrderStats {
  totalOrders: number
  totalRevenue: number
  pendingOrders: number
  processingOrders: number
  deliveredOrders: number
  cancelledOrders: number
}

export interface ParentNotification {
  id: string
  title: string
  message: string
  type: string
  orderId?: string
  isRead: boolean
  createdAt: string
  updatedAt: string
}

export interface ParentDashboardOverview {
  monthlySpending: Array<{ month: string; total: number }>
  categorySpending: Array<{ category: string; total: number }>
  recentOrders: Array<{
    id: string
    item: string
    date: string
    amount: string
    status: string
    category: string
  }>
  totalSpent: number
  totalOrders: number
  pendingOrders: number
}

// Parent Profile Management
export async function fetchParentProfile(token: string): Promise<ParentProfile> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/profile/me`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error('Failed to fetch parent profile');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching parent profile:', error);
    throw error;
  }
}

export async function updateParentProfile(token: string, profileData: Partial<ParentProfile>): Promise<ParentProfile> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/profile/me`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(profileData),
    });
    if (!response.ok) {
      throw new Error('Failed to update parent profile');
    }
    return await response.json();
  } catch (error) {
    console.error('Error updating parent profile:', error);
    throw error;
  }
}

export async function changeParentPassword(token: string, currentPassword: string, newPassword: string): Promise<void> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/change-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        currentPassword,
        newPassword,
      }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to change password');
    }
  } catch (error) {
    console.error('Error changing password:', error);
    throw error;
  }
}

// Parent Orders Management
export async function fetchParentOrders(token: string): Promise<ParentOrder[]> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/user`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error('Failed to fetch parent orders');
    }
    const orders = await response.json();
    return orders.map((order: any) => ({
      ...order,
      orderDate: order.createdAt ? new Date(order.createdAt).toISOString().split('T')[0] : order.orderDate,
    }));
  } catch (error) {
    console.error('Error fetching parent orders:', error);
    throw error;
  }
}

export async function fetchParentOrderStats(token: string): Promise<ParentOrderStats> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/user/stats`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error('Failed to fetch parent order stats');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching parent order stats:', error);
    throw error;
  }
}

// Parent Notifications Management
export async function fetchParentNotifications(token: string, limit: number = 20): Promise<ParentNotification[]> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/notifications?limit=${limit}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error('Failed to fetch parent notifications');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching parent notifications:', error);
    throw error;
  }
}

export async function markParentNotificationAsRead(token: string, notificationId: string): Promise<void> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/notifications/mark-read/${notificationId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error('Failed to mark notification as read');
    }
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
}

// Parent Dashboard Overview
export async function fetchParentDashboardOverview(token: string): Promise<ParentDashboardOverview> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/dashboard/overview`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error('Failed to fetch parent dashboard overview');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching parent dashboard overview:', error);
    throw error;
  }
}

// Analytics
// Simple in-memory cache for analytics data
let analyticsCache: { data: SalesAnalytics; timestamp: number } | null = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

export async function fetchSalesAnalytics(token: string, forceRefresh: boolean = false): Promise<SalesAnalytics> {
  try {
    // Check cache if not forcing refresh
    if (!forceRefresh && analyticsCache) {
      const now = Date.now();
      if (now - analyticsCache.timestamp < CACHE_DURATION) {
        return analyticsCache.data;
      }
    }

    // This would typically be a dedicated analytics endpoint
    // For now, we'll aggregate data from orders
    const orders = await fetchSchoolOrders(token);

    // Monthly revenue
    const monthlyRevenue = orders
      .filter((order: SchoolManagerOrder) => order.status === 'delivered')
      .reduce((acc: Record<string, number>, order: SchoolManagerOrder) => {
        const month = new Date(order.orderDate).toLocaleString('default', { month: 'short' });
        acc[month] = (acc[month] || 0) + order.totalAmount;
        return acc;
      }, {} as Record<string, number>);

    const monthlyRevenueArray = Object.entries(monthlyRevenue).map(([month, revenue]) => ({
      month,
      revenue: revenue as number,
    }));

    // Order status distribution
    const statusCounts = orders.reduce((acc: Record<string, number>, order: SchoolManagerOrder) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const orderStatusDistribution = Object.entries(statusCounts).map(([status, count]) => ({
      status,
      count: count as number,
    }));

    // Category performance
    const categoryData = orders
      .filter((order: SchoolManagerOrder) => order.status === 'delivered')
      .flatMap((order: SchoolManagerOrder) => order.items)
      .reduce((acc: Record<string, { unitsSold: number; revenue: number }>, item: any) => {
        if (!acc[item.category]) {
          acc[item.category] = { unitsSold: 0, revenue: 0 };
        }
        acc[item.category].unitsSold += item.quantity;
        acc[item.category].revenue += item.price * item.quantity;
        return acc;
      }, {} as Record<string, { unitsSold: number; revenue: number }>);

    const categoryPerformance = Object.entries(categoryData).map(([category, data]) => ({
      category,
      unitsSold: data.unitsSold,
      revenue: data.revenue,
    }));

    // Term revenue (only from delivered orders)
    const termRevenue = [
      { term: 'Term 1 (Sep-Dec)', revenue: orders
          .filter((order: SchoolManagerOrder) => order.status === 'delivered')
          .filter((order: SchoolManagerOrder) => {
            const month = new Date(order.orderDate).getMonth() + 1;
            return month >= 9 && month <= 12;
          })
          .reduce((sum: number, order: SchoolManagerOrder) => sum + order.totalAmount, 0) },
      { term: 'Term 2 (Jan-Mar)', revenue: orders
          .filter((order: SchoolManagerOrder) => order.status === 'delivered')
          .filter((order: SchoolManagerOrder) => {
            const month = new Date(order.orderDate).getMonth() + 1;
            return month >= 1 && month <= 3;
          })
          .reduce((sum: number, order: SchoolManagerOrder) => sum + order.totalAmount, 0) },
      { term: 'Term 3 (Apr-Jun)', revenue: orders
          .filter((order: SchoolManagerOrder) => order.status === 'delivered')
          .filter((order: SchoolManagerOrder) => {
            const month = new Date(order.orderDate).getMonth() + 1;
            return month >= 4 && month <= 6;
          })
          .reduce((sum: number, order: SchoolManagerOrder) => sum + order.totalAmount, 0) },
    ];

    // Product purchases by term (count of items purchased, from all orders)
    const productPurchasesByTerm = [
      { term: 'Term 1 (Sep-Dec)', purchases: orders
          .filter((order: SchoolManagerOrder) => {
            const month = new Date(order.orderDate).getMonth() + 1;
            return month >= 9 && month <= 12;
          })
          .flatMap((order: SchoolManagerOrder) => order.items)
          .reduce((sum: number, item: any) => sum + item.quantity, 0) },
      { term: 'Term 2 (Jan-Mar)', purchases: orders
          .filter((order: SchoolManagerOrder) => {
            const month = new Date(order.orderDate).getMonth() + 1;
            return month >= 1 && month <= 3;
          })
          .flatMap((order: SchoolManagerOrder) => order.items)
          .reduce((sum: number, item: any) => sum + item.quantity, 0) },
      { term: 'Term 3 (Apr-Jun)', purchases: orders
          .filter((order: SchoolManagerOrder) => {
            const month = new Date(order.orderDate).getMonth() + 1;
            return month >= 4 && month <= 6;
          })
          .flatMap((order: SchoolManagerOrder) => order.items)
          .reduce((sum: number, item: any) => sum + item.quantity, 0) },
    ];

    const result = {
      monthlyRevenue: monthlyRevenueArray,
      orderStatusDistribution,
      categoryPerformance,
      termRevenue,
      productPurchasesByTerm,
    };

    // Cache the result
    analyticsCache = {
      data: result,
      timestamp: Date.now(),
    };

    return result;
  } catch (error) {
    console.error('Error fetching sales analytics:', error);
    throw error;
  }
}

// Checkout-specific functions and types
export interface UserProfile {
  id: string
  email: string
  firstName: string
  lastName: string
  phone: string
  role: string
  isEmailVerified: boolean
}

export interface SchoolInfo {
  id: string
  name: string
  address: string
  phone: string
  email: string
  momoCode?: string
  logoUrl?: string
}

export interface OrderResult {
  success: boolean
  orderId: string
  message?: string
}

// Fetch user profile for checkout
export async function fetchUserProfile(token: string): Promise<UserProfile> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/profile/me`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error('Failed to fetch user profile');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
}

// Fetch school information
export async function fetchSchoolInfo(): Promise<SchoolInfo> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/school/info`);
    if (!response.ok) {
      throw new Error('Failed to fetch school info');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching school info:', error);
    // Return mock data as fallback
    return {
      id: '1',
      name: 'SchoolMart Demo School',
      address: 'Kigali, Rwanda',
      phone: '+250 788 123 456',
      email: 'info@schoolmart.rw',
      momoCode: '123435',
      logoUrl: '/school-logo.png'
    };
  }
}

// Submit order
export async function submitOrder(token: string, orderData: any): Promise<OrderResult> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(orderData),
    });
    if (!response.ok) {
      throw new Error('Failed to submit order');
    }
    const result = await response.json();
    return {
      success: true,
      orderId: result.id || `ORD-${Date.now()}`,
      message: 'Order submitted successfully'
    };
  } catch (error) {
    console.error('Error submitting order:', error);
    throw error;
  }
}

// Send order notifications (SMS and email)
export async function sendOrderNotifications(token: string, orderData: any): Promise<void> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/send-notifications`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(orderData),
    });
    if (!response.ok) {
      throw new Error('Failed to send notifications');
    }
  } catch (error) {
    console.error('Error sending notifications:', error);
    // Don't throw error as notifications are optional
  }
}

// Clear cart after successful order
export async function clearCart(token: string): Promise<void> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart/clear`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error('Failed to clear cart');
    }
  } catch (error) {
    console.error('Error clearing cart:', error);
    // Don't throw error as cart clearing is optional
  }
}
