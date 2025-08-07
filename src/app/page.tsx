import Hero from "@/components/hero";
import Navbar from "@/components/navbar";
import PricingCard from "@/components/pricing-card";
import Footer from "@/components/footer";
import { createClient } from "../../supabase/server";
import {
  ArrowUpRight,
  CheckCircle2,
  Youtube,
  TrendingUp,
  BarChart3,
  FileText,
  Brain,
  Target,
} from "lucide-react";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: plans, error } = await supabase.functions.invoke(
    "supabase-functions-get-plans",
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Navbar />
      <Hero />

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">
              Powerful Market Intelligence Features
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Transform YouTube content into actionable business insights with
              our AI-powered analysis platform.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Youtube className="w-6 h-6" />,
                title: "Batch Analysis",
                description: "Process 10-20 YouTube videos simultaneously",
              },
              {
                icon: <Brain className="w-6 h-6" />,
                title: "AI-Powered NLP",
                description: "Advanced natural language processing",
              },
              {
                icon: <TrendingUp className="w-6 h-6" />,
                title: "Trend Detection",
                description: "Identify patterns and market opportunities",
              },
              {
                icon: <Target className="w-6 h-6" />,
                title: "Pain Point Analysis",
                description: "Discover customer problems and needs",
              },
              {
                icon: <BarChart3 className="w-6 h-6" />,
                title: "Interactive Visualizations",
                description: "Beautiful charts and trend comparisons",
              },
              {
                icon: <CheckCircle2 className="w-6 h-6" />,
                title: "Confidence Scores",
                description: "Reliability metrics for each insight",
              },
              {
                icon: <TrendingUp className="w-6 h-6" />,
                title: "Google Trends Integration",
                description: "Validate findings with search data",
              },
              {
                icon: <FileText className="w-6 h-6" />,
                title: "Export Reports",
                description: "Download insights as PDF or CSV",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100"
              >
                <div className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">How VidTrend Works</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Simple 3-step process to uncover market insights from YouTube
              content
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Youtube className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                1. Input YouTube URLs
              </h3>
              <p className="text-gray-600">
                Paste 10-20 YouTube video links into our dashboard for batch
                analysis
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-pink-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Brain className="w-8 h-8 text-pink-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">2. AI Analysis</h3>
              <p className="text-gray-600">
                Our NLP engine processes transcripts to identify patterns and
                insights
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">3. Get Insights</h3>
              <p className="text-gray-600">
                View interactive results with trends, pain points, and export
                reports
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">10,000+</div>
              <div className="text-purple-100">Videos Analyzed</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="text-purple-100">Market Insights Found</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">95%</div>
              <div className="text-purple-100">Accuracy Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 bg-white" id="pricing">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Choose the perfect plan for your YouTube analysis needs. No hidden
              fees.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12 max-w-6xl mx-auto items-stretch">
            <div className="flex">
              <PricingCard
                key="free"
                item={{
                  id: "free",
                  name: "Free",
                  amount: 0,
                  interval: "forever",
                  popular: false,
                }}
                user={user}
              />
            </div>
            <div className="flex">
              <PricingCard
                key="weekly"
                item={{
                  id: "weekly",
                  name: "Weekly",
                  amount: 1999,
                  interval: "week",
                  popular: false,
                }}
                user={user}
              />
            </div>
            <div className="flex">
              <PricingCard
                key="monthly"
                item={{
                  id: "monthly",
                  name: "Monthly",
                  amount: 3999,
                  interval: "month",
                  popular: true,
                }}
                user={user}
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Discover Market Opportunities?
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Join entrepreneurs and product developers who are using VidTrend to
            uncover hidden market insights from YouTube content.
          </p>
          <a
            href="/dashboard"
            className="inline-flex items-center px-6 py-3 text-white bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105"
          >
            Start Your Analysis
            <ArrowUpRight className="ml-2 w-4 h-4" />
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
