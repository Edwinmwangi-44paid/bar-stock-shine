import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SalesEntry } from "./SalesEntry";
import { TodaysSummary } from "./TodaysSummary";
import { Package, Users, DollarSign, LogOut, Plus } from "lucide-react";

interface WorkerDashboardProps {
  userEmail: string;
  onLogout: () => void;
}

export const WorkerDashboard = ({ userEmail, onLogout }: WorkerDashboardProps) => {
  const [showSalesEntry, setShowSalesEntry] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Package className="h-8 w-8 text-orange-600" />
              <h1 className="text-2xl font-bold text-gray-900">BarStock</h1>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">Staff</Badge>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">{userEmail}</span>
              <Button variant="outline" size="sm" onClick={onLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Quick Actions
              </CardTitle>
              <CardDescription>
                Record sales and manage daily operations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => setShowSalesEntry(true)}
                className="bg-orange-600 hover:bg-orange-700"
                size="lg"
              >
                <Plus className="h-4 w-4 mr-2" />
                Record Sale
              </Button>
            </CardContent>
          </Card>

          {/* Today's Summary */}
          <TodaysSummary />

          {/* Sales Entry Modal/Form */}
          {showSalesEntry && (
            <SalesEntry onClose={() => setShowSalesEntry(false)} />
          )}
        </div>
      </main>
    </div>
  );
};