"use client";

import { User } from "@supabase/supabase-js";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { supabase } from "../../supabase/supabase";
import { Check } from "lucide-react";

export default function PricingCard({
  item,
  user,
}: {
  item: any;
  user: User | null;
}) {
  // Handle checkout process
  const handleCheckout = async (priceId: string) => {
    if (!user) {
      // Redirect to login if user is not authenticated
      window.location.href = "/login?redirect=pricing";
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke(
        "supabase-functions-create-checkout",
        {
          body: {
            price_id: priceId,
            user_id: user.id,
            return_url: `${window.location.origin}/dashboard`,
          },
          headers: {
            "X-Customer-Email": user.email || "",
          },
        },
      );

      if (error) {
        throw error;
      }

      // Redirect to Stripe checkout
      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL returned");
      }
    } catch (error) {
      console.error("Error creating checkout session:", error);
    }
  };

  // Define plan features based on plan name
  const getPlanFeatures = (planName: string) => {
    if (!planName) return [];
    switch (planName.toLowerCase()) {
      case "free":
        return [
          "Single video analysis",
          "Basic transcription & insights",
          "Individual video reports",
        ];
      case "weekly":
        return [
          "Bulk analysis (multiple videos)",
          "Cross-video pattern detection",
          "Google Trends integration",
          "Trend confidence scoring",
          "Export capabilities",
        ];
      case "monthly":
        return [
          "Bulk analysis (multiple videos)",
          "Cross-video pattern detection",
          "Google Trends integration",
          "Trend confidence scoring",
          "Export capabilities",
        ];
      default:
        return [];
    }
  };

  const getButtonText = (planName: string) => {
    if (!planName) return "Get Started";
    switch (planName.toLowerCase()) {
      case "free":
        return "Get Started Free";
      case "weekly":
        return "Start Weekly Plan";
      case "monthly":
        return "Start Monthly Plan";
      default:
        return "Get Started";
    }
  };

  const features = getPlanFeatures(item?.name || "");
  const buttonText = getButtonText(item?.name || "");
  const isMonthly = item?.name?.toLowerCase() === "monthly";

  return (
    <Card
      className={`w-[350px] relative overflow-hidden bg-white ${item.popular ? "border-2 border-purple-500 shadow-xl scale-105" : "border border-gray-200"} hover:shadow-lg transition-all duration-300`}
    >
      {item.popular && (
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-white to-pink-50 opacity-30" />
      )}
      <CardHeader className="relative">
        {item.popular && (
          <div className="px-4 py-1.5 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-pink-600 rounded-full w-fit mb-4">
            Most Popular
          </div>
        )}
        <CardTitle className="text-2xl font-bold tracking-tight text-gray-900">
          {item?.name || "Plan"}
          {isMonthly && (
            <span className="ml-2 text-sm font-normal text-green-600 bg-green-100 px-2 py-1 rounded-full">
              50% OFF - Save $40/month
            </span>
          )}
        </CardTitle>
        <CardDescription className="flex items-baseline gap-2 mt-2">
          {item?.name?.toLowerCase() === "free" ? (
            <span className="text-4xl font-bold text-gray-900">Free</span>
          ) : (
            <>
              <span className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                ${item?.amount / 100}
              </span>
              <span className="text-gray-600">/{item?.interval}</span>
            </>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="relative">
        <ul className="space-y-3">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-3">
              <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
              <span className="text-gray-700">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter className="relative">
        <Button
          onClick={async () => {
            if (item?.name?.toLowerCase() === "free") {
              window.location.href = "/dashboard";
            } else {
              await handleCheckout(item.id);
            }
          }}
          className={`w-full py-6 text-lg font-medium ${
            item.popular
              ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
              : "bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white"
          } transition-all duration-300 transform hover:scale-105`}
        >
          {buttonText}
        </Button>
      </CardFooter>
    </Card>
  );
}
