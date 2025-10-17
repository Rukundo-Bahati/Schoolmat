import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AlertCircle, CheckCircle } from "lucide-react"
import { useState } from "react"
import { changePassword } from "@/lib/settings-api"

interface PasswordChangeFormProps {
  onCancel: () => void
}

export default function PasswordChangeForm({ onCancel }: PasswordChangeFormProps) {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Get authentication token
  const getToken = () => {
    return localStorage.getItem('access_token') || localStorage.getItem('token') || ''
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setError('')
    setSuccess('')
  }

  const validateForm = () => {
    if (!formData.currentPassword) {
      setError('Current password is required')
      return false
    }
    if (!formData.newPassword) {
      setError('New password is required')
      return false
    }
    if (formData.newPassword.length < 6) {
      setError('New password must be at least 6 characters long')
      return false
    }
    if (formData.newPassword !== formData.confirmPassword) {
      setError('New passwords do not match')
      return false
    }
    if (formData.currentPassword === formData.newPassword) {
      setError('New password must be different from current password')
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!validateForm()) return

    setIsLoading(true)
    try {
      const token = getToken()
      if (!token) {
        setError('Authentication required. Please log in again.')
        return
      }

      await changePassword(token, formData.currentPassword, formData.newPassword)
      setSuccess('Password changed successfully!')
      setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' })

      // Close the form after a short delay
      setTimeout(() => {
        onCancel()
      }, 2000)
    } catch (err: any) {
      setError(err.message || 'Failed to change password. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4 pt-4 border-t">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
          <Input
            type="password"
            value={formData.currentPassword}
            onChange={(e) => handleInputChange('currentPassword', e.target.value)}
            className="rounded-full"
            placeholder="Enter current password"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
          <Input
            type="password"
            value={formData.newPassword}
            onChange={(e) => handleInputChange('newPassword', e.target.value)}
            className="rounded-full"
            placeholder="Enter new password (min. 6 characters)"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
          <Input
            type="password"
            value={formData.confirmPassword}
            onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
            className="rounded-full"
            placeholder="Confirm new password"
            required
          />
        </div>

        {error && (
          <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg">
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        {success && (
          <div className="flex items-center space-x-2 text-green-600 bg-green-50 p-3 rounded-lg">
            <CheckCircle className="h-4 w-4" />
            <span className="text-sm">{success}</span>
          </div>
        )}

        <div className="flex space-x-4">
          <Button
            type="submit"
            disabled={isLoading}
            className="rounded-full bg-blue-700 hover:bg-blue-800 disabled:opacity-50"
          >
            {isLoading ? 'Updating...' : 'Update Password'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="rounded-full"
            disabled={isLoading}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}