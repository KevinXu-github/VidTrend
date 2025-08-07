"use server";

import { encodedRedirect } from "@/utils/utils";
import { redirect } from "next/navigation";
import { createClient } from "../../supabase/server";

export const signUpAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const fullName = formData.get("full_name")?.toString() || "";
  const supabase = await createClient();

  if (!email || !password) {
    return encodedRedirect(
      "error",
      "/sign-up",
      "Email and password are required",
    );
  }

  const {
    data: { user },
    error,
  } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        email: email,
      },
    },
  });

  if (error) {
    return encodedRedirect("error", "/sign-up", error.message);
  }

  if (user) {
    try {
      const { error: updateError } = await supabase.from("users").insert({
        id: user.id,
        user_id: user.id,
        name: fullName,
        email: email,
        token_identifier: user.id,
        created_at: new Date().toISOString(),
      });

      if (updateError) {
        // Error handling without console.error
        return encodedRedirect(
          "error",
          "/sign-up",
          "Error updating user. Please try again.",
        );
      }
    } catch (err) {
      // Error handling without console.error
      return encodedRedirect(
        "error",
        "/sign-up",
        "Error updating user. Please try again.",
      );
    }
  }

  return encodedRedirect(
    "success",
    "/sign-up",
    "Thanks for signing up! Please check your email for a verification link.",
  );
};

export const signInAction = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return encodedRedirect("error", "/sign-in", error.message);
  }

  return redirect("/dashboard");
};

export const forgotPasswordAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const supabase = await createClient();
  const callbackUrl = formData.get("callbackUrl")?.toString();

  if (!email) {
    return encodedRedirect("error", "/forgot-password", "Email is required");
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {});

  if (error) {
    return encodedRedirect(
      "error",
      "/forgot-password",
      "Could not reset password",
    );
  }

  if (callbackUrl) {
    return redirect(callbackUrl);
  }

  return encodedRedirect(
    "success",
    "/forgot-password",
    "Check your email for a link to reset your password.",
  );
};

export const resetPasswordAction = async (formData: FormData) => {
  const supabase = await createClient();

  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!password || !confirmPassword) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Password and confirm password are required",
    );
  }

  if (password !== confirmPassword) {
    encodedRedirect(
      "error",
      "/dashboard/reset-password",
      "Passwords do not match",
    );
  }

  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    encodedRedirect(
      "error",
      "/dashboard/reset-password",
      "Password update failed",
    );
  }

  encodedRedirect("success", "/protected/reset-password", "Password updated");
};

export const signOutAction = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect("/sign-in");
};

export const checkUserSubscription = async (userId: string) => {
  const supabase = await createClient();

  const { data: subscription, error } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", userId)
    .eq("status", "active")
    .single();

  if (error) {
    return false;
  }

  return !!subscription;
};

export const analyzeVideoAction = async (formData: FormData) => {
  const videoUrl = formData.get("videoUrl")?.toString();

  if (!videoUrl) {
    return {
      error: "Video URL is required",
    };
  }

  // Basic YouTube URL validation
  const youtubeRegex = /^(https?\:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/;
  if (!youtubeRegex.test(videoUrl)) {
    return {
      error: "Please enter a valid YouTube URL",
    };
  }

  // Simulate video analysis with mock data
  // In a real implementation, this would call YouTube API and perform NLP analysis
  await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate processing time

  const mockResults = {
    videoTitle: "How to Start a Successful Online Business in 2024",
    transcriptInsights: {
      duration: "12:34",
      wordCount: 1847,
      sentiment: "Positive",
      readabilityScore: 8.2,
    },
    keyThemes: [
      { theme: "E-commerce Strategy", confidence: 0.92, mentions: 15 },
      { theme: "Digital Marketing", confidence: 0.87, mentions: 12 },
      { theme: "Customer Acquisition", confidence: 0.83, mentions: 9 },
      { theme: "Revenue Optimization", confidence: 0.78, mentions: 7 },
    ],
    painPoints: [
      {
        painPoint: "Difficulty finding reliable suppliers",
        confidence: 0.89,
        context:
          "Many entrepreneurs struggle with supplier reliability and quality control",
      },
      {
        painPoint: "High customer acquisition costs",
        confidence: 0.85,
        context:
          "Rising advertising costs making it harder to acquire customers profitably",
      },
      {
        painPoint: "Inventory management complexity",
        confidence: 0.81,
        context: "Balancing stock levels while minimizing holding costs",
      },
    ],
    opportunities: [
      "Supplier verification services",
      "Cost-effective marketing automation tools",
      "AI-powered inventory management solutions",
    ],
  };

  return {
    success: true,
    results: mockResults,
  };
};
