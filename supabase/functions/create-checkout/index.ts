import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? ""
  );

  try {
    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    const { data } = await supabaseClient.auth.getUser(token);
    const user = data.user;
    if (!user?.email) throw new Error("User not authenticated or email not available");

    // Get plan from request body
    const requestBody = await req.json();
    const { plan } = requestBody;
    
    if (!plan || !['pro', 'pro-plus'].includes(plan)) {
      throw new Error("Invalid plan selected");
    }

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", { apiVersion: "2023-10-16" });
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    let customerId;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
    }

    // Define plan details
    const planDetails = {
      'pro': {
        name: "Pro Plan - Ad Free",
        amount: 1000, // $10.00
        interval: "month" as const
      },
      'pro-plus': {
        name: "Pro Plus Plan - Ad Free (6 Months)",
        amount: 5000, // $50.00
        interval: "month" as const,
        interval_count: 6
      }
    };

    const selectedPlan = planDetails[plan as keyof typeof planDetails];

    const lineItem: any = {
      price_data: {
        currency: "usd",
        product_data: { name: selectedPlan.name },
        unit_amount: selectedPlan.amount,
        recurring: { 
          interval: selectedPlan.interval,
          ...(selectedPlan.interval_count && { interval_count: selectedPlan.interval_count })
        },
      },
      quantity: 1,
    };

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : user.email,
      line_items: [lineItem],
      mode: "subscription",
      success_url: `${req.headers.get("origin")}/success`,
      cancel_url: `${req.headers.get("origin")}/`,
    });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});