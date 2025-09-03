"use client"

import { useEffect } from 'react'

interface PartyCelebrationProps {
  show: boolean
  onComplete: () => void
  productName?: string
}

export function PartyCelebration({ show, onComplete, productName }: PartyCelebrationProps) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onComplete()
      }, 2000)

      return () => clearTimeout(timer)
    }
  }, [show, onComplete])

  if (!show) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-white rounded-2xl p-8 text-center shadow-2xl transform animate-bounce-in">
        <div className="text-6xl mb-4 animate-pulse">🎉</div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
          Added to Cart!
        </h2>
        <p className="text-lg text-gray-700 mb-2">
          {productName ? (
            <>
              <span className="font-semibold text-blue-600">{productName}</span> has been added to your cart
            </>
          ) : (
            "Item added to your cart"
          )}
        </p>
        <div className="flex justify-center space-x-2 mt-4">
          <span className="animate-bounce text-2xl">🛒</span>
          <span className="animate-bounce text-2xl" style={{animationDelay: '0.1s'}}>✨</span>
          <span className="animate-bounce text-2xl" style={{animationDelay: '0.2s'}}>🎊</span>
        </div>
        <style jsx>{`
          @keyframes fade-in {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes bounce-in {
            0% { transform: scale(0.3); opacity: 0; }
            50% { transform: scale(1.05); }
            70% { transform: scale(0.9); }
            100% { transform: scale(1); opacity: 1; }
          }
          .animate-fade-in {
            animation: fade-in 0.3s ease-out;
          }
          .animate-bounce-in {
            animation: bounce-in 0.6s ease-out;
          }
        `}</style>
      </div>
    </div>
  )
}