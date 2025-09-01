"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
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

import { checkoutCartItems, paymentMethods, type CartItem } from "@/mock-data"

interface CheckoutForm {
  parentFirstName: string
  parentLastName: string
  studentName: string
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

export default function CheckoutPage() {
  const router = useRouter()

  // Mock cart data - in real app this would come from state management/API
  const cartItems = checkoutCartItems

  const [formData, setFormData] = useState<CheckoutForm>({
    parentFirstName: "",
    parentLastName: "",
    studentName: "",
    phoneNumber: "",
    emailAddress: "",
    paymentMethod: "",
  })

  const [isProcessing, setIsProcessing] = useState(false)



  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => {
      return total + Number.parseInt(item.price.replace(",", "")) * item.quantity
    }, 0)
  }

  const subtotal = calculateSubtotal()
  const tax = Math.round(subtotal * 0.18)
  const total = subtotal + tax
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  const handleInputChange = (field: keyof CheckoutForm, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)

    // Simulate processing
    setTimeout(() => {
      console.log("[v0] Order submitted:", formData)
      alert("Order placed successfully! You will receive a confirmation email shortly.")
      setIsProcessing(false)
      router.push("/")
    }, 2000)
  }

  const renderPaymentFields = () => {
    switch (formData.paymentMethod) {
      case "mtn":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">MTN Mobile Money Number</label>
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
          </div>
        )

      case "airtel":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Airtel Money Number</label>
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
          </div>
        )

      case "irembo":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Irembo Pay Account</label>
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <div className="flex items-center">
                <span className="text-2xl font-bold">
                  <span className="text-blue-700">School</span>
                  <span className="text-gray-900">Mart</span>
                </span>
              </div>
              <div className="hidden md:flex items-center space-x-6">
                <a href="/" className="text-gray-700 hover:text-blue-700 font-medium">
                  Home
                </a>
                <a href="#" className="text-gray-700 hover:text-blue-700 font-medium">
                  Products
                </a>
                <a href="#" className="text-gray-700 hover:text-blue-700 font-medium">
                  Categories
                </a>
                <a href="#" className="text-gray-700 hover:text-blue-700 font-medium">
                  About
                </a>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-2">
                <Input placeholder="Search products..." className="w-64 rounded-full" />
                <Button size="sm" className="rounded-full bg-blue-700 hover:bg-blue-800">
                  <Search className="h-4 w-4" />
                </Button>
              </div>

              <Button variant="ghost" size="sm" className="relative rounded-full" onClick={() => router.push("/cart")}>
                <ShoppingCart className="h-5 w-5" />
                <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-yellow-500 text-xs">
                  {totalItems}
                </Badge>
              </Button>

              <Button variant="ghost" size="sm" className="rounded-full">
                <User className="h-5 w-5" />
              </Button>

              <Button className="rounded-full bg-blue-700 hover:bg-blue-800">Login</Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Checkout Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Button variant="ghost" onClick={() => router.back()} className="mb-6 rounded-full">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Cart
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form - Left Side */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-gray-900">Checkout</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Parent Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Parent Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Parent First Name *</label>
                        <Input
                          type="text"
                          placeholder="John"
                          value={formData.parentFirstName}
                          onChange={(e) => handleInputChange("parentFirstName", e.target.value)}
                          className="rounded-full"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Parent Last Name *</label>
                        <Input
                          type="text"
                          placeholder="Doe"
                          value={formData.parentLastName}
                          onChange={(e) => handleInputChange("parentLastName", e.target.value)}
                          className="rounded-full"
                          required
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
                      />
                    </div>
                  </div>

                  {/* Student Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Student Information</h3>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Student Name *</label>
                      <Input
                        type="text"
                        placeholder="Jane Doe"
                        value={formData.studentName}
                        onChange={(e) => handleInputChange("studentName", e.target.value)}
                        className="rounded-full"
                        required
                      />
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Payment Method</h3>
                    <div className="space-y-3">
                      {paymentMethods.map((method) => (
                        <label
                          key={method.value}
                          className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                            formData.paymentMethod === method.value
                              ? "border-blue-500 bg-blue-50"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <input
                            type="radio"
                            name="paymentMethod"
                            value={method.value}
                            checked={formData.paymentMethod === method.value}
                            onChange={(e) => handleInputChange("paymentMethod", e.target.value)}
                            className="sr-only"
                          />
                          <div className="flex items-center space-x-3">
                            {method.icon}
                            <span className="font-medium">{method.label}</span>
                          </div>
                        </label>
                      ))}
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
                    className="w-full rounded-full bg-blue-700 hover:bg-blue-800 py-3"
                  >
                    {isProcessing ? "Processing Order..." : `Place Order - RWF ${total.toLocaleString()}`}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary - Right Side */}
          <div className="space-y-6">
            <Card className="bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-gray-900">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Order Items */}
                <div className="space-y-3">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-sm text-gray-900">{item.name}</h4>
                        <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-sm text-blue-700">
                          RWF {(Number.parseInt(item.price.replace(",", "")) * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Items ({totalItems}):</span>
                    <span className="font-medium">RWF {subtotal.toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">VAT (18%):</span>
                    <span className="font-medium">RWF {tax.toLocaleString()}</span>
                  </div>

                  <div className="border-t pt-3">
                    <div className="flex justify-between text-lg font-bold">
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

      {/* Footer */}
      <footer className="bg-white py-12 border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <span className="text-2xl font-bold">
                  <span className="text-blue-700">School</span>
                  <span className="text-gray-900">Mart</span>
                </span>
              </div>
              <p className="text-gray-600 mb-4">Your trusted partner for all school supply needs in Rwanda.</p>
              <div className="flex space-x-4">
                <Button variant="ghost" size="sm" className="rounded-full p-2">
                  <Facebook className="h-5 w-5 text-blue-600" />
                </Button>
                <Button variant="ghost" size="sm" className="rounded-full p-2">
                  <Twitter className="h-5 w-5 text-blue-400" />
                </Button>
                <Button variant="ghost" size="sm" className="rounded-full p-2">
                  <Instagram className="h-5 w-5 text-pink-600" />
                </Button>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-4">About Us</h3>
              <ul className="space-y-2 text-gray-600">
                <li>
                  <a href="#" className="hover:text-blue-700">
                    Our Story
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-700">
                    Mission
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-700">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-700">
                    Press
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Support</h3>
              <ul className="space-y-2 text-gray-600">
                <li>
                  <a href="#" className="hover:text-blue-700">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-700">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-700">
                    Pickup Info
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-700">
                    Returns
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Payment Methods</h3>
              <div className="space-y-2 text-gray-600">
                <p>Mobile Money</p>
                <p>Irembopay</p>
                <p>USSD Payment</p>
                <p>Bank Transfer</p>
              </div>
            </div>
          </div>

          <div className="border-t mt-8 pt-8 text-center text-gray-600">
            <p>&copy; 2024 SchoolMart. All rights reserved. | Privacy Policy | Terms of Service</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
