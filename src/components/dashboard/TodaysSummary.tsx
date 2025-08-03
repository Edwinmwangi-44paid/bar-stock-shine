import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, ShoppingCart, Clock } from "lucide-react";

export const TodaysSummary = () => {
  // Mock data - in real app, this would come from your backend
  const todaysData = {
    totalSales: 1250.00,
    transactionCount: 47,
    averageOrder: 26.60,
    lastSale: "2:45 PM",
    topItem: "Chicken Wings"
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Sales</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${todaysData.totalSales.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              {todaysData.transactionCount} transactions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Order</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${todaysData.averageOrder.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              Per transaction
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last Sale</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todaysData.lastSale}</div>
            <p className="text-xs text-muted-foreground">
              {todaysData.topItem}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle>Today's Transactions</CardTitle>
          <CardDescription>Recent sales you've recorded</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { time: "2:45 PM", items: ["Chicken Wings"], total: 12.00, id: "#1234" },
              { time: "2:30 PM", items: ["Beer - Lager", "Nachos"], total: 14.00, id: "#1233" },
              { time: "2:15 PM", items: ["Wine - Red"], total: 8.00, id: "#1232" },
              { time: "2:00 PM", items: ["Beer - Lager x2"], total: 10.00, id: "#1231" },
              { time: "1:45 PM", items: ["Chicken Wings", "Beer - Lager"], total: 17.00, id: "#1230" }
            ].map((transaction, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <div className="font-medium">{transaction.items.join(", ")}</div>
                  <div className="text-sm text-gray-600">
                    {transaction.time} • {transaction.id}
                  </div>
                </div>
                <div className="font-medium text-green-600">
                  ${transaction.total.toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};