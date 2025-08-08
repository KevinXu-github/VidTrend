"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  Youtube, 
  Brain, 
  TrendingUp, 
  Target, 
  BarChart3, 
  CheckCircle2, 
  AlertCircle,
  Clock,
  FileText
} from "lucide-react";
import { analyzeVideoAction } from "@/app/actions";

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

interface VideoAnalysisProps {
  hasSubscription?: boolean;
  videosAnalyzedToday?: number;
  maxFreeVideos?: number;
}

export function VideoAnalysis({ 
  hasSubscription = false, 
  videosAnalyzedToday = 0, 
  maxFreeVideos = 3 
}: VideoAnalysisProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<AnalysisResults | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const canAnalyze = hasSubscription || videosAnalyzedToday < maxFreeVideos;
  const remainingFreeAnalyses = maxFreeVideos - videosAnalyzedToday;

  const handleSubmit = async (formData: FormData) => {
    if (!canAnalyze) {
      setError("You've reached your daily limit of free video analyses. Please upgrade to continue.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setResults(null);

    try {
      const result = await analyzeVideoAction(formData);
      
      if (result.error) {
        setError(result.error);
      } else if (result.success && result.results) {
        setResults(result.results);
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment.toLowerCase()) {
      case 'positive': return 'bg-green-500';
      case 'negative': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.7) return 'text-green-600';
    if (confidence >= 0.4) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-8">
      {/* Analysis Form */}
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Youtube className="w-6 h-6 text-red-600" />
            Analyze YouTube Videos
          </CardTitle>
          <CardDescription>
            Enter YouTube URLs to analyze content for market insights and trends
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Usage Indicator */}
          {!hasSubscription && (
            <div className="mb-4 p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Free Tier</p>
                  <p className="text-xs text-gray-600">
                    {remainingFreeAnalyses} of {maxFreeVideos} free analyses remaining today
                  </p>
                </div>
                <a 
                  href="/pricing" 
                  className="text-xs bg-gradient-to-r from-purple-600 to-pink-600 text-white px-3 py-1 rounded-full hover:from-purple-700 hover:to-pink-700 transition-all"
                >
                  Upgrade
                </a>
              </div>
            </div>
          )}
          
          <form action={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="videoUrl" className="block text-sm font-medium mb-2">
                YouTube Video URL
              </label>
              <Input
                id="videoUrl"
                name="videoUrl"
                type="url"
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full"
                required
                disabled={isLoading || !canAnalyze}
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50"
              disabled={isLoading || !canAnalyze}
            >
              {!canAnalyze ? (
                "Upgrade to Analyze More Videos"
              ) : isLoading ? (
                <>
                  <Brain className="w-4 h-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Brain className="w-4 h-4 mr-2" />
                  Analyze Video
                </>
              )}
            </Button>
            
            {!canAnalyze && (
              <p className="text-center text-sm text-gray-600">
                You've used all your free analyses today. 
                <a href="/pricing" className="text-purple-600 hover:underline ml-1">
                  Upgrade for unlimited access
                </a>
              </p>
            )}
          </form>
        </CardContent>
      </Card>

      {/* Error Display */}
      {error && (
        <Card className="max-w-4xl mx-auto border-red-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 text-red-600">
              <AlertCircle className="w-5 h-5" />
              <p className="font-medium">Analysis Failed</p>
            </div>
            <p className="text-red-600 mt-2">{error}</p>
            {error.includes("daily limit") && (
              <div className="mt-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border">
                <h4 className="font-medium mb-2">Unlock Unlimited Analysis</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Get unlimited video analysis, batch processing, and advanced insights with our premium plans.
                </p>
                <a 
                  href="/pricing" 
                  className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all text-sm"
                >
                  View Pricing Plans
                </a>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Results Display */}
      {results && (
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Video Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Youtube className="w-6 h-6 text-red-600" />
                Video Analysis Results
              </CardTitle>
              <CardDescription className="text-lg font-medium">
                {results.videoTitle}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <Clock className="w-8 h-8 mx-auto text-blue-600 mb-2" />
                  <p className="text-sm text-gray-600">Duration</p>
                  <p className="font-semibold">{results.transcriptInsights.duration}</p>
                </div>
                <div className="text-center">
                  <FileText className="w-8 h-8 mx-auto text-green-600 mb-2" />
                  <p className="text-sm text-gray-600">Word Count</p>
                  <p className="font-semibold">{results.transcriptInsights.wordCount.toLocaleString()}</p>
                </div>
                <div className="text-center">
                  <BarChart3 className="w-8 h-8 mx-auto text-purple-600 mb-2" />
                  <p className="text-sm text-gray-600">Readability Score</p>
                  <p className="font-semibold">{results.transcriptInsights.readabilityScore.toFixed(1)}/10</p>
                </div>
                <div className="text-center">
                  <div className={`w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center ${getSentimentColor(results.transcriptInsights.sentiment)}`}>
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  </div>
                  <p className="text-sm text-gray-600">Sentiment</p>
                  <p className="font-semibold">{results.transcriptInsights.sentiment}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Key Themes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-blue-600" />
                Key Themes
              </CardTitle>
              <CardDescription>
                Main topics and themes identified in the video content
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {results.keyThemes.map((theme, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium">{theme.theme}</h4>
                      <p className="text-sm text-gray-600">{theme.mentions} mentions</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Progress value={theme.confidence * 100} className="w-20" />
                      <span className={`text-sm font-medium ${getConfidenceColor(theme.confidence)}`}>
                        {Math.round(theme.confidence * 100)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Pain Points */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-6 h-6 text-red-600" />
                Pain Points Identified
              </CardTitle>
              <CardDescription>
                Customer problems and challenges mentioned in the content
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {results.painPoints.map((pain, index) => (
                  <div key={index} className="p-4 border border-red-200 rounded-lg bg-red-50">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-red-900">{pain.painPoint}</h4>
                      <Badge variant="outline" className={getConfidenceColor(pain.confidence)}>
                        {Math.round(pain.confidence * 100)}% confidence
                      </Badge>
                    </div>
                    <p className="text-sm text-red-700 italic">"{pain.context}"</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Opportunities */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
                Market Opportunities
              </CardTitle>
              <CardDescription>
                Potential business opportunities based on the analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                {results.opportunities.map((opportunity, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <p className="text-green-900">{opportunity}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}