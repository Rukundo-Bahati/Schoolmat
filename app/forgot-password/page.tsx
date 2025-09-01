"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Mail, CheckCircle } from "lucide-react"

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email.trim()) {
      setError("Email is required")
      return
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address")
      return
    }

    setError("")
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      setIsSuccess(true)
    }, 2000)
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-md mx-auto px-4 py-6">
          <Card className="bg-white shadow-lg">
            <CardContent className="p-8">
              <div className="text-center">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-6" />
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Check Your Email</h1>
                <p className="text-gray-600 mb-6">
                  We've sent a password reset link to <strong>{email}</strong>
                </p>
                <p className="text-sm text-gray-500 mb-8">
                  If you don't see the email in your inbox, please check your spam folder.
                </p>
                <div className="space-y-4">
                  <Button
                    onClick={() => router.push("/login")}
                    className="w-full rounded-full bg-blue-700 hover:bg-blue-800 py-3"
                  >
                    Back to Login
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setIsSuccess(false)}
                    className="w-full rounded-full"
                  >
                    Try Different Email
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Forgot Password Form */}
      <div className="max-w-md mx-auto px-4 py-6">
        <Button variant="ghost" onClick={() => router.back()} className="mb-6 rounded-full">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <Card className="bg-white shadow-lg">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <Mail className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Forgot Password?</h1>
              <p className="text-gray-600">
                No worries! Enter your email address and we'll send you a link to reset your password.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    if (error) setError("")
                  }}
                  className={`rounded-full ${error ? "border-red-500" : ""}`}
                  placeholder="Enter your email address"
                />
                {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-full bg-blue-700 hover:bg-blue-800 py-3"
              >
                {isLoading ? "Sending..." : "Send Reset Link"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Remember your password?{" "}
                <Button variant="link" onClick={() => router.push("/login")} className="p-0 text-blue-700">
                  Login here
                </Button>
              </p>
            </div>

            {/* Demo Info */}
            <div className="mt-8 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-medium text-blue-900 mb-2">Demo</h3>
              <p className="text-sm text-blue-700">
                Use any email format to test the reset flow
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
