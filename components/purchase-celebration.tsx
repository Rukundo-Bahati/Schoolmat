"use client"

import { useState, useEffect } from "react"
import { Check, Heart, Star, Gift } from "lucide-react"

interface PurchaseCelebrationProps {
  show: boolean
  onComplete: () => void
  productName?: string
}

export function PurchaseCelebration({ show, onComplete, productName }: PurchaseCelebrationProps) {
  const [stage, setStage] = useState<"celebrating" | "complete">("celebrating")

  useEffect(() => {
    if (show) {
      setStage("celebrating")
      const timer = setTimeout(() => {
        setStage("complete")
        onComplete()
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [show, onComplete])

  if (!show) return null

  const celebrationIcons = [Heart, Star, Gift, Check]

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-purple-900/90 to-blue-900/90 flex items-center justify-center z-50">
      <div className="bg-white rounded-3xl p-12 text-center relative overflow-hidden max-w-md mx-4">
        {/* Floating celebration elements */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => {
            const Icon = celebrationIcons[i % celebrationIcons.length]
            return (
              <div
                key={i}
                className="absolute animate-float"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  animationDuration: `${3 + Math.random() * 2}s`,
                }}
              >
                <Icon className="h-6 w-6 text-gradient-to-r from-pink-500 to-yellow-500 opacity-70" />
              </div>
            )
          })}
        </div>

        <div className="relative z-10 space-y-6">
          <div className="text-6xl animate-bounce">🎊</div>

          <div className="space-y-2">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Congratulations!
            </h2>
            <p className="text-lg text-gray-700">
              Your purchase of <span className="font-semibold text-blue-600">{productName}</span> was successful!
            </p>
          </div>

          <div className="flex justify-center space-x-2">
            <div className="text-2xl animate-bounce" style={{ animationDelay: "0s" }}>
              🎉
            </div>
            <div className="text-2xl animate-bounce" style={{ animationDelay: "0.2s" }}>
              ✨
            </div>
            <div className="text-2xl animate-bounce" style={{ animationDelay: "0.4s" }}>
              🎊
            </div>
            <div className="text-2xl animate-bounce" style={{ animationDelay: "0.6s" }}>
              🌟
            </div>
          </div>

          <p className="text-sm text-gray-600">Thank you for choosing SchoolMart! Your order is being processed.</p>
        </div>
      </div>
    </div>
  )
}
