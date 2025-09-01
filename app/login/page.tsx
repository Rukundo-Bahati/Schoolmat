"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Eye, EyeOff, ArrowLeft, Facebook, Twitter, Instagram } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    emailOrPhone: "",
    password: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.emailOrPhone.trim()) {
      newErrors.emailOrPhone = "Email or phone number is required"
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      // Navigate to parent dashboard
      router.push("/parent-dashboard")
    }, 2000)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}


      {/* Login Form */}
      <div className="max-w-md mx-auto px-4 py-6">
        <Button variant="ghost" onClick={() => router.back()} className="mb-6 rounded-full">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <Card className="bg-white shadow-lg">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
              <p className="text-gray-600">Login to manage your child's school supplies</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email or Phone */}
              <div>
                <Input
                  type="text"
                  value={formData.emailOrPhone}
                  onChange={(e) => handleInputChange("emailOrPhone", e.target.value)}
                  className={`rounded-full ${errors.emailOrPhone ? "border-red-500" : ""}`}
                  placeholder="Enter email or phone number"
                />
                {errors.emailOrPhone && <p className="text-red-500 text-sm mt-1">{errors.emailOrPhone}</p>}
              </div>

              {/* Password */}
              <div>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    className={`rounded-full pr-12 ${errors.password ? "border-red-500" : ""}`}
                    placeholder="Enter your password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-full p-2"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
              </div>

              {/* Forgot Password */}
              <div className="text-right">
                <Button
                  variant="link"
                  onClick={() => router.push("/forgot-password")}
                  className="p-0 text-blue-700 text-sm"
                >
                  Forgot Password?
                </Button>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-full bg-blue-700 hover:bg-blue-800 py-3"
              >
                {isLoading ? "Logging in..." : "Login"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                <Button variant="link" onClick={() => router.push("/register")} className="p-0 text-blue-700">
                  Register here
                </Button>
              </p>
            </div>

            {/* Demo Credentials */}
            <div className="mt-8 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-medium text-blue-900 mb-2">Demo Credentials</h3>
              <div className="text-sm text-blue-700 space-y-1">
                <p>
                  <strong>Email:</strong> parent@demo.com
                </p>
                <p>
                  <strong>Password:</strong> Demo123!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      
    </div>
  )
}
