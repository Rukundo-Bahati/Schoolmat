import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"

interface PaymentMethod {
  id: string
  type: 'mtn' | 'airtel' | 'card' | 'bank'
  name: string
  accountNumber?: string
  accountName?: string
  isActive: boolean
}

interface PaymentMethodModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (method: Omit<PaymentMethod, 'id'>) => void
  editingMethod?: PaymentMethod | null
}

export default function PaymentMethodModal({ isOpen, onClose, onSave, editingMethod }: PaymentMethodModalProps) {
  const [formData, setFormData] = useState({
    type: editingMethod?.type || 'mtn' as PaymentMethod['type'],
    name: editingMethod?.name || '',
    accountNumber: editingMethod?.accountNumber || '',
    accountName: editingMethod?.accountName || '',
    isActive: editingMethod?.isActive ?? true,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
    onClose()
    // Reset form
    setFormData({
      type: 'mtn',
      name: '',
      accountNumber: '',
      accountName: '',
      isActive: true,
    })
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'mtn': return 'M'
      case 'airtel': return 'A'
      case 'card': return 'V'
      case 'bank': return 'B'
      default: return 'P'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'mtn': return 'bg-yellow-100 text-yellow-700'
      case 'airtel': return 'bg-red-100 text-red-700'
      case 'card': return 'bg-blue-100 text-blue-700'
      case 'bank': return 'bg-green-100 text-green-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[90vw] max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {editingMethod ? 'Edit Payment Method' : 'Add Payment Method'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="type">Payment Type</Label>
            <Select
              value={formData.type}
              onValueChange={(value: PaymentMethod['type']) =>
                setFormData(prev => ({ ...prev, type: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select payment type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mtn">MTN Mobile Money</SelectItem>
                <SelectItem value="airtel">Airtel Money</SelectItem>
                <SelectItem value="card">Credit/Debit Card</SelectItem>
                <SelectItem value="bank">Bank Transfer</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="name">Display Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="e.g., MTN Mobile Money"
              required
            />
          </div>

          {(formData.type === 'mtn' || formData.type === 'airtel') && (
            <>
              <div>
                <Label htmlFor="accountNumber">Phone Number</Label>
                <Input
                  id="accountNumber"
                  value={formData.accountNumber}
                  onChange={(e) => setFormData(prev => ({ ...prev, accountNumber: e.target.value }))}
                  placeholder="e.g., +250 788 000 000"
                />
              </div>
              <div>
                <Label htmlFor="accountName">Account Name (Optional)</Label>
                <Input
                  id="accountName"
                  value={formData.accountName}
                  onChange={(e) => setFormData(prev => ({ ...prev, accountName: e.target.value }))}
                  placeholder="Account holder name"
                />
              </div>
            </>
          )}

          {formData.type === 'card' && (
            <>
              <div>
                <Label htmlFor="accountNumber">Card Number (Last 4 digits)</Label>
                <Input
                  id="accountNumber"
                  value={formData.accountNumber}
                  onChange={(e) => setFormData(prev => ({ ...prev, accountNumber: e.target.value }))}
                  placeholder="**** **** **** 1234"
                  maxLength={19}
                />
              </div>
              <div>
                <Label htmlFor="accountName">Cardholder Name</Label>
                <Input
                  id="accountName"
                  value={formData.accountName}
                  onChange={(e) => setFormData(prev => ({ ...prev, accountName: e.target.value }))}
                  placeholder="John Doe"
                />
              </div>
            </>
          )}

          {formData.type === 'bank' && (
            <>
              <div>
                <Label htmlFor="accountNumber">Account Number</Label>
                <Input
                  id="accountNumber"
                  value={formData.accountNumber}
                  onChange={(e) => setFormData(prev => ({ ...prev, accountNumber: e.target.value }))}
                  placeholder="Bank account number"
                />
              </div>
              <div>
                <Label htmlFor="accountName">Account Name</Label>
                <Input
                  id="accountName"
                  value={formData.accountName}
                  onChange={(e) => setFormData(prev => ({ ...prev, accountName: e.target.value }))}
                  placeholder="Account holder name"
                />
              </div>
            </>
          )}

          <div className="flex items-center space-x-2">
            <Switch
              id="isActive"
              checked={formData.isActive}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
            />
            <Label htmlFor="isActive">Enable this payment method</Label>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-blue-700 hover:bg-blue-800">
              {editingMethod ? 'Update' : 'Add'} Payment Method
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
