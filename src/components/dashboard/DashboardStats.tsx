import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, DollarSign, Package, Users } from "lucide-react";

export const DashboardStats = () => {
  // Mock data - in real app, this would come from your backend
  const stats = {
    todaySales: 1250.00,
    weekSales: 8750.00,
    inventoryValue: 15420.00,
    lowStockItems: 3,
    salesGrowth: 12.5,
    topSellingItem: "Beer - Lager"
  };

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Sales</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.todaySales.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              +15% from yesterday
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Week</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.weekSales.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              +{stats.salesGrowth}% from last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inventory Value</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.inventoryValue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              Current stock value
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Alerts</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.lowStockItems}</div>
            <p className="text-xs text-muted-foreground">
              Items need restocking
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Sales Activity</CardTitle>
            <CardDescription>Latest transactions from today</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { time: "2:45 PM", item: "Chicken Wings", amount: 12.00, staff: "John" },
                { time: "2:30 PM", item: "Beer - Lager", amount: 5.00, staff: "Sarah" },
                { time: "2:15 PM", item: "Nachos", amount: 9.00, staff: "Mike" },
                { time: "2:00 PM", item: "Wine - Red", amount: 8.00, staff: "John" }
              ].map((sale, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{sale.item}</div>
                    <div className="text-sm text-gray-600">{sale.time} • by {sale.staff}</div>
                  </div>
                  <div className="font-medium">${sale.amount.toFixed(2)}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Selling Items</CardTitle>
            <CardDescription>Most popular items this week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: "Beer - Lager", sales: 145, revenue: 725.00 },
                { name: "Chicken Wings", sales: 89, revenue: 1068.00 },
                { name: "Nachos", sales: 76, revenue: 684.00 },
                { name: "Wine - Red", sales: 45, revenue: 360.00 }
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{item.name}</div>
                    <div className="text-sm text-gray-600">{item.sales} sold</div>
                  </div>
                  <div className="font-medium">${item.revenue.toFixed(2)}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};