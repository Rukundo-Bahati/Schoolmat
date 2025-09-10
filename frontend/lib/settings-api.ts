// Settings Management API functions

export interface SchoolInfo {
  id: string
  name: string
  email: string
  phone: string
  airtelNumber?: string
  mtnNumber?: string
  momoCode?: string
  location?: string
  address?: string
  createdAt: Date
  updatedAt: Date
}

export interface BusinessSettings {
  pickupLocation: string
  businessHours: {
    monday: { open: string; close: string; closed: boolean }
    tuesday: { open: string; close: string; closed: boolean }
    wednesday: { open: string; close: string; closed: boolean }
    thursday: { open: string; close: string; closed: boolean }
    friday: { open: string; close: string; closed: boolean }
    saturday: { open: string; close: string; closed: boolean }
    sunday: { open: string; close: string; closed: boolean }
  }
  processingTime: number
  currency: string
}

export interface NotificationSettings {
  emailNotifications: boolean
  smsNotifications: boolean
  orderConfirmations: boolean
  paymentReminders: boolean
  lowStockAlerts: boolean
  deliveryUpdates: boolean
}

export interface PaymentMethod {
  id: string
  type: 'mtn' | 'airtel' | 'card' | 'bank'
  name: string
  accountNumber?: string
  accountName?: string
  isActive: boolean
}

export interface SystemPreferences {
  defaultOrderStatus: 'pending' | 'processing'
  autoApproveOrders: boolean
  lowStockThreshold: number
  dataRetentionPeriod: number
}

// School Info Management
export async function fetchSchoolInfo(token: string): Promise<SchoolInfo> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/school-info`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error('Failed to fetch school info');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching school info:', error);
    throw error;
  }
}

export async function updateSchoolInfo(token: string, schoolInfo: Partial<SchoolInfo>): Promise<SchoolInfo> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/school-info`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(schoolInfo),
    });
    if (!response.ok) {
      throw new Error('Failed to update school info');
    }
    return await response.json();
  } catch (error) {
    console.error('Error updating school info:', error);
    throw error;
  }
}

// User Profile Management
export async function updateUserProfile(token: string, userId: string, userData: { firstName?: string; lastName?: string; phone?: string; profileImageUrl?: string }): Promise<any> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${userId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(userData),
    });
    if (!response.ok) {
      throw new Error('Failed to update user profile');
    }
    return await response.json();
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
}

export async function changePassword(token: string, currentPassword: string, newPassword: string): Promise<{ message: string }> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/change-password`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    if (!response.ok) {
      throw new Error('Failed to change password');
    }
    return await response.json();
  } catch (error) {
    console.error('Error changing password:', error);
    throw error;
  }
}

// Business Settings Management
export async function fetchBusinessSettings(token: string): Promise<BusinessSettings> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/settings/business`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error('Failed to fetch business settings');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching business settings:', error);
    // Return default settings
    return {
      pickupLocation: '',
      businessHours: {
        monday: { open: '08:00', close: '17:00', closed: false },
        tuesday: { open: '08:00', close: '17:00', closed: false },
        wednesday: { open: '08:00', close: '17:00', closed: false },
        thursday: { open: '08:00', close: '17:00', closed: false },
        friday: { open: '08:00', close: '17:00', closed: false },
        saturday: { open: '08:00', close: '17:00', closed: false },
        sunday: { open: '08:00', close: '17:00', closed: true },
      },
      processingTime: 24,
      currency: 'RWF',
    };
  }
}

export async function updateBusinessSettings(token: string, settings: BusinessSettings): Promise<BusinessSettings> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/settings/business`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(settings),
    });
    if (!response.ok) {
      throw new Error('Failed to update business settings');
    }
    return await response.json();
  } catch (error) {
    console.error('Error updating business settings:', error);
    throw error;
  }
}

// Notification Settings Management
export async function fetchNotificationSettings(token: string): Promise<NotificationSettings> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/settings/notifications`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error('Failed to fetch notification settings');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching notification settings:', error);
    // Return default settings
    return {
      emailNotifications: true,
      smsNotifications: true,
      orderConfirmations: true,
      paymentReminders: true,
      lowStockAlerts: true,
      deliveryUpdates: true,
    };
  }
}

export async function updateNotificationSettings(token: string, settings: NotificationSettings): Promise<NotificationSettings> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/settings/notifications`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(settings),
    });
    if (!response.ok) {
      throw new Error('Failed to update notification settings');
    }
    return await response.json();
  } catch (error) {
    console.error('Error updating notification settings:', error);
    throw error;
  }
}

// Payment Methods Management
export async function fetchPaymentMethods(token: string): Promise<PaymentMethod[]> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/settings/payments`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error('Failed to fetch payment methods');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching payment methods:', error);
    // Return default payment methods
    return [
      {
        id: '1',
        type: 'mtn',
        name: 'MTN Mobile Money',
        accountNumber: '',
        accountName: '',
        isActive: true,
      },
      {
        id: '2',
        type: 'airtel',
        name: 'Airtel Money',
        accountNumber: '',
        accountName: '',
        isActive: true,
      },
    ];
  }
}

export async function updatePaymentMethods(token: string, methods: PaymentMethod[]): Promise<PaymentMethod[]> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/settings/payments`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(methods),
    });
    if (!response.ok) {
      throw new Error('Failed to update payment methods');
    }
    return await response.json();
  } catch (error) {
    console.error('Error updating payment methods:', error);
    throw error;
  }
}

// System Preferences Management
export async function fetchSystemPreferences(token: string): Promise<SystemPreferences> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/settings/system`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error('Failed to fetch system preferences');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching system preferences:', error);
    // Return default preferences
    return {
      defaultOrderStatus: 'pending',
      autoApproveOrders: false,
      lowStockThreshold: 10,
      dataRetentionPeriod: 365,
    };
  }
}

export async function updateSystemPreferences(token: string, preferences: SystemPreferences): Promise<SystemPreferences> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/settings/system`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(preferences),
    });
    if (!response.ok) {
      throw new Error('Failed to update system preferences');
    }
    return await response.json();
  } catch (error) {
    console.error('Error updating system preferences:', error);
    throw error;
  }
}

// Data Export and System Reset
export async function exportData(token: string, dataType: 'all' | 'orders' | 'products' | 'customers'): Promise<Blob> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/settings/export?type=${dataType}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error('Failed to export data');
    }
    return await response.blob();
  } catch (error) {
    console.error('Error exporting data:', error);
    throw error;
  }
}

export async function resetSystem(token: string, confirmReset: boolean): Promise<{ message: string }> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/settings/reset`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ confirmReset }),
    });
    if (!response.ok) {
      throw new Error('Failed to reset system');
    }
    return await response.json();
  } catch (error) {
    console.error('Error resetting system:', error);
    throw error;
  }
}
