"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import party from "party-js"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Search,
  ShoppingCart,
  User,
  ArrowLeft,
  Facebook,
  Twitter,
  Instagram,
  CreditCard,
  Smartphone,
  Globe,
} from "lucide-react"

import { paymentMethods, type CartItem } from "@/mock-data"
import { useAuth } from "@/lib/auth-context"
import { fetchCartItems, fetchUserProfile, fetchSchoolInfo, submitOrder, sendOrderNotifications, clearCart, type CartItem as ApiCartItem, type UserProfile, type SchoolInfo } from "@/lib/api"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

interface CheckoutForm {
  parentFirstName: string
  parentLastName: string
  studentName: string
  studentClass: string
  phoneNumber: string
  emailAddress: string
  paymentMethod: string
  // Payment method specific fields
  mtnNumber?: string
  airtelNumber?: string
  iremboAccount?: string
  ussdCode?: string
  cardNumber?: string
  cardExpiry?: string
  cardCvv?: string
  cardName?: string
}

interface StudentClassDropdownProps {
  value: string
  onChange: (value: string) => void
}

function StudentClassDropdown({ value, onChange }: StudentClassDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [showTVETSubmenu, setShowTVETSubmenu] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const regularClasses = [
    { value: 'S1', label: 'S1' },
    { value: 'S2', label: 'S2' },
    { value: 'S3', label: 'S3' },
    { value: 'S4', label: 'S4' },
    { value: 'S5', label: 'S5' },
    { value: 'S6', label: 'S6' },
  ]

  const tvetPrograms = [
    { value: 'TVET-Tailoring', label: 'Tailoring' },
    { value: 'TVET-Tourism', label: 'Tourism' },
    { value: 'TVET-FoodProcessing', label: 'Food Processing' },
    { value: 'TVET-Carpentry', label: 'Carpentry' },
    { value: 'TVET-Electrical', label: 'Electrical' },
    { value: 'TVET-Plumbing', label: 'Plumbing' },
    { value: 'TVET-Welding', label: 'Welding' },
    { value: 'TVET-Masonry', label: 'Masonry' },
  ]

  const getDisplayLabel = (val: string) => {
    if (!val) return 'Select class'
    const regularClass = regularClasses.find(c => c.value === val)
    if (regularClass) return regularClass.label
    const tvetProgram = tvetPrograms.find(p => p.value === val)
    if (tvetProgram) return `TVET - ${tvetProgram.label}`
    return val
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setShowTVETSubmenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-2 text-left border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white flex items-center justify-between"
      >
        <span className={value ? 'text-gray-900' : 'text-gray-500'}>
          {getDisplayLabel(value)}
        </span>
        <svg
          className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
          <div className="py-1">
            {regularClasses.map((classItem) => (
              <button
                key={classItem.value}
                type="button"
                onClick={() => {
                  onChange(classItem.value)
                  setIsOpen(false)
                  setShowTVETSubmenu(false)
                }}
                className="w-full px-3 py-2 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
              >
                {classItem.label}
              </button>
            ))}

            <div
              className="relative"
              onMouseEnter={() => setShowTVETSubmenu(true)}
              onMouseLeave={() => setShowTVETSubmenu(false)}
            >
              <button
                type="button"
                className="w-full px-3 py-2 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none flex items-center justify-between"
              >
                <span>TVET Programs</span>
                <svg
                  className="w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              {showTVETSubmenu && (
                <div className="absolute left-full top-0 ml-1 w-48 bg-white border border-gray-300 rounded-lg shadow-lg">
                  <div className="py-1">
                    {tvetPrograms.map((program) => (
                      <button
                        key={program.value}
                        type="button"
                        onClick={() => {
                          onChange(program.value)
                          setIsOpen(false)
                          setShowTVETSubmenu(false)
                        }}
                        className="w-full px-3 py-2 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                      >
                        {program.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function CheckoutPage() {
  const router = useRouter()
  const { token, isLoading: authLoading } = useAuth()
  const [cartItems, setCartItems] = useState<ApiCartItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isEditingParentInfo, setIsEditingParentInfo] = useState(false)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [schoolInfo, setSchoolInfo] = useState<SchoolInfo | null>(null)

  const [formData, setFormData] = useState<CheckoutForm>({
    parentFirstName: "",
    parentLastName: "",
    studentName: "",
    studentClass: "",
    phoneNumber: "",
    emailAddress: "",
    paymentMethod: "",
    mtnNumber: "",
    airtelNumber: "",
    iremboAccount: "",
    ussdCode: "",
    cardNumber: "",
    cardExpiry: "",
    cardCvv: "",
    cardName: "",
  })

  const [isProcessing, setIsProcessing] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [orderId, setOrderId] = useState<string>("")

  useEffect(() => {
    const loadData = async () => {
      if (!token && !authLoading) {
        router.push('/login')
        return
      }

      if (!token) {
        return
      }

      try {
        setLoading(true)

        // Load cart items, user profile, and school info in parallel
        const [items, profile, school] = await Promise.all([
          fetchCartItems(token),
          fetchUserProfile(token),
          fetchSchoolInfo()
        ])

        setCartItems(items)
        setUserProfile(profile)
        setSchoolInfo(school)

        // Populate form with user profile data
        setFormData(prev => ({
          ...prev,
          parentFirstName: profile.firstName || "",
          parentLastName: profile.lastName || "",
          emailAddress: profile.email || "",
          phoneNumber: profile.phone || "",
        }))

      } catch (err) {
        setError('Failed to load data')
        console.error('Error fetching data:', err)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [token, authLoading, router])

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => {
      return total + item.price * item.quantity
    }, 0)
  }

  const subtotal = calculateSubtotal()
  // Remove VAT calculation as per request
  const total = subtotal

  const handleInputChange = (field: keyof CheckoutForm, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!token || !userProfile || !schoolInfo) {
      alert("Unable to process order. Please try again.")
      return
    }

    setIsProcessing(true)

    try {
      // Prepare order data
      const orderData = {
        parentInfo: {
          firstName: formData.parentFirstName,
          lastName: formData.parentLastName,
          email: formData.emailAddress,
          phone: formData.phoneNumber,
        },
        studentInfo: {
          name: formData.studentName,
          class: formData.studentClass,
        },
        cartItems: cartItems,
        totalAmount: total,
        paymentMethod: formData.paymentMethod,
        schoolInfo: schoolInfo,
      }

      // Submit the order
      const orderResult = await submitOrder(token, orderData)

      if (orderResult.success) {
        // Fire party.js confetti celebration
        party.confetti(document.body, {
          count: 100,
          size: 1.5,
          speed: 500,
          spread: 70
        })

        // Send notifications (SMS and email) - optional
        try {
          console.log("Attempting to send order notifications...")
          await sendOrderNotifications(token, orderData)
          console.log("Notifications sent successfully")
        } catch (notificationError: unknown) {
          if (notificationError instanceof Error) {
            console.warn("Notifications not sent (endpoint may not exist):", notificationError.message)
          } else {
            console.warn("Notifications not sent (endpoint may not exist):", notificationError)
          }
          // Don't fail the order if notifications fail - this is optional
        }

        // Clear the cart
        try {
          await clearCart(token)
          console.log("Cart cleared successfully")
        } catch (cartError) {
          console.error("Failed to clear cart:", cartError)
          // Don't fail the order if cart clearing fails
        }

        // Show success modal
        setOrderId(orderResult.orderId)
        setShowSuccessModal(true)
      } else {
        throw new Error("Order submission failed")
      }

    } catch (error) {
      console.error("Order submission error:", error)
      alert("Failed to place order. Please try again.")
    } finally {
      setIsProcessing(false)
    }
  }

  const renderPaymentFields = () => {
    switch (formData.paymentMethod) {
      case "mtn":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">MTN Mobile Money Number</label>
              <Input
                type="tel"
                placeholder="078XXXXXXX"
                value={formData.mtnNumber || ""}
                onChange={(e) => handleInputChange("mtnNumber", e.target.value)}
                className="rounded-full"
                required
              />
              <p className="text-xs text-gray-600 mt-1">You will receive a payment prompt on your phone</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h4 className="font-medium text-gray-900 mb-2">Payment Instructions</h4>
              <div className="space-y-2 text-sm text-gray-700">
                <p>
                  <strong>Dial:</strong> <code className="bg-blue-100 px-2 py-1 rounded text-blue-800 font-mono">
                    *182*8*1*{schoolInfo?.momoCode || '123435'}*{total.toFixed(0)}#
                  </code>
                </p>
                <p>Follow the instructions on your phone to complete the payment.</p>
                <p className="text-xs text-gray-600 mt-2">
                  For help, contact the school at {schoolInfo?.phone || "school phone"} or {schoolInfo?.email || "school email"}
                </p>
              </div>
            </div>
          </div>
        )

      case "airtel":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Airtel Money Number</label>
              <Input
                type="tel"
                placeholder="073XXXXXXX"
                value={formData.airtelNumber || ""}
                onChange={(e) => handleInputChange("airtelNumber", e.target.value)}
                className="rounded-full"
                required
              />
              <p className="text-xs text-gray-600 mt-1">You will receive a payment prompt on your phone</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <h4 className="font-medium text-gray-900 mb-2">Payment Instructions</h4>
              <div className="space-y-2 text-sm text-gray-700">
                <p>
                  <strong>Dial:</strong> <code className="bg-green-100 px-2 py-1 rounded text-green-800 font-mono">
                    *182*1*2*{schoolInfo?.phone?.replace(/[^0-9]/g, '') || 'schoolnumber'}*{total.toFixed(0)}#
                  </code>
                </p>
                <p>Follow the instructions on your phone to complete the payment.</p>
                <p className="text-xs text-gray-600 mt-2">
                  For help, contact the school at {schoolInfo?.phone || "school phone"} or {schoolInfo?.email || "school email"}
                </p>
              </div>
            </div>
          </div>
        )

      case "irembo":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Irembo Pay Account</label>
              <Input
                type="email"
                placeholder="your.email@example.com"
                value={formData.iremboAccount || ""}
                onChange={(e) => handleInputChange("iremboAccount", e.target.value)}
                className="rounded-full"
                required
              />
              <p className="text-xs text-gray-600 mt-1">You will be redirected to Irembo Pay to complete payment</p>
            </div>
          </div>
        )

      case "ussd":
        return (
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">USSD Payment Instructions</h4>
              <div className="space-y-2 text-sm text-gray-700">
                <p>
                  <strong>MTN:</strong> Dial *182*7*1# and follow prompts
                </p>
                <p>
                  <strong>Airtel:</strong> Dial *500# and follow prompts
                </p>
                <p>
                  <strong>Tigo:</strong> Dial *505# and follow prompts
                </p>
              </div>
              <p className="text-xs text-gray-600 mt-3">
                Reference Code: <strong>SM{Date.now().toString().slice(-6)}</strong>
              </p>
            </div>
          </div>
        )

      case "visa":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Cardholder Name</label>
              <Input
                type="text"
                placeholder="John Doe"
                value={formData.cardName || ""}
                onChange={(e) => handleInputChange("cardName", e.target.value)}
                className="rounded-full"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Card Number</label>
              <Input
                type="text"
                placeholder="1234 5678 9012 3456"
                value={formData.cardNumber || ""}
                onChange={(e) => handleInputChange("cardNumber", e.target.value)}
                className="rounded-full"
                maxLength={19}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date</label>
                <Input
                  type="text"
                  placeholder="MM/YY"
                  value={formData.cardExpiry || ""}
                  onChange={(e) => handleInputChange("cardExpiry", e.target.value)}
                  className="rounded-full"
                  maxLength={5}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">CVV</label>
                <Input
                  type="text"
                  placeholder="123"
                  value={formData.cardCvv || ""}
                  onChange={(e) => handleInputChange("cardCvv", e.target.value)}
                  className="rounded-full"
                  maxLength={4}
                  required
                />
              </div>
            </div>
            <p className="text-xs text-gray-600">Your card information is encrypted and secure</p>
          </div>
        )

      default:
        return null
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Verifying authentication...</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your cart...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={() => router.push('/cart')} className="rounded-full">
            Back to Cart
          </Button>
        </div>
      </div>
    )
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ShoppingCart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Add some items to your cart before checking out.</p>
          <Button onClick={() => router.push('/products')} className="rounded-full">
            Continue Shopping
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Checkout Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Back Button */}
        <Button variant="ghost" onClick={() => router.back()} className="mb-4 sm:mb-6 rounded-full text-sm sm:text-base">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Cart
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8">
          {/* Checkout Form - Left Side */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl sm:text-2xl font-bold text-gray-900">Checkout</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Parent Information */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900">Parent Information</h3>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setIsEditingParentInfo(!isEditingParentInfo)}
                        className="rounded-full"
                      >
                        {isEditingParentInfo ? 'Cancel Edit' : 'Edit Info'}
                      </Button>
                    </div>

                    {userProfile && !isEditingParentInfo && (
                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <div className="flex items-center space-x-2 text-blue-800 mb-2">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                          </svg>
                          <span className="font-medium">Information loaded from your profile</span>
                        </div>
                        <p className="text-sm text-blue-700">
                          Your details have been automatically filled. Click "Edit Info" if you need to make changes.
                        </p>
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Parent First Name *</label>
                        <Input
                          type="text"
                          placeholder="John"
                          value={formData.parentFirstName}
                          onChange={(e) => handleInputChange("parentFirstName", e.target.value)}
                          className="rounded-full"
                          required
                          readOnly={!isEditingParentInfo}
                          disabled={!isEditingParentInfo}
                        />
                      </div>
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Parent Last Name *</label>
                        <Input
                          type="text"
                          placeholder="Doe"
                          value={formData.parentLastName}
                          onChange={(e) => handleInputChange("parentLastName", e.target.value)}
                          className="rounded-full"
                          required
                          readOnly={!isEditingParentInfo}
                          disabled={!isEditingParentInfo}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                      <Input
                        type="email"
                        placeholder="john.doe@example.com"
                        value={formData.emailAddress}
                        onChange={(e) => handleInputChange("emailAddress", e.target.value)}
                        className="rounded-full"
                        required
                        readOnly={!isEditingParentInfo}
                        disabled={!isEditingParentInfo}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                      <Input
                        type="tel"
                        placeholder="+250 788 123 456"
                        value={formData.phoneNumber}
                        onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                        className="rounded-full"
                        required
                        readOnly={!isEditingParentInfo}
                        disabled={!isEditingParentInfo}
                      />
                    </div>
                  </div>

                  {/* Student Information */}
                  <div className="space-y-3 sm:space-y-4">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900">Student Information</h3>
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Student Name *</label>
                    <Input
                      type="text"
                      placeholder="Jane Doe"
                      value={formData.studentName}
                      onChange={(e) => handleInputChange("studentName", e.target.value)}
                      className="rounded-full"
                      required
                    />
                  </div>
                  <div className="relative">
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Student Class *</label>
                    <StudentClassDropdown
                      value={formData.studentClass}
                      onChange={(value) => handleInputChange("studentClass", value)}
                    />
                  </div>
                  </div>

                  {/* Payment Method */}
                  <div className="space-y-3 sm:space-y-4">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900">Payment Method</h3>
                    <div className="space-y-2 sm:space-y-3">
                      {paymentMethods.map((method) => {
                        const isDisabled = ['irembo', 'ussd', 'visa'].includes(method.value)
                        return (
                          <div key={method.value}>
                            <label
                              className={`flex items-center p-4 border rounded-lg transition-colors ${
                                isDisabled
                                  ? "border-gray-200 bg-gray-50 cursor-not-allowed opacity-60"
                                  : formData.paymentMethod === method.value
                                    ? "border-blue-500 bg-blue-50 cursor-pointer"
                                    : "border-gray-200 hover:border-gray-300 cursor-pointer"
                              }`}
                            >
                              <input
                                type="radio"
                                name="paymentMethod"
                                value={method.value}
                                checked={formData.paymentMethod === method.value}
                                onChange={(e) => !isDisabled && handleInputChange("paymentMethod", e.target.value)}
                                className="sr-only"
                                disabled={isDisabled}
                              />
                              <div className="flex items-center space-x-3">
                                {method.icon}
                                <span className={`font-medium ${isDisabled ? 'text-gray-400' : ''}`}>
                                  {method.label}
                                </span>
                                {isDisabled && (
                                  <span className="text-xs text-red-500 font-medium">(Currently Unavailable)</span>
                                )}
                              </div>
                            </label>
                            {isDisabled && (
                              <div className="mt-2 ml-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                                <p className="text-sm text-yellow-800">
                                  {method.value === 'irembo' && "Irembo Pay is currently unavailable. Please use MTN Mobile Money or Airtel Money instead."}
                                  {method.value === 'ussd' && "USSD payment is currently unavailable. Please use MTN Mobile Money or Airtel Money instead."}
                                  {method.value === 'visa' && "Visa card payment is currently unavailable. Please use MTN Mobile Money or Airtel Money instead."}
                                </p>
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>

                    {/* Payment Method Specific Fields */}
                    {formData.paymentMethod && (
                      <div className="mt-4 p-4 bg-gray-50 rounded-lg">{renderPaymentFields()}</div>
                    )}
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={isProcessing || !formData.paymentMethod}
                    className="w-full rounded-full bg-blue-700 hover:bg-blue-800 py-2 sm:py-3 text-sm sm:text-base"
                  >
                    {isProcessing ? "Processing Order..." : `Place Order - RWF ${total.toLocaleString()}`}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary - Right Side */}
          <div className="space-y-4 sm:space-y-6">
            <Card className="bg-white shadow-sm">
              <CardHeader className="pb-2 sm:pb-4">
                <CardTitle className="text-lg sm:text-xl font-bold text-gray-900">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4 pt-2 sm:pt-4">
                {/* Order Items */}
                <div className="space-y-3">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <img
                        src={item.image || "/placeholder.jpg"}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-sm text-gray-900">{item.name}</h4>
                        <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-sm text-blue-700">
                          RWF {(item.price * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-3 sm:pt-4 space-y-3">
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span className="text-gray-600">Items ({cartItems.length}):</span>
                    <span className="font-medium">RWF {subtotal.toLocaleString()}</span>
                  </div>

      

                  <div className="border-t pt-2 sm:pt-3">
                    <div className="flex justify-between text-base sm:text-lg font-bold">
                      <span>Total:</span>
                      <span className="text-blue-700">RWF {total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 space-y-2 text-xs text-gray-600">
                  <p>• Secure checkout with SSL encryption</p>
                  <p>• Free pickup at school</p>
                  <p>• Order confirmation via email</p>
                  <p>• Customer support: +250 788 123 456</p>
                </div>
              </CardContent>
            </Card>

            {/* Security Notice */}
            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium text-green-800">Secure Payment</span>
                </div>
                <p className="text-xs text-green-700 mt-1">
                  Your payment information is encrypted and protected by industry-standard security measures.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md mx-4 text-center shadow-2xl">
            <div className="mb-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">🎉 Congratulations!</h2>
              <p className="text-gray-600 mb-4">
                Your order has been placed successfully! We're excited to help you with your school supplies.
              </p>
              <div className="bg-blue-50 p-4 rounded-lg mb-6">
                <p className="text-sm text-blue-800 font-medium">Order ID: {orderId}</p>
                <p className="text-xs text-blue-600 mt-1">
                  You will receive payment instructions and confirmation via SMS and email shortly.
                </p>
              </div>
            </div>
            <Button
              onClick={() => router.push('/products')}
              className="w-full rounded-full bg-blue-700 hover:bg-blue-800 py-3 text-lg font-semibold"
            >
              Continue Shopping
            </Button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}
