import nlp from "compromise";
import { removeStopwords } from "stopword";

/**
 * Extracts significant keywords from a sentence using nouns, verbs, and noun phrases.
 * Applies lowercase normalization, stopword removal, and fallback for empty results.
 */
function extractKeywordsFromText(text) {
  if (!text || typeof text !== "string") return [];

  const doc = nlp(text);

  // Extract single words (nouns + verbs) and two-word noun phrases
  const nouns = doc.nouns().out("array");
  const verbs = doc.verbs().out("array");
  const nounPhrases = doc.nouns().terms(0).out("array"); // first term in noun phrases

  let terms = [...nouns, ...verbs, ...nounPhrases];

  // Clean up: lowercase, remove stopwords, dedupe, remove empty values
  const cleaned = removeStopwords(terms.map((w) => w.toLowerCase()));
  const deduped = [...new Set(cleaned)].filter(Boolean);

  return deduped.length > 0 ? deduped : ["response"];
}

/**
 * Processes an array of responses to extract top keywords with frequency counts.
 */
export function extractKeywordsFromResponses(responses) {
  const keywordCounts = {};

  responses.forEach((text) => {
    const keywords = extractKeywordsFromText(text);
    keywords.forEach((keyword) => {
      keywordCounts[keyword] = (keywordCounts[keyword] || 0) + 1;
    });
  });

  // Sort by frequency and return top 50
  return Object.entries(keywordCounts)
    .map(([value, count]) => ({ value, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 50);
}
