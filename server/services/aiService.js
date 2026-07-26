/**
 * @desc    Analyze sentiment of testimonial text using Google Gemini API or fallback heuristic
 * @param   {string} text - The testimonial text to analyze
 * @param   {number} rating - Star rating (1-5) as secondary indicator for fallback
 * @returns {Promise<string>} 'Positive', 'Neutral', 'Negative', or 'Unknown'
 */
const analyzeSentiment = async (text, rating = 3) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;

    // 1. Attempt Gemini API analysis if key is configured
    if (apiKey && apiKey.trim() !== '' && apiKey !== 'your_gemini_api_key_here') {
      try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `Analyze the sentiment of the following customer review. Reply with EXACTLY one word: Positive, Neutral, or Negative.\n\nReview: "${text}"`
              }]
            }],
            generationConfig: {
              temperature: 0.1,
              maxOutputTokens: 10
            }
          })
        });

        if (response.ok) {
          const data = await response.json();
          const aiOutput = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim()?.toLowerCase() || '';
          if (aiOutput.includes('positive')) return 'Positive';
          if (aiOutput.includes('negative')) return 'Negative';
          if (aiOutput.includes('neutral')) return 'Neutral';
        }
      } catch (apiError) {
        console.warn('[AI Service] Gemini API call failed or timed out. Falling back to local heuristic:', apiError.message);
      }
    }

    // 2. Reliable local heuristic fallback when offline or API key is absent
    const lowerText = (text || '').toLowerCase();
    
    const positiveWords = ['great', 'good', 'love', 'loved', 'awesome', 'excellent', 'best', 'amazing', 'perfect', 'super', 'wonderful', 'fast', 'easy', 'recommend', 'happy', 'pleased', 'valuable', 'fantastic', 'thanks', 'thank you', 'helpful'];
    const negativeWords = ['bad', 'worst', 'terrible', 'hate', 'hated', 'slow', 'poor', 'broken', 'awful', 'disappointed', 'useless', 'difficult', 'hard', 'buggy', 'error', 'never', 'waste'];

    let posCount = 0;
    let negCount = 0;

    positiveWords.forEach(word => {
      if (lowerText.includes(word)) posCount++;
    });

    negativeWords.forEach(word => {
      if (lowerText.includes(word)) negCount++;
    });

    if (posCount > negCount || rating >= 4) {
      return 'Positive';
    } else if (negCount > posCount || rating <= 2) {
      return 'Negative';
    } else {
      return 'Neutral';
    }
  } catch (error) {
    console.error('[AI Service - Fatal Error]:', error);
    return 'Unknown';
  }
};

module.exports = {
  analyzeSentiment
};
