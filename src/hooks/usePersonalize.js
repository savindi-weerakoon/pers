import { useState, useCallback } from 'react';

/**
 * Custom hook for personalizing content using the adaptive UI API
 * @param {Object} options - Configuration options
 * @param {string} options.apiUrl - API endpoint URL (defaults to the provided URL)
 * @returns {Object} - Hook state and methods
 */
export function usePersonalize(options = {}) {
  const { apiUrl = "https://savindiweerakoon-adaptive-ui-api.hf.space/personalize" } = options;
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [personalizedHtml, setPersonalizedHtml] = useState("");
  const [spec, setSpec] = useState(null);

  /**
   * Personalize content with cognitive scores
   * @param {Object} params - Personalization parameters
   * @param {string} params.rawHtml - Raw HTML content to personalize
   * @param {number} params.digitSpanScore - Digit span test score
   * @param {number} params.averageFocusLevel - Average focus level
   * @param {number} params.cognitiveLoadScore - Cognitive load score
   * @returns {Promise<Object>} - Response data with spec and personalized_html
   */
  const personalize = useCallback(async ({
    rawHtml,
    digitSpanScore,
    averageFocusLevel,
    cognitiveLoadScore
  }) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          raw_html: rawHtml,
          digitSpanScore,
          averageFocusLevel,
          cognitiveLoadScore
        })
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      // Update state with response data
      setPersonalizedHtml(data.personalized_html || "");
      setSpec(data.spec || null);
      
      return data;
    } catch (err) {
      const errorMessage = err.message || "Failed to personalize content";
      setError(errorMessage);
      console.error("Personalization error:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiUrl]);

  /**
   * Reset the hook state
   */
  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
    setPersonalizedHtml("");
    setSpec(null);
  }, []);

  return {
    loading,
    error,
    personalizedHtml,
    spec,
    personalize,
    reset
  };
}

export default usePersonalize;
