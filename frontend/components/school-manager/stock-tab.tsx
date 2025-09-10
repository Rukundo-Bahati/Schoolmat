import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Plus,
  Edit,
  Trash2,
  AlertTriangle,
} from "lucide-react"
import { useTableSort } from "@/hooks/use-table-sort"

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

interface StockTabProps {
  products: Product[]
  onAddProduct: () => void
  onEditProduct: (product: Product) => void
  onDeleteProduct: (productId: string) => void
}

export default function StockTab({
  products,
  onAddProduct,
  onEditProduct,
  onDeleteProduct
}: StockTabProps) {
  const lowStockProducts = products.filter((product) => product.stock <= product.minStock)

  const { sortedItems, handleSort, getSortIndicator } = useTableSort(products)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Stock Management</h1>
        <Button
          onClick={onAddProduct}
          className="rounded-full bg-blue-700 hover:bg-blue-800"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Button>
      </div>

      {/* Low Stock Alert */}
      {lowStockProducts.length > 0 && (
        <Card className="bg-red-50 border-red-200 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="h-6 w-6 text-red-600" />
              <div>
                <h3 className="font-semibold text-red-900">Low Stock Alert</h3>
                <p className="text-red-700">{lowStockProducts.length} products are running low on stock</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="bg-white shadow-sm">
        <CardContent className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th
                    className="text-left py-3 px-4 font-semibold text-gray-900 cursor-pointer"
                    onClick={() => handleSort('name')}
                  >
                    Product {getSortIndicator('name')}
                  </th>
                  <th
                    className="text-left py-3 px-4 font-semibold text-gray-900 cursor-pointer"
                    onClick={() => handleSort('category')}
                  >
                    Category {getSortIndicator('category')}
                  </th>
                  <th
                    className="text-left py-3 px-4 font-semibold text-gray-900 cursor-pointer"
                    onClick={() => handleSort('price')}
                  >
                    Price {getSortIndicator('price')}
                  </th>
                  <th
                    className="text-left py-3 px-4 font-semibold text-gray-900 cursor-pointer"
                    onClick={() => handleSort('stock')}
                  >
                    Stock {getSortIndicator('stock')}
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Status</th>
                  <th
                    className="text-left py-3 px-4 font-semibold text-gray-900 cursor-pointer"
                    onClick={() => handleSort('supplier')}
                  >
                    Supplier {getSortIndicator('supplier')}
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedItems.map((product) => (
                  <tr key={product.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium text-gray-900">{product.name}</p>
                        <p className="text-sm text-gray-600">{product.id}</p>
                        {product.required && (
                          <Badge className="mt-1 bg-yellow-100 text-yellow-800 text-xs">Required</Badge>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <p className="text-gray-900">{product.category}</p>
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-medium text-gray-900">RWF {product.price.toLocaleString()}</p>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium text-gray-900">{product.stock} units</p>
                        <p className="text-sm text-gray-600">Min: {product.minStock}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge
                        className={
                          product.stock <= product.minStock
                            ? "bg-red-100 text-red-800"
                            : product.stock <= product.minStock * 2
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-green-100 text-green-800"
                        }
                      >
                        {product.stock <= product.minStock
                          ? "Low Stock"
                          : product.stock <= product.minStock * 2
                            ? "Medium Stock"
                            : "In Stock"}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <p className="text-gray-900">{product.supplier}</p>
                      <p className="text-sm text-gray-600">Updated: {product.lastUpdated}</p>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onEditProduct(product)}
                          className="rounded-full bg-transparent"
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onDeleteProduct(product.id)}
                          className="rounded-full text-red-600 border-red-600 hover:bg-red-50 bg-transparent"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
