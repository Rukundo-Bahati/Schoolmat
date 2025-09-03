 // School information data - this simulates data from the 'schoolinfo' database table
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
  createdAt: string
  updatedAt: string
}
// Mock data that represents what would be stored in the 'schoolinfo' database table
export const schoolInfoData: SchoolInfo = {
  id: 'school-001',
  name: 'SchoolMart Academy',
  email: 'support@schoolmart.rw',
  phone: '+250788123456',
  location: 'Kigali, Rwanda',
  address: 'KG 123 Street, Kigali, Rwanda',
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z'
}

// Database table structure for 'schoolinfo' table:
/*
CREATE TABLE schoolinfo (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  location VARCHAR(255),
  address TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert sample data
INSERT INTO schoolinfo (id, name, email, phone, location, address) VALUES
('school-001', 'SchoolMart Academy', 'support@schoolmart.rw', '+250788123456', 'Kigali, Rwanda', 'KG 123 Street, Kigali, Rwanda');
*/

export async function getSchoolInfo(): Promise<SchoolInfo> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl) {
      console.warn('NEXT_PUBLIC_API_URL not set, using mock data');
      return schoolInfoData;
    }

    const response = await fetch(`${apiUrl}/school-info`);
    if (!response.ok) {
      const errorText = await response.text();
      console.warn('School info API returned error:', response.status, errorText);
      throw new Error(`Failed to fetch school information: ${response.status}`);
    }

    const schoolInfo = await response.json();
    console.log('Fetched school info from backend:', schoolInfo);

    // Map backend response to frontend format
    return {
      id: schoolInfo.id,
      name: schoolInfo.name,
      email: schoolInfo.email,
      phone: schoolInfo.phone,
      airtelNumber: schoolInfo.airtelNumber,
      mtnNumber: schoolInfo.mtnNumber,
      momoCode: schoolInfo.momoCode,
      location: schoolInfo.location,
      address: schoolInfo.address,
      createdAt: schoolInfo.createdAt,
      updatedAt: schoolInfo.updatedAt,
    };
  } catch (error) {
    console.error('Error fetching school info from backend:', error);
    console.log('Falling back to mock data');
    // Fallback to mock data if backend is unavailable
    return schoolInfoData;
  }
}
