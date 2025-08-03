import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, TrendingUp, TrendingDown } from "lucide-react";

export const WeeklyReports = () => {
  // Mock data - in real app, this would come from your backend
  const weeklyData = {
    currentWeek: {
      sales: 8750.00,
      costs: 3200.00,
      profit: 5550.00,
      period: "Jan 8 - Jan 14, 2024"
    },
    previousWeek: {
      sales: 7800.00,
      costs: 2900.00,
      profit: 4900.00,
      period: "Jan 1 - Jan 7, 2024"
    },
    monthlyData: [
      { week: "Week 1", sales: 7800, costs: 2900, profit: 4900 },
      { week: "Week 2", sales: 8750, costs: 3200, profit: 5550 },
      { week: "Week 3", sales: 0, costs: 0, profit: 0 },
      { week: "Week 4", sales: 0, costs: 0, profit: 0 }
    ]
  };

  const salesGrowth = ((weeklyData.currentWeek.sales - weeklyData.previousWeek.sales) / weeklyData.previousWeek.sales) * 100;
  const profitGrowth = ((weeklyData.currentWeek.profit - weeklyData.previousWeek.profit) / weeklyData.previousWeek.profit) * 100;

  return (
    <div className="space-y-6">
      {/* Weekly Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Weekly Sales</CardTitle>
            {salesGrowth >= 0 ? (
              <TrendingUp className="h-4 w-4 text-green-600" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-600" />
            )}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${weeklyData.currentWeek.sales.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              <span className={salesGrowth >= 0 ? "text-green-600" : "text-red-600"}>
                {salesGrowth >= 0 ? "+" : ""}{salesGrowth.toFixed(1)}%
              </span>
              {" "}from last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cost of Goods Sold</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${weeklyData.currentWeek.costs.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              {((weeklyData.currentWeek.costs / weeklyData.currentWeek.sales) * 100).toFixed(1)}% of sales
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Weekly Profit</CardTitle>
            {profitGrowth >= 0 ? (
              <TrendingUp className="h-4 w-4 text-green-600" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-600" />
            )}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ${weeklyData.currentWeek.profit.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              <span className={profitGrowth >= 0 ? "text-green-600" : "text-red-600"}>
                {profitGrowth >= 0 ? "+" : ""}{profitGrowth.toFixed(1)}%
              </span>
              {" "}from last week
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Reports */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Current Week Details */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Current Week Report</CardTitle>
                <CardDescription>{weeklyData.currentWeek.period}</CardDescription>
              </div>
              <Badge className="bg-green-100 text-green-800">Active</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b">
                <span className="font-medium">Total Sales Revenue</span>
                <span className="font-bold">${weeklyData.currentWeek.sales.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="font-medium">Cost of Goods Sold</span>
                <span className="font-bold text-red-600">-${weeklyData.currentWeek.costs.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-2 border-gray-200">
                <span className="font-bold">Net Profit</span>
                <span className="font-bold text-green-600 text-lg">
                  ${weeklyData.currentWeek.profit.toFixed(2)}
                </span>
              </div>
              <div className="pt-2">
                <div className="text-sm text-gray-600">
                  Profit Margin: {((weeklyData.currentWeek.profit / weeklyData.currentWeek.sales) * 100).toFixed(1)}%
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Previous Week Comparison */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Previous Week Report</CardTitle>
                <CardDescription>{weeklyData.previousWeek.period}</CardDescription>
              </div>
              <Badge variant="secondary">Completed</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b">
                <span className="font-medium">Total Sales Revenue</span>
                <span className="font-bold">${weeklyData.previousWeek.sales.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="font-medium">Cost of Goods Sold</span>
                <span className="font-bold text-red-600">-${weeklyData.previousWeek.costs.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-2 border-gray-200">
                <span className="font-bold">Net Profit</span>
                <span className="font-bold text-green-600 text-lg">
                  ${weeklyData.previousWeek.profit.toFixed(2)}
                </span>
              </div>
              <div className="pt-2">
                <div className="text-sm text-gray-600">
                  Profit Margin: {((weeklyData.previousWeek.profit / weeklyData.previousWeek.sales) * 100).toFixed(1)}%
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Overview */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Monthly Overview</CardTitle>
              <CardDescription>January 2024 - Week by week breakdown</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {weeklyData.monthlyData.map((week, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <div className="font-medium">{week.week}</div>
                  {week.sales > 0 && (
                    <div className="text-sm text-gray-600">
                      Sales: ${week.sales.toFixed(2)} • Costs: ${week.costs.toFixed(2)}
                    </div>
                  )}
                </div>
                <div className="text-right">
                  {week.profit > 0 ? (
                    <div className="font-bold text-green-600">${week.profit.toFixed(2)}</div>
                  ) : (
                    <div className="text-gray-400">-</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};