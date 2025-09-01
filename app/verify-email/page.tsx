"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Mail, ArrowLeft, Check, RefreshCw } from "lucide-react"

export default function VerifyEmailPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get("email") || ""

  const [verificationCode, setVerificationCode] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [countdown, setCountdown] = useState(60)
  const [canResend, setCanResend] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    } else {
      setCanResend(true)
    }
  }, [countdown])

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!verificationCode.trim()) {
      setError("Please enter the verification code")
      return
    }

    if (verificationCode.length !== 6) {
      setError("Verification code must be 6 digits")
      return
    }

    setIsLoading(true)
    setError("")

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      // Navigate to parent dashboard
      router.push("/parent-dashboard")
    }, 2000)
  }

  const handleResendCode = async () => {
    setIsResending(true)

    // Simulate API call
    setTimeout(() => {
      setIsResending(false)
      setCountdown(60)
      setCanResend(false)
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <span className="text-2xl font-bold">
                <span className="text-blue-700">School</span>
                <span className="text-gray-900">Mart</span>
              </span>
            </div>
          </div>
        </div>
      </nav>

      {/* Verification Form */}
      <div className="max-w-md mx-auto px-4 py-12">
        <Button variant="ghost" onClick={() => router.back()} className="mb-6 rounded-full">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <Card className="bg-white shadow-lg">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Mail className="h-8 w-8 text-blue-700" />
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-2">Verify Your Email</h1>
            <p className="text-gray-600 mb-6">
              We've sent a 6-digit verification code to
              <br />
              <span className="font-medium text-gray-900">{email}</span>
            </p>

            <form onSubmit={handleVerify} className="space-y-6">
              <div>
                <Input
                  type="text"
                  value={verificationCode}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "").slice(0, 6)
                    setVerificationCode(value)
                    setError("")
                  }}
                  className={`text-center text-2xl font-mono tracking-widest rounded-full ${error ? "border-red-500" : ""}`}
                  placeholder="000000"
                  maxLength={6}
                />
                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
              </div>

              <Button
                type="submit"
                disabled={isLoading || verificationCode.length !== 6}
                className="w-full rounded-full bg-blue-700 hover:bg-blue-800 py-3"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Verify Email
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 space-y-3">
              <p className="text-sm text-gray-600">Didn't receive the code?</p>

              {canResend ? (
                <Button variant="link" onClick={handleResendCode} disabled={isResending} className="text-blue-700 p-0">
                  {isResending ? "Sending..." : "Resend Code"}
                </Button>
              ) : (
                <p className="text-sm text-gray-500">Resend code in {countdown}s</p>
              )}
            </div>

            <div className="mt-8 p-4 bg-blue-50 rounded-lg">
              <p className="text-xs text-blue-700">
              Check your spam folder if you don't see the email in your inbox
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
