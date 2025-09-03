"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Eye, EyeOff, ArrowLeft, Facebook, Twitter, Instagram } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { login, setReturnUrl } = useAuth()
  
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

  useEffect(() => {
    const returnUrl = searchParams.get('returnUrl')
    if (returnUrl) {
      setReturnUrl(decodeURIComponent(returnUrl))
    }
  }, [searchParams, setReturnUrl])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)
    setErrors({})

    try {
      await login(formData.emailOrPhone, formData.password)
      // Navigation is now handled by the auth context
    } catch (error: any) {
      setErrors({ general: error.message || "Login failed" })
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-sm sm:max-w-md mx-auto">
        <Button variant="ghost" onClick={() => router.back()} className="mb-4 sm:mb-6 rounded-full">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <Card className="bg-white shadow-lg">
          <CardContent className="p-6 sm:p-8">
            <div className="text-center mb-6 sm:mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
              <p className="text-sm sm:text-base text-gray-600">Login to manage your child's school supplies</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {errors.general && <p className="text-red-500 text-sm text-center">{errors.general}</p>}

              {/* Email or Phone */}
              <div>
                <Input
                  type="text"
                  value={formData.emailOrPhone}
                  onChange={(e) => handleInputChange("emailOrPhone", e.target.value)}
                  className={`rounded-full py-3 px-4 text-base ${errors.emailOrPhone ? "border-red-500" : ""}`}
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
                    className={`rounded-full py-3 px-4 pr-12 text-base ${errors.password ? "border-red-500" : ""}`}
                    placeholder="Enter your password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 rounded-full p-2"
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
            
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
