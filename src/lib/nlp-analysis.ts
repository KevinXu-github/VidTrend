export interface AnalysisResults {
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

export class NLPAnalysis {
  static analyzeTranscript(text: string, title: string, duration: string): AnalysisResults {
    const words = text.split(/\s+/).filter(word => word.length > 0);
    const wordCount = words.length;
    
    // Basic sentiment analysis
    const sentiment = this.analyzeSentiment(text);
    
    // Extract key themes
    const keyThemes = this.extractKeyThemes(text);
    
    // Identify pain points
    const painPoints = this.identifyPainPoints(text);
    
    // Generate opportunities
    const opportunities = this.generateOpportunities(text, keyThemes, painPoints);
    
    // Calculate readability score (simplified)
    const readabilityScore = this.calculateReadabilityScore(text);

    return {
      videoTitle: title,
      transcriptInsights: {
        duration,
        wordCount,
        sentiment,
        readabilityScore,
      },
      keyThemes,
      painPoints,
      opportunities,
    };
  }

  private static analyzeSentiment(text: string): string {
    const positiveWords = [
      'good', 'great', 'excellent', 'amazing', 'awesome', 'fantastic',
      'love', 'best', 'perfect', 'wonderful', 'brilliant', 'outstanding',
      'success', 'effective', 'efficient', 'valuable', 'beneficial'
    ];
    
    const negativeWords = [
      'bad', 'terrible', 'awful', 'horrible', 'hate', 'worst',
      'difficult', 'hard', 'problem', 'issue', 'struggle', 'challenge',
      'fail', 'failure', 'error', 'mistake', 'wrong', 'broken'
    ];

    const words = text.toLowerCase().split(/\s+/);
    const positiveCount = words.filter(word => positiveWords.includes(word)).length;
    const negativeCount = words.filter(word => negativeWords.includes(word)).length;

    if (positiveCount > negativeCount * 1.5) return 'Positive';
    if (negativeCount > positiveCount * 1.5) return 'Negative';
    return 'Neutral';
  }

  private static extractKeyThemes(text: string): Array<{theme: string, confidence: number, mentions: number}> {
    const themes = [
      { keywords: ['business', 'startup', 'entrepreneur', 'company'], theme: 'Business & Entrepreneurship' },
      { keywords: ['marketing', 'advertising', 'promotion', 'brand'], theme: 'Marketing & Branding' },
      { keywords: ['money', 'revenue', 'profit', 'income', 'sales'], theme: 'Revenue & Finance' },
      { keywords: ['customer', 'client', 'user', 'audience'], theme: 'Customer Relations' },
      { keywords: ['product', 'service', 'offering', 'solution'], theme: 'Product Development' },
      { keywords: ['technology', 'software', 'digital', 'online'], theme: 'Technology' },
      { keywords: ['growth', 'scale', 'expand', 'increase'], theme: 'Growth & Scaling' },
      { keywords: ['strategy', 'plan', 'approach', 'method'], theme: 'Strategy & Planning' },
    ];

    const words = text.toLowerCase().split(/\s+/);
    
    return themes
      .map(({ keywords, theme }) => {
        const mentions = keywords.reduce((count, keyword) => {
          return count + words.filter(word => word.includes(keyword)).length;
        }, 0);
        
        const confidence = Math.min(mentions / 20, 1); // Normalize to 0-1
        
        return { theme, confidence, mentions };
      })
      .filter(theme => theme.mentions > 0)
      .sort((a, b) => b.mentions - a.mentions)
      .slice(0, 5); // Top 5 themes
  }

  private static identifyPainPoints(text: string): Array<{painPoint: string, confidence: number, context: string}> {
    const painPointPatterns = [
      {
        keywords: ['expensive', 'cost', 'price', 'budget', 'afford'],
        painPoint: 'High costs and budget constraints',
        contexts: ['It\'s too expensive', 'Can\'t afford', 'Budget limitations']
      },
      {
        keywords: ['difficult', 'hard', 'complicated', 'complex', 'confusing'],
        painPoint: 'Complexity and difficulty',
        contexts: ['Too complicated to use', 'Difficult to understand', 'Hard to implement']
      },
      {
        keywords: ['time', 'slow', 'wait', 'delay', 'long'],
        painPoint: 'Time constraints and delays',
        contexts: ['Takes too long', 'Time consuming process', 'Delayed results']
      },
      {
        keywords: ['unreliable', 'inconsistent', 'unpredictable', 'unstable'],
        painPoint: 'Reliability and consistency issues',
        contexts: ['Inconsistent performance', 'Unreliable service', 'Unpredictable outcomes']
      },
      {
        keywords: ['support', 'help', 'customer service', 'assistance'],
        painPoint: 'Lack of adequate support',
        contexts: ['Poor customer support', 'No help available', 'Inadequate assistance']
      }
    ];

    const words = text.toLowerCase().split(/\s+/);
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    
    return painPointPatterns
      .map(({ keywords, painPoint, contexts }) => {
        const mentions = keywords.reduce((count, keyword) => {
          return count + words.filter(word => word.includes(keyword)).length;
        }, 0);
        
        const confidence = Math.min(mentions / 10, 0.95);
        const context = contexts[Math.floor(Math.random() * contexts.length)];
        
        return { painPoint, confidence, context };
      })
      .filter(pain => pain.confidence > 0.1)
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, 3); // Top 3 pain points
  }

  private static generateOpportunities(
    text: string, 
    themes: Array<{theme: string, confidence: number, mentions: number}>, 
    painPoints: Array<{painPoint: string, confidence: number, context: string}>
  ): string[] {
    const opportunities: string[] = [];
    
    // Generate opportunities based on pain points
    painPoints.forEach(pain => {
      if (pain.painPoint.includes('cost')) {
        opportunities.push('Cost-effective alternative solutions');
      }
      if (pain.painPoint.includes('complexity')) {
        opportunities.push('Simplified user-friendly tools');
      }
      if (pain.painPoint.includes('time')) {
        opportunities.push('Automation and time-saving solutions');
      }
      if (pain.painPoint.includes('reliability')) {
        opportunities.push('More reliable and consistent services');
      }
      if (pain.painPoint.includes('support')) {
        opportunities.push('Enhanced customer support systems');
      }
    });

    // Generate opportunities based on themes
    themes.forEach(theme => {
      if (theme.theme.includes('Marketing')) {
        opportunities.push('Advanced marketing analytics tools');
      }
      if (theme.theme.includes('Business')) {
        opportunities.push('Business process optimization services');
      }
      if (theme.theme.includes('Technology')) {
        opportunities.push('Innovative technology solutions');
      }
    });

    // Remove duplicates and limit to 5
    return [...new Set(opportunities)].slice(0, 5);
  }

  private static calculateReadabilityScore(text: string): number {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const words = text.split(/\s+/).filter(word => word.length > 0);
    const syllables = words.reduce((count, word) => count + this.countSyllables(word), 0);

    if (sentences.length === 0 || words.length === 0) return 0;

    // Simplified Flesch Reading Ease formula
    const avgSentenceLength = words.length / sentences.length;
    const avgSyllablesPerWord = syllables / words.length;
    
    const score = 206.835 - (1.015 * avgSentenceLength) - (84.6 * avgSyllablesPerWord);
    
    // Convert to 0-10 scale
    return Math.max(0, Math.min(10, score / 10));
  }

  private static countSyllables(word: string): number {
    word = word.toLowerCase();
    if (word.length <= 3) return 1;
    
    const vowels = word.match(/[aeiouy]+/g);
    let syllableCount = vowels ? vowels.length : 1;
    
    // Adjust for silent 'e'
    if (word.endsWith('e')) syllableCount--;
    
    return Math.max(1, syllableCount);
  }
}