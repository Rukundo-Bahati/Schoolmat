"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { ShoppingCart, Check, Sparkles } from "lucide-react"

interface CartAnimationProps {
  show: boolean
  onComplete: () => void
}

export function CartAnimation({ show, onComplete }: CartAnimationProps) {
  const [stage, setStage] = useState<"adding" | "success" | "complete">("adding")

  useEffect(() => {
    if (show) {
      setStage("adding")
      const timer1 = setTimeout(() => setStage("success"), 800)
      const timer2 = setTimeout(() => {
        setStage("complete")
        onComplete()
      }, 2000)

      return () => {
        clearTimeout(timer1)
        clearTimeout(timer2)
      }
    }
  }, [show, onComplete])

  return (
    <Dialog open={show} onOpenChange={() => {}}>
      <DialogContent className="!max-w-md w-[90vw] sm:!max-w-md" showCloseButton={false}>
        <DialogTitle className="sr-only">Adding to Cart</DialogTitle>
        <div className="p-4 text-center relative overflow-hidden">
        {/* Falling sparkles animation */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            >
              <Sparkles className="h-4 w-4 text-yellow-400" />
            </div>
          ))}
        </div>

        <div className="relative z-10">
          {stage === "adding" && (
            <div className="space-y-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto animate-pulse">
                <ShoppingCart className="h-8 w-8 text-blue-700 animate-bounce" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Adding to Cart...</h3>
              <div className="w-32 h-2 bg-gray-200 rounded-full mx-auto overflow-hidden">
                <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></div>
              </div>
            </div>
          )}

          {stage === "success" && (
            <div className="space-y-4 animate-fade-in">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto animate-bounce">
                <Check className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-green-600">Added Successfully!</h3>
              <p className="text-gray-600">Item has been added to your cart</p>
              <div className="text-4xl animate-bounce">🎉</div>
            </div>
          )}
        </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
