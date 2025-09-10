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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-white shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Amount Paid</p>
                <p className="text-xl font-bold text-gray-900">
                  RWF{" "}
                  {filteredPurchases
                    .reduce((sum, p) => sum + Number.parseInt(p.amount.replace(",", "")), 0)
                    .toLocaleString()}
                </p>
              </div>
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Orders This Year</p>
                <p className="text-xl font-bold text-gray-900">
                  {filteredPurchases.filter((p) => {
                    const year = new Date(p.date).getFullYear()
                    return year === new Date().getFullYear()
                  }).length}
                </p>
              </div>
              <Package className="h-6 w-6 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total  Orders</p>
                <p className="text-xl font-bold text-gray-900">
                  {filteredPurchases.length}
                </p>
              </div>
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Average Order Value</p>
                <p className="text-xl font-bold text-gray-900">
                  RWF{" "}
                  {filteredPurchases.length > 0
                    ? Math.round(
                        filteredPurchases.reduce((sum, p) => sum + Number.parseInt(p.amount.replace(",", "")), 0) /
                        filteredPurchases.length
                      ).toLocaleString()
                    : "0"}
                </p>
              </div>
              <Truck className="h-6 w-6 text-yellow-600" />
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
