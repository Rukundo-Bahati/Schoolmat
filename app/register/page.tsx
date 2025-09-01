"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Eye, EyeOff, Check, X, ArrowLeft, Facebook, Twitter, Instagram } from "lucide-react"

interface PasswordStrength {
  score: number
  feedback: string[]
  color: string
}

export default function RegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    parentName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)

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

    if (!formData.parentName.trim()) {
      newErrors.parentName = "Parent name is required"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required"
    } else if (!/^(\+250|0)[0-9]{9}$/.test(formData.phoneNumber.replace(/\s/g, ""))) {
      newErrors.phoneNumber = "Please enter a valid Rwandan phone number"
    }

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
      // Navigate to email verification
      router.push(`/verify-email?email=${encodeURIComponent(formData.email)}`)
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


      {/* Registration Form */}
      <div className="max-w-md mx-auto px-4 py-3">
        <Button variant="ghost" onClick={() => router.back()} className="mb-6 rounded-full">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <Card className="bg-white shadow-lg">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
              <p className="text-gray-600">Join SchoolMart to manage your child's school supplies</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Parent Name */}
              <div>

                <Input
                  type="text"
                  value={formData.parentName}
                  onChange={(e) => handleInputChange("parentName", e.target.value)}
                  className={`rounded-full ${errors.parentName ? "border-red-500" : ""}`}
                  placeholder="Enter your full name"
                />
                {errors.parentName && <p className="text-red-500 text-sm mt-1">{errors.parentName}</p>}
              </div>

              {/* Email */}
              <div>

                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className={`rounded-full ${errors.email ? "border-red-500" : ""}`}
                  placeholder="Enter your email address"
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>

              {/* Phone Number */}
              <div>

                <Input
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                  className={`rounded-full ${errors.phoneNumber ? "border-red-500" : ""}`}
                  placeholder="+250 788 123 456"
                />
                {errors.phoneNumber && <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>}
              </div>

              {/* Password */}
              <div>

                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    className={`rounded-full pr-12 ${errors.password ? "border-red-500" : ""}`}
                    placeholder="Create a strong password"
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
   
                <div className="relative">
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                    className={`rounded-full pr-12 ${errors.confirmPassword ? "border-red-500" : ""}`}
                    placeholder="Confirm your password"
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
                {isLoading ? "Creating Account..." : "Create Account"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <Button variant="link" onClick={() => router.push("/login")} className="p-0 text-blue-700">
                  Login here
                </Button>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

     
    </div>
  )
}
