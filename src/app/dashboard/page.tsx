import DashboardNavbar from "@/components/dashboard-navbar";
import { createClient } from "../../../supabase/server";
import { redirect } from "next/navigation";
import { SubscriptionCheck } from "@/components/subscription-check";
import { 
  Youtube, 
  Brain, 
  TrendingUp, 
  Target, 
  BarChart3, 
  CheckCircle2, 
  FileText,
  Plus,
  ArrowUpRight 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { VideoAnalysis } from "@/components/video-analysis";

export default async function Dashboard() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  // Check if user has active subscription
  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", user.id)
    .eq("status", "active")
    .single();

  const hasSubscription = !!subscription;

  return (
    <>
      <DashboardNavbar />
      <main className="w-full min-h-screen bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4 py-8">
          {/* Header Section */}
          <header className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">YouTube Analysis Dashboard</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Transform YouTube content into actionable business insights with AI-powered analysis.
              Process videos to discover market trends, pain points, and opportunities.
            </p>
          </header>

          {/* Video Analysis Section */}
          <section id="analysis" className="mb-12">
            <VideoAnalysis 
              hasSubscription={hasSubscription}
              videosAnalyzedToday={0} // TODO: Track actual usage
              maxFreeVideos={3}
            />
          </section>

          {/* How It Works */}
          <section className="mb-12">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">How It Works</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Simple 3-step process to uncover market insights from YouTube content
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Youtube className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">1. Input YouTube URL</h3>
                <p className="text-gray-600">
                  Paste a YouTube video link into our analysis dashboard
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-pink-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Brain className="w-8 h-8 text-pink-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">2. AI Analysis</h3>
                <p className="text-gray-600">
                  Our NLP engine processes transcripts to identify patterns and insights
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">3. Get Insights</h3>
                <p className="text-gray-600">
                  View interactive results with trends, pain points, and opportunities
                </p>
              </div>
            </div>
          </section>

          {/* Features Grid */}
          <section className="mb-12">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">Analysis Features</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Comprehensive market intelligence from YouTube content
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {[
                {
                  icon: <Brain className="w-6 h-6" />,
                  title: "AI-Powered NLP",
                  description: "Advanced natural language processing and sentiment analysis",
                },
                {
                  icon: <TrendingUp className="w-6 h-6" />,
                  title: "Trend Detection",
                  description: "Identify emerging patterns and market opportunities",
                },
                {
                  icon: <Target className="w-6 h-6" />,
                  title: "Pain Point Analysis",
                  description: "Discover customer problems and unmet needs",
                },
                {
                  icon: <BarChart3 className="w-6 h-6" />,
                  title: "Market Insights",
                  description: "Actionable business intelligence and recommendations",
                },
                {
                  icon: <CheckCircle2 className="w-6 h-6" />,
                  title: "Confidence Scores",
                  description: "Reliability metrics for each insight and finding",
                },
                {
                  icon: <FileText className="w-6 h-6" />,
                  title: "Detailed Reports",
                  description: "Comprehensive analysis with exportable results",
                },
                {
                  icon: <TrendingUp className="w-6 h-6" />,
                  title: "Trend Validation",
                  description: "Cross-reference findings with market data",
                },
                {
                  icon: <Plus className="w-6 h-6" />,
                  title: "Batch Processing",
                  description: "Analyze multiple videos for deeper insights",
                },
              ].map((feature, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-4">
                      {feature.icon}
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                    <p className="text-gray-600 text-sm">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* CTA Section */}
          <section className="text-center">
            <Card className="max-w-2xl mx-auto bg-gradient-to-r from-purple-50 to-pink-50">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-4">Ready to Discover Market Opportunities?</h2>
                <p className="text-gray-600 mb-6">
                  Start analyzing YouTube content to uncover hidden market insights and business opportunities.
                </p>
                <a 
                  href="#analysis"
                  className="inline-flex items-center justify-center bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105"
                >
                  Start Your Analysis
                  <ArrowUpRight className="ml-2 w-4 h-4" />
                </a>
              </CardContent>
            </Card>
          </section>
        </div>
      </main>
    </>
  );
}
