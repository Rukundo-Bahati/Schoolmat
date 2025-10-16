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
  id: string
  name: string
  price: string
  image: string
  imageUrl?: string
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
  productId: string
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
      const errorData = await response.json().catch(() => ({}));
      console.error('Create product error:', errorData);
      throw new Error(errorData.message || `Failed to create product: ${response.status} ${response.statusText}`);
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
    throw error;
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
    throw error;
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
}

export async function fetchProductsByCategory(categoryName: string): Promise<SchoolManagerProduct[]> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/category/${encodeURIComponent(categoryName)}`);
    if (!response.ok) {
      throw new Error('Failed to fetch products by category');
    }
    const products = await response.json();
    return products.map((product: any) => ({
      id: product.id,
      name: product.name,
      category: product.category,
      price: product.price,
      stock: product.stock,
      minStock: product.minStock,
      required: product.required,
      description: product.description,
      supplier: product.supplier,
      lastUpdated: product.updatedAt || product.lastUpdated,
      imageUrl: product.imageUrl || product.image,
    }));
  } catch (error) {
    console.error('Error fetching products by category:', error);
    throw error;
  }
}

// Cart Management
export async function getCartTotal(token: string): Promise<CartTotal> {
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
}

export async function fetchCartItems(token: string): Promise<CartItem[]> {
  if (!token) {
    console.log('No token provided, returning empty cart');
    return [];
  }
  
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart/items`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to fetch cart items');
  }
  
  const data = await response.json();
  
  // Handle both array and object responses
  const items = Array.isArray(data) ? data : (data.items || []);
  
  return items.map((item: any) => ({
    id: item.id || item._id,
    productId: item.productId || (item.product ? item.product.id : ''),
    name: item.productName || item.product?.name || item.name || 'Unknown Product',
    price: item.price || 0,
    quantity: item.quantity || 1,
    image: item.imageUrl || item.product?.imageUrl || item.image || '/placeholder.jpg',
    category: item.category || item.product?.category || 'Uncategorized',
  }));
}

