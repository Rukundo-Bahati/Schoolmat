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


export async function getSchoolInfo(): Promise<SchoolInfo> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) {
    throw new Error('NEXT_PUBLIC_API_URL not configured');
  }

  const response = await fetch(`${apiUrl}/school-info`);
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to fetch school information: ${response.status}`);
  }

  const schoolInfo = await response.json();
  
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
}
