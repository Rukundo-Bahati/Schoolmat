import React from 'react'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { AlertTriangle } from "lucide-react"

interface ConfirmationDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  description: string
  confirmText?: string
  cancelText?: string
  variant?: 'default' | 'destructive'
  isLoading?: boolean
}

export function ConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = 'destructive',
  isLoading = false
}: ConfirmationDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center space-x-3">
            {variant === 'destructive' && (
              <div className="flex-shrink-0">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
            )}
            <div>
              <DialogTitle className="text-lg font-semibold text-gray-900">
                {title}
              </DialogTitle>
            </div>
          </div>
          <DialogDescription className="text-sm text-gray-600 mt-2">
            {description}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex space-x-2 sm:space-x-0">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className="rounded-full"
          >
            {cancelText}
          </Button>
          <Button
            variant={variant}
            onClick={onConfirm}
            disabled={isLoading}
            className="rounded-full"
          >
            {isLoading ? "Processing..." : confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}