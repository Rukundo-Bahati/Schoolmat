import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { X, Save } from "lucide-react"

interface Product {
  id: string
  name: string
  category: string
  price: number
  stock: number
  minStock: number
  required: boolean
  description: string
  supplier: string
  lastUpdated: string
}

interface ProductFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (productData: Partial<Product>) => void
  editingProduct: Product | null
}

export default function ProductFormModal({
  isOpen,
  onClose,
  onSave,
  editingProduct
}: ProductFormModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: 0,
    stock: 0,
    minStock: 0,
    required: false,
    description: "",
    supplier: "",
  })

  useEffect(() => {
    if (editingProduct) {
      setFormData({
        name: editingProduct.name,
        category: editingProduct.category,
        price: editingProduct.price,
        stock: editingProduct.stock,
        minStock: editingProduct.minStock,
        required: editingProduct.required,
        description: editingProduct.description,
        supplier: editingProduct.supplier,
      })
    } else {
      setFormData({
        name: "",
        category: "",
        price: 0,
        stock: 0,
        minStock: 0,
        required: false,
        description: "",
        supplier: "",
      })
    }
  }, [editingProduct, isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  const handleInputChange = (field: string, value: string | number | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl font-bold text-gray-900">
            {editingProduct ? "Edit Product" : "Add New Product"}
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="rounded-full"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Name *
                </label>
                <Input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Enter product name"
                  className="rounded-full"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <Input
                  type="text"
                  value={formData.category}
                  onChange={(e) => handleInputChange("category", e.target.value)}
                  placeholder="Enter category"
                  className="rounded-full"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price (RWF) *
                </label>
                <Input
                  type="number"
                  value={formData.price}
                  onChange={(e) => handleInputChange("price", parseFloat(e.target.value) || 0)}
                  placeholder="Enter price"
                  className="rounded-full"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stock Quantity *
                </label>
                <Input
                  type="number"
                  value={formData.stock}
                  onChange={(e) => handleInputChange("stock", parseInt(e.target.value) || 0)}
                  placeholder="Enter stock quantity"
                  className="rounded-full"
                  min="0"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum Stock *
                </label>
                <Input
                  type="number"
                  value={formData.minStock}
                  onChange={(e) => handleInputChange("minStock", parseInt(e.target.value) || 0)}
                  placeholder="Enter minimum stock level"
                  className="rounded-full"
                  min="0"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Supplier *
                </label>
                <Input
                  type="text"
                  value={formData.supplier}
                  onChange={(e) => handleInputChange("supplier", e.target.value)}
                  placeholder="Enter supplier name"
                  className="rounded-full"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Enter product description"
                rows={3}
                className="w-full rounded-lg border border-gray-300 px-4 py-2"
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="required"
                checked={formData.required}
                onChange={(e) => handleInputChange("required", e.target.checked)}
                className="rounded"
              />
              <label htmlFor="required" className="text-sm font-medium text-gray-700">
                This is a required school item
              </label>
              {formData.required && (
                <Badge className="bg-yellow-100 text-yellow-800 text-xs">Required</Badge>
              )}
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="rounded-full"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="rounded-full bg-blue-700 hover:bg-blue-800"
              >
                <Save className="h-4 w-4 mr-2" />
                {editingProduct ? "Update Product" : "Add Product"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
