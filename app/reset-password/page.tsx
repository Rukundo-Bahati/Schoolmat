"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Eye, EyeOff, ArrowLeft, Check, X, CheckCircle, AlertCircle } from "lucide-react"

interface PasswordStrength {
  score: number
  feedback: string[]
  color: string
}

export default function ResetPasswordPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token")

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [isTokenValid, setIsTokenValid] = useState<boolean | null>(null)

  useEffect(() => {
    // Simulate token validation
    if (token) {
      setTimeout(() => {
        setIsTokenValid(true)
      }, 1000)
    } else {
      setIsTokenValid(false)
    }
  }, [token])

  const validatePassword = (password: string): PasswordStrength => {
    const checks = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    }

    const score = Object.values(checks).filter(Boolean).length
    const feedback = []

    if (!checks.length) feedback.push("At least 8 characters")
    if (!checks.uppercase) feedback.push("One uppercase letter")
    if (!checks.lowercase) feedback.push("One lowercase letter")
    if (!checks.number) feedback.push("One number")
    if (!checks.special) feedback.push("One special character")

    let color = "bg-red-500"
    if (score >= 4) color = "bg-green-500"
    else if (score >= 3) color = "bg-yellow-500"
    else if (score >= 2) color = "bg-orange-500"

    return { score, feedback, color }
  }

  const passwordStrength = validatePassword(formData.password)

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (passwordStrength.score < 4) {
      newErrors.password = "Password must meet all strength requirements"
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password"
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
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
      setIsSuccess(true)
    }, 2000)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  if (isTokenValid === null) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="bg-white shadow-lg">
          <CardContent className="p-8 text-center">
            <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">Validating reset link...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!isTokenValid) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-md mx-auto px-4 py-6">
          <Card className="bg-white shadow-lg">
            <CardContent className="p-8">
              <div className="text-center">
                <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-6" />
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Invalid Reset Link</h1>
                <p className="text-gray-600 mb-6">
                  This password reset link is invalid or has expired. Please request a new one.
                </p>
                <div className="space-y-4">
                  <Button
                    onClick={() => router.push("/forgot-password")}
                    className="w-full rounded-full bg-blue-700 hover:bg-blue-800 py-3"
                  >
                    Request New Reset Link
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => router.push("/login")}
                    className="w-full rounded-full"
                  >
                    Back to Login
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-md mx-auto px-4 py-6">
          <Card className="bg-white shadow-lg">
            <CardContent className="p-8">
              <div className="text-center">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-6" />
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Password Reset Successful!</h1>
                <p className="text-gray-600 mb-6">
                  Your password has been successfully updated. You can now log in with your new password.
                </p>
                <Button
                  onClick={() => router.push("/login")}
                  className="w-full rounded-full bg-blue-700 hover:bg-blue-800 py-3"
                >
                  Login with New Password
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Reset Password Form */}
      <div className="max-w-md mx-auto px-4 py-6">
        <Button variant="ghost" onClick={() => router.back()} className="mb-6 rounded-full">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <Card className="bg-white shadow-lg">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Reset Your Password</h1>
              <p className="text-gray-600">
                Enter your new password below. Make sure it's strong and secure.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* New Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    className={`rounded-full pr-12 ${errors.password ? "border-red-500" : ""}`}
                    placeholder="Enter your new password"
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

                {/* Password Strength Indicator */}
                {formData.password && (
                  <div className="mt-3 space-y-2">
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                          style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs font-medium">
                        {passwordStrength.score < 2 ? "Weak" : passwordStrength.score < 4 ? "Medium" : "Strong"}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {[
                        "At least 8 characters",
                        "One uppercase letter",
                        "One lowercase letter",
                        "One number",
                        "One special character",
                      ].map((requirement, index) => {
                        const isValid = passwordStrength.feedback.indexOf(requirement) === -1
                        return (
                          <div
                            key={index}
                            className={`flex items-center space-x-1 ${isValid ? "text-green-600" : "text-gray-500"}`}
                          >
                            {isValid ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                            <span>{requirement}</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}

                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                <div className="relative">
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                    className={`rounded-full pr-12 ${errors.confirmPassword ? "border-red-500" : ""}`}
                    placeholder="Confirm your new password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-full p-2"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-full bg-blue-700 hover:bg-blue-800 py-3"
              >
                {isLoading ? "Resetting Password..." : "Reset Password"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
