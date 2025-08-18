import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Crown, Loader2, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface PlanSelectorProps {
  variant?: "default" | "outline";
  size?: "default" | "sm" | "lg";
  className?: string;
}

export const PlanSelector = ({ variant = "default", size = "default", className }: PlanSelectorProps) => {
  const [loading, setLoading] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const handlePlanSelect = async (plan: 'pro' | 'pro-plus') => {
    try {
      setLoading(plan);
      
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { plan }
      });
      
      if (error) {
        throw error;
      }
      
      if (data?.url) {
        // Open Stripe checkout in a new tab
        window.open(data.url, '_blank');
        setOpen(false);
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (error) {
      console.error('Error creating checkout:', error);
      toast({
        title: "Error",
        description: "Failed to start upgrade process. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={variant} size={size} className={className}>
          <Crown className="h-4 w-4 mr-2" />
          Upgrade Plan
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-yellow-500" />
            Choose Your Plan
          </DialogTitle>
          <DialogDescription>
            Remove ads and unlock premium features with our subscription plans.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {/* Pro Plan */}
          <Card className="relative">
            <CardHeader>
              <CardTitle className="text-xl">Pro Plan</CardTitle>
              <CardDescription>Perfect for regular users</CardDescription>
              <div className="text-3xl font-bold">
                $10<span className="text-sm font-normal text-muted-foreground">/month</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Ad-free experience</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Priority support</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Advanced features</span>
                </div>
              </div>
              <Button 
                onClick={() => handlePlanSelect('pro')} 
                disabled={loading !== null}
                className="w-full"
              >
                {loading === 'pro' ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : null}
                {loading === 'pro' ? "Loading..." : "Choose Pro"}
              </Button>
            </CardContent>
          </Card>

          {/* Pro Plus Plan */}
          <Card className="relative border-yellow-200 bg-gradient-to-br from-yellow-50 to-orange-50">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                BEST VALUE
              </span>
            </div>
            <CardHeader>
              <CardTitle className="text-xl">Pro Plus Plan</CardTitle>
              <CardDescription>Save with 6-month commitment</CardDescription>
              <div className="text-3xl font-bold">
                $50<span className="text-sm font-normal text-muted-foreground">/6 months</span>
              </div>
              <div className="text-sm text-green-600 font-medium">
                Save $10 compared to monthly
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Ad-free experience</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Priority support</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Advanced features</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="text-sm">6-month savings</span>
                </div>
              </div>
              <Button 
                onClick={() => handlePlanSelect('pro-plus')} 
                disabled={loading !== null}
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-white"
              >
                {loading === 'pro-plus' ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : null}
                {loading === 'pro-plus' ? "Loading..." : "Choose Pro Plus"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};