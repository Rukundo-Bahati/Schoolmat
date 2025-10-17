import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Download, DollarSign, Package, Truck } from "lucide-react"

interface Purchase {
  id: number
  item: string
  date: string
  amount: string
  status: string
  category: string
  student: string
}

interface PurchasesTabProps {
  filteredPurchases: Purchase[]
  filterStatus: string
  onFilterChange: (status: string) => void
  onDownloadOrderHistory: () => void
  onDownloadSingleOrder: (purchase: Purchase) => void
  orderTrendData?: any
  chartOptions?: any
}

export default function PurchasesTab({
  filteredPurchases,
  filterStatus,
  onFilterChange,
  onDownloadOrderHistory,
  onDownloadSingleOrder,
  orderTrendData,
  chartOptions,
}: PurchasesTabProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Purchase History</h1>
        <div className="flex items-center space-x-4">
          <select
            value={filterStatus}
            onChange={(e) => onFilterChange(e.target.value)}
            className="rounded-full border border-gray-300 px-4 py-2"
          >
            <option value="all">All Orders</option>
            <option value="delivered">Delivered</option>
            <option value="processing">Processing</option>
          </select>
          <Button
            variant="outline"
            className="rounded-full bg-transparent"
            onClick={onDownloadOrderHistory}
          >
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
        </div>
      </div>

      {/* Purchase Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700 mb-2">Total Amount Paid</p>
                <p className="text-2xl font-bold text-green-900">
                  RWF{" "}
                  {filteredPurchases
                    .reduce((sum, p) => sum + Number.parseInt(p.amount.replace(",", "")), 0)
                    .toLocaleString()}
                </p>
              </div>
              <div className="p-3 bg-green-500 rounded-full shadow-lg">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700 mb-2">Orders This Year</p>
                <p className="text-2xl font-bold text-blue-900">
                  {filteredPurchases.filter((p) => {
                    const year = new Date(p.date).getFullYear()
                    return year === new Date().getFullYear()
                  }).length}
                </p>
              </div>
              <div className="p-3 bg-blue-500 rounded-full shadow-lg">
                <Package className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-emerald-700 mb-2">Total Orders</p>
                <p className="text-2xl font-bold text-emerald-900">
                  {filteredPurchases.length}
                </p>
              </div>
              <div className="p-3 bg-emerald-500 rounded-full shadow-lg">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-amber-700 mb-2">Average Order Value</p>
                <p className="text-2xl font-bold text-amber-900">
                  RWF{" "}
                  {filteredPurchases.length > 0
                    ? Math.round(
                        filteredPurchases.reduce((sum, p) => sum + Number.parseInt(p.amount.replace(",", "")), 0) /
                        filteredPurchases.length
                      ).toLocaleString()
                    : "0"}
                </p>
              </div>
              <div className="p-3 bg-amber-500 rounded-full shadow-lg">
                <Truck className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white shadow-sm">
        <CardContent className="p-6">
          <div className="space-y-4">
            {filteredPurchases.map((purchase, index) => (
              <div
                key={`${purchase.id}-${index}`}
                className="flex items-center justify-between p-4 border rounded-lg hover:shadow-sm transition-shadow"
              >
                <div className="flex items-center space-x-4">
                  <CheckCircle className="h-6 w-6 text-green-500" />
                  <div>
                    <p className="font-medium text-gray-900">{purchase.item}</p>
                    <p className="text-sm text-gray-600">
                      Ordered on {purchase.date} • {purchase.category} • For {purchase.student}
                    </p>
                  </div>
                </div>
                <div className="text-right flex items-center space-x-3">
                  <div>
                    <p className="font-bold text-gray-900">RWF {purchase.amount}</p>
                    <Badge className="bg-green-100 text-green-800">Delivered</Badge>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full bg-transparent"
                    onClick={() => onDownloadSingleOrder(purchase)}
                  >
                    <Download className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
