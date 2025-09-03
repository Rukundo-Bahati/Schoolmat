import { Smartphone, CreditCard, Building, Banknote } from 'lucide-react'

export const paymentMethods = [
  {
    value: 'mtn',
    label: 'MTN Mobile Money',
    icon: <Smartphone className="h-5 w-5" />,
  },
  {
    value: 'airtel',
    label: 'Airtel Money',
    icon: <Smartphone className="h-5 w-5" />,
  },
  {
    value: 'irembo',
    label: 'Irembo Pay',
    icon: <Building className="h-5 w-5" />,
  },
  {
    value: 'ussd',
    label: 'USSD Payment',
    icon: <Banknote className="h-5 w-5" />,
  },
  {
    value: 'visa',
    label: 'Visa Card',
    icon: <CreditCard className="h-5 w-5" />,
  },
]

export interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image?: string
  category?: string
  description?: string
}

export interface Product {
  id: string
  name: string
  price: number
  image: string
  category: string
  description: string
  stock: number
  schoolId: string
}

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Mathematics Textbook',
    price: 15000,
    image: '/placeholder.jpg',
    category: 'Books',
    description: 'Comprehensive mathematics textbook for S1 students',
    stock: 50,
    schoolId: '1',
  },
  {
    id: '2',
    name: 'Science Kit',
    price: 25000,
    image: '/placeholder.jpg',
    category: 'Science',
    description: 'Complete science laboratory kit',
    stock: 25,
    schoolId: '1',
  },
  {
    id: '3',
    name: 'School Uniform',
    price: 20000,
    image: '/placeholder.jpg',
    category: 'Uniforms',
    description: 'Official school uniform',
    stock: 100,
    schoolId: '1',
  },
]

export const mockCartItems: CartItem[] = [
  {
    id: '1',
    name: 'Mathematics Textbook',
    price: 15000,
    quantity: 2,
    image: '/placeholder.jpg',
    category: 'Books',
  },
  {
    id: '2',
    name: 'Science Kit',
    price: 25000,
    quantity: 1,
    image: '/placeholder.jpg',
    category: 'Science',
  },
]