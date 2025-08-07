"use client";

import Link from "next/link";
import {
  ArrowUpRight,
  Check,
  TrendingUp,
  Youtube,
  Play,
  Loader2,
  BarChart3,
  AlertCircle,
  Target,
} from "lucide-react";
import { useState } from "react";
import { analyzeVideoAction } from "@/app/actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormMessage } from "@/components/form-message";

interface AnalysisResults {
  videoTitle: string;
  transcriptInsights: {
    duration: string;
    wordCount: number;
    sentiment: string;
    readabilityScore: number;
  };
  keyThemes: Array<{
    theme: string;
    confidence: number;
    mentions: number;
  }>;
  painPoints: Array<{
    painPoint: string;
    confidence: number;
    context: string;
  }>;
  opportunities: string[];
}

export default function Hero() {
  const [videoUrl, setVideoUrl] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<AnalysisResults | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAnalyzing(true);
    setError(null);
    setResults(null);

    const formData = new FormData();
    formData.append("videoUrl", videoUrl);

    try {
      const result = await analyzeVideoAction(formData);

      if (result.error) {
        setError(result.error);
      } else if (result.success && result.results) {
        setResults(result.results);
      }
    } catch (err) {
      setError(
        "An error occurred while analyzing the video. Please try again.",
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="relative overflow-hidden bg-white">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-50 via-white to-orange-50 opacity-70" />

      <div className="relative pt-24 pb-16 sm:pt-32 sm:pb-24">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex items-center justify-center gap-2 mb-6">
              <Youtube className="w-8 h-8 text-red-600" />
              <TrendingUp className="w-8 h-8 text-orange-600" />
            </div>

            <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-8 tracking-tight">
              Uncover{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-600">
                Market Trends
              </span>{" "}
              from YouTube Videos
            </h1>

            <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
              VidTrend analyzes YouTube video transcripts to reveal hidden
              market opportunities, pain points, and demand signals for
              entrepreneurs and product developers.
            </p>

            {/* Instant Demo Section */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 mb-12 max-w-3xl mx-auto">
              <div className="flex items-center gap-2 mb-6">
                <Play className="w-6 h-6 text-red-600" />
                <h2 className="text-2xl font-bold text-gray-900">
                  Try It Now - Free Demo
                </h2>
              </div>

              <form onSubmit={handleAnalyze} className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <Input
                    type="url"
                    placeholder="Paste a YouTube URL here to see instant analysis"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    className="flex-1 h-12 text-lg"
                    disabled={isAnalyzing}
                  />
                  <Button
                    type="submit"
                    disabled={isAnalyzing || !videoUrl.trim()}
                    className="h-12 px-8 bg-red-600 hover:bg-red-700 text-white font-semibold"
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <BarChart3 className="w-5 h-5 mr-2" />
                        Analyze Video
                      </>
                    )}
                  </Button>
                </div>
              </form>

              {error && (
                <div className="mt-4">
                  <FormMessage message={{ error }} />
                </div>
              )}

              {results && (
                <div className="mt-8 space-y-6">
                  <div className="text-left">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                      Analysis Results
                    </h3>
                    <p className="text-lg font-medium text-gray-700 mb-6">
                      {results.videoTitle}
                    </p>

                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Transcript Insights */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Youtube className="w-5 h-5 text-red-600" />
                            Transcript Insights
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Duration:</span>
                            <span className="font-medium">
                              {results.transcriptInsights.duration}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Word Count:</span>
                            <span className="font-medium">
                              {results.transcriptInsights.wordCount.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Sentiment:</span>
                            <span className="font-medium text-green-600">
                              {results.transcriptInsights.sentiment}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Readability:</span>
                            <span className="font-medium">
                              {results.transcriptInsights.readabilityScore}/10
                            </span>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Key Themes */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-orange-600" />
                            Key Themes
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          {results.keyThemes.map((theme, index) => (
                            <div key={index} className="space-y-1">
                              <div className="flex justify-between items-center">
                                <span className="font-medium">
                                  {theme.theme}
                                </span>
                                <span className="text-sm text-gray-500">
                                  {Math.round(theme.confidence * 100)}%
                                </span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-orange-600 h-2 rounded-full"
                                  style={{
                                    width: `${theme.confidence * 100}%`,
                                  }}
                                ></div>
                              </div>
                            </div>
                          ))}
                        </CardContent>
                      </Card>
                    </div>

                    {/* Pain Points */}
                    <Card className="mt-6">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <AlertCircle className="w-5 h-5 text-red-600" />
                          Pain Points Identified
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {results.painPoints.map((pain, index) => (
                          <div
                            key={index}
                            className="border-l-4 border-red-200 pl-4"
                          >
                            <div className="flex justify-between items-start mb-1">
                              <h4 className="font-medium text-gray-900">
                                {pain.painPoint}
                              </h4>
                              <span className="text-sm text-gray-500 ml-2">
                                {Math.round(pain.confidence * 100)}% confidence
                              </span>
                            </div>
                            <p className="text-sm text-gray-600">
                              {pain.context}
                            </p>
                          </div>
                        ))}
                      </CardContent>
                    </Card>

                    {/* Opportunities */}
                    <Card className="mt-6">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Target className="w-5 h-5 text-green-600" />
                          Market Opportunities
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {results.opportunities.map((opportunity, index) => (
                            <li key={index} className="flex items-center gap-2">
                              <Check className="w-4 h-4 text-green-500" />
                              <span>{opportunity}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Call to Action */}
                  <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-6 text-center">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      Want to analyze multiple videos for trends?
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Unlock bulk analysis, trend comparison, and advanced
                      insights with our paid plans.
                    </p>
                    <Link
                      href="#pricing"
                      className="inline-flex items-center px-6 py-3 text-white bg-gradient-to-r from-red-600 to-orange-600 rounded-lg hover:from-red-700 hover:to-orange-700 transition-all duration-300 transform hover:scale-105 font-medium"
                    >
                      Sign up for bulk analysis
                      <ArrowUpRight className="ml-2 w-4 h-4" />
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <Link
                href="/dashboard"
                className="inline-flex items-center px-8 py-4 text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors text-lg font-medium"
              >
                Start Full Analysis
                <ArrowUpRight className="ml-2 w-5 h-5" />
              </Link>

              <Link
                href="#pricing"
                className="inline-flex items-center px-8 py-4 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-lg font-medium"
              >
                View Pricing
              </Link>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-500" />
                <span>Analyze 10-20 videos at once</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-500" />
                <span>AI-powered insights</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-500" />
                <span>Export reports (PDF/CSV)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
