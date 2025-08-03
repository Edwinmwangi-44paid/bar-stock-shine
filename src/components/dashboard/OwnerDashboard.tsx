import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InventoryManager } from "./InventoryManager";
import { WeeklyReports } from "./WeeklyReports";
import { DashboardStats } from "./DashboardStats";
import { Package, TrendingUp, Users, DollarSign, LogOut } from "lucide-react";

interface OwnerDashboardProps {
  userEmail: string;
  onLogout: () => void;
}

export const OwnerDashboard = ({ userEmail, onLogout }: OwnerDashboardProps) => {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Package className="h-8 w-8 text-orange-600" />
              <h1 className="text-2xl font-bold text-gray-900">BarStock</h1>
              <Badge variant="secondary" className="bg-orange-100 text-orange-800">Owner</Badge>
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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="inventory" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Inventory
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Reports
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <DashboardStats />
          </TabsContent>

          <TabsContent value="inventory" className="mt-6">
            <InventoryManager />
          </TabsContent>

          <TabsContent value="reports" className="mt-6">
            <WeeklyReports />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};