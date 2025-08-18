import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Crown, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface UpgradeButtonProps {
  variant?: "default" | "outline";
  size?: "default" | "sm" | "lg";
  className?: string;
}

export const UpgradeButton = ({ variant = "default", size = "default", className }: UpgradeButtonProps) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleUpgrade = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase.functions.invoke('create-checkout');
      
      if (error) {
        throw error;
      }
      
      if (data?.url) {
        // Open Stripe checkout in a new tab
        window.open(data.url, '_blank');
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
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleUpgrade}
      disabled={loading}
      variant={variant}
      size={size}
      className={className}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
      ) : (
        <Crown className="h-4 w-4 mr-2" />
      )}
      {loading ? "Loading..." : "Upgrade Plan"}
    </Button>
  );
};