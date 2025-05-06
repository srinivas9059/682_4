import Sentiment from "sentiment";

// Function to analyze sentiment of a given text
export function analyzeSentiment(text) {
  const sentiment = new Sentiment();
  const result = sentiment.analyze(text);
  return result.score; // Returns a sentiment score (-ve = negative, +ve = positive)
}

// Function to extract keywords from text
export function extractKeywords(text) {
  const words = text.split(/\s+/);
  const wordFrequencies = words.reduce((acc, word) => {
    word = word.toLowerCase();
    acc[word] = (acc[word] || 0) + 1;
    return acc;
  }, {});

  return Object.entries(wordFrequencies)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([word]) => word); // Returns top 10 frequent words
}