export async function addToCart(token: string, productId: string, quantity: number = 1): Promise<void> {
  try {
    if (!token) {
      throw new Error('Authentication required');
    }
    
    if (!productId || productId === 'NaN' || productId.trim() === '') {
      throw new Error('Invalid product ID provided');
    }
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart/items`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ 
        productId: productId,
        quantity 
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to add item to cart');
    }
  } catch (error) {
    console.error('Error adding to cart:', error);
    throw error;
  }
}

export const updateCartItem = async (token: string, itemId: string, quantity: number): Promise<void> => {
  try {
    if (!token) {
      throw new Error('Authentication required');
    }
    
    if (!itemId) {
      throw new Error('Item ID is required');
    }
    
    if (typeof quantity !== 'number' || quantity < 1) {
      throw new Error('Invalid quantity');
    }
    
    const url = `${process.env.NEXT_PUBLIC_API_URL}/cart/items/${itemId}`;
    console.log('Updating cart item:', { url, itemId, quantity });
    
    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ quantity }),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('API Error Response:', {
        status: response.status,
        statusText: response.statusText,
        error: errorData
      });
      throw new Error(errorData.message || 'Failed to update cart item');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error in updateCartItem:', {
      error,
      itemId,
      quantity,
      hasToken: !!token
    });
    throw error;
  }
}

export async function removeFromCart(token: string, itemId: string): Promise<void> {
  try {
    if (!token) {
      throw new Error('Authentication required');
    }
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart/items/${itemId}`, {
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
      parentName: order.parentName || `${order.user?.firstName || ''} ${order.user?.lastName || ''}`.trim(),
      parentEmail: order.parentEmail || order.user?.email,
      parentPhone: order.parentPhone || order.user?.phone,
      studentName: order.studentName,
      studentGrade: order.studentGrade,
      studentClass: order.studentClass,
      items: order.items?.map((item: any) => ({
        productId: item.productId,
        productName: item.productName || item.product?.name,
        quantity: item.quantity,
        price: item.price,
        category: item.category || item.product?.category,
      })) || [],
      totalAmount: order.totalAmount,
      status: order.status,
      orderDate: order.orderDate || order.createdAt,
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
      parentName: order.parentName || `${order.user?.firstName || ''} ${order.user?.lastName || ''}`.trim(),
      parentEmail: order.parentEmail || order.user?.email,
      parentPhone: order.parentPhone || order.user?.phone,
      studentName: order.studentName,
      studentGrade: order.studentGrade,
      studentClass: order.studentClass,
      items: order.items?.map((item: any) => ({
        productId: item.productId,
        productName: item.productName || item.product?.name,
        quantity: item.quantity,
        price: item.price,
        category: item.category || item.product?.category,
      })) || [],
      totalAmount: order.totalAmount,
      status: order.status,
      orderDate: order.orderDate || order.createdAt,
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
    const requestBody = { orderIds, status };
    console.log('Bulk update API request:', requestBody);
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/bulk/update-status`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(requestBody),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Bulk update error response:', {
        status: response.status,
        statusText: response.statusText,
        errorData
      });
      throw new Error(errorData.message || `Failed to bulk update order status: ${response.status} ${response.statusText}`);
    }
    const orders = await response.json();
    return orders.map((order: any) => ({
      id: order.id,
      parentName: order.parentName || `${order.user?.firstName || ''} ${order.user?.lastName || ''}`.trim(),
      parentEmail: order.parentEmail || order.user?.email,
      parentPhone: order.parentPhone || order.user?.phone,
      studentName: order.studentName,
      studentGrade: order.studentGrade,
      studentClass: order.studentClass,
      items: order.items?.map((item: any) => ({
        productId: item.productId,
        productName: item.productName || item.product?.name,
        quantity: item.quantity,
        price: item.price,
        category: item.category || item.product?.category,
      })) || [],
      totalAmount: order.totalAmount,
      status: order.status,
      orderDate: order.orderDate || order.createdAt,
      paymentMethod: order.paymentMethod,
      deliveryAddress: order.deliveryAddress,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    }));
  } catch (error) {
    console.error('Error in bulk update order status:', error);
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
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to fetch order stats');
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
    const totalAmountAllOrders = allOrders.reduce((sum: number, order: any) => sum + (order.totalAmount || 0), 0);
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
          const ordersResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/user/${user?.id}`, {
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
            id: user?.id,
            name: `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || 'Unknown User',
            email: user?.email || '',
            phone: user?.phone || '',
            totalOrders: userOrders.length,
            totalSpent: totalSpent,
            lastOrderDate: lastOrderDate ? new Date(lastOrderDate).toISOString().split('T')[0] : '',
            students: students,
          };
        } catch (error) {
          console.error(`Error fetching orders for user ${user?.id}:`, error);
          return {
            id: user?.id,
            name: `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || 'Unknown User',
            email: user?.email || '',
            phone: user?.phone || '',
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
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to fetch parent orders');
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
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to fetch parent order stats');
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
      throw new Error('Failed to fetch notifications');
    }
    
    const notifications = await response.json();
    
    // Ensure all notifications have valid string IDs
    return notifications.map((notification: any) => ({
      ...notification,
      id: String(notification.id), // Ensure ID is a string
      isRead: Boolean(notification.isRead), // Ensure isRead is a boolean
    }));
  } catch (error) {
    console.error('Error fetching notifications:', error);
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

export async function markAllParentNotificationsAsRead(token: string): Promise<void> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/notifications/mark-all-read`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error('Failed to mark all notifications as read');
    }
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    throw error;
  }
}

export async function deleteParentNotification(id: string, token: string): Promise<void> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/notifications/${id}/delete`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to delete notification');
    }
  } catch (error) {
    console.error('Error deleting notification:', error);
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
    // Only show data for current and past terms based on current date
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1; // 1-12
    const currentYear = currentDate.getFullYear();
    
    const productPurchasesByTerm = [];
    
    // Term 1 (Sep-Dec) - always show if we're in or past Term 1
    if (currentMonth >= 9 || currentMonth <= 12) {
      productPurchasesByTerm.push({
        term: 'Term 1 (Sep-Dec)',
        purchases: orders
          .filter((order: SchoolManagerOrder) => {
            const orderDate = new Date(order.orderDate);
            const month = orderDate.getMonth() + 1;
            const year = orderDate.getFullYear();
            // For current year: Sep-Dec, for previous year: only if we're in Jan-Aug of next year
            return (year === currentYear && month >= 9 && month <= 12) ||
                   (year === currentYear - 1 && month >= 9 && month <= 12 && currentMonth <= 8);
          })
          .flatMap((order: SchoolManagerOrder) => order.items)
          .reduce((sum: number, item: any) => sum + item.quantity, 0)
      });
    }
    
    // Term 2 (Jan-Mar) - only show if we're in or past Term 2
    if (currentMonth >= 1 && currentMonth <= 12) {
      productPurchasesByTerm.push({
        term: 'Term 2 (Jan-Mar)',
        purchases: orders
          .filter((order: SchoolManagerOrder) => {
            const orderDate = new Date(order.orderDate);
            const month = orderDate.getMonth() + 1;
            const year = orderDate.getFullYear();
            return year === currentYear && month >= 1 && month <= 3;
          })
          .flatMap((order: SchoolManagerOrder) => order.items)
          .reduce((sum: number, item: any) => sum + item.quantity, 0)
      });
    }
    
    // Term 3 (Apr-Jun) - only show if we're in or past Term 3
    if (currentMonth >= 4) {
      productPurchasesByTerm.push({
        term: 'Term 3 (Apr-Jun)',
        purchases: orders
          .filter((order: SchoolManagerOrder) => {
            const orderDate = new Date(order.orderDate);
            const month = orderDate.getMonth() + 1;
            const year = orderDate.getFullYear();
            return year === currentYear && month >= 4 && month <= 6;
          })
          .flatMap((order: SchoolManagerOrder) => order.items)
          .reduce((sum: number, item: any) => sum + item.quantity, 0)
      });
    }

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
  orderId?: string
  message: string
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
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/school/info`);
  if (!response.ok) {
    throw new Error('Failed to fetch school info');
  }
  return await response.json();
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
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to submit order');
    }

    const result = await response.json();
    return {
      success: true,
      orderId: result.id,
      message: 'Order submitted successfully',
    };
  } catch (error) {
    console.error('Error submitting order:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to submit order',
    };
  }
}

// Send order notifications (SMS and email) and clear cart
export async function sendOrderNotifications(token: string, orderData: any): Promise<void> {
  try {
    // Send order notifications
    const notificationResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/notifications`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(orderData),
    });

    if (!notificationResponse.ok) {
      const errorData = await notificationResponse.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to send order notifications');
    }

    // Clear the cart after successful order
    const clearCartResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart/clear`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!clearCartResponse.ok) {
      console.warn('Failed to clear cart after order');
    }
  } catch (error) {
    console.error('Error clearing cart:', error);
    // Don't throw error as cart clearing is optional
  }
}
