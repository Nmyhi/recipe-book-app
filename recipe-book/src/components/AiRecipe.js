import { useState } from 'react';
import '../AiRecipe.css';

function AiRecipe() {
  const [userPrompt, setUserPrompt] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [lastRequestTime, setLastRequestTime] = useState(0);

  const canRequest = () => {
    return Date.now() - lastRequestTime > 60 * 1000;
  };

  const fetchSuggestions = async () => {
    if (loading || !canRequest()) {
      setError("Rate limit hit. Please wait a minute and try again.");
      return;
    }
    setLastRequestTime(Date.now());
    setLoading(true);
    setSuggestions([]);
    setSelectedRecipe(null);
    setError('');

    console.log("Sending request to OpenAI (suggestions):", {
      key: process.env.REACT_APP_OPENAI_API_KEY?.slice(0, 10),
      prompt: userPrompt
    });

    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "user",
              content: `Suggest 5 unique recipe names based on: ${userPrompt}. Reply with just the list.`
            }
          ],
          max_tokens: 200
        })
      });
      const responseText = await response.text();
      console.log("Response raw text (suggestions):", responseText);
      const data = JSON.parse(responseText);
      const text = data.choices?.[0]?.message?.content || '';
      const list = text.split('\n').filter(line => line.trim()).map(line => line.replace(/^\d+\.\s*/, ''));
      setSuggestions(list);
    } catch (err) {
      setError("Failed to fetch recipe suggestions.");
    } finally {
      setLoading(false);
    }
  };

  const fetchRecipeDetails = async (title) => {
    if (loading || !canRequest()) {
      setError("Rate limit hit. Please wait a minute and try again.");
      return;
    }
    setLastRequestTime(Date.now());
    setLoading(true);
    setSelectedRecipe(null);
    setError('');

    console.log("Sending request to OpenAI (details):", {
      key: process.env.REACT_APP_OPENAI_API_KEY?.slice(0, 10),
      prompt: title
    });

    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "user",
              content: `Give me a detailed recipe for ${title}. Include ingredients and step-by-step instructions.`
            }
          ],
          max_tokens: 600
        })
      });
      const responseText = await response.text();
      console.log("Response raw text (details):", responseText);
      const data = JSON.parse(responseText);
      setSelectedRecipe(data.choices?.[0]?.message?.content || '');
    } catch (err) {
      setError("Failed to fetch recipe details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ai-recipe-container">
      <h2>AI Recipe Finder</h2>
      <textarea
        rows={3}
        value={userPrompt}
        onChange={(e) => setUserPrompt(e.target.value)}
        placeholder="What kind of dish or ingredients are you interested in?"
      />
      <button onClick={fetchSuggestions} disabled={loading || !userPrompt.trim()}>
        {loading ? "Loading..." : "Get Suggestions"}
      </button>

      {error && <p className="error">{error}</p>}

      {suggestions.length > 0 && (
        <ul className="suggestions">
          {suggestions.map((s, i) => (
            <li key={i}>
              <button onClick={() => fetchRecipeDetails(s)}>{s}</button>
            </li>
          ))}
        </ul>
      )}

      {selectedRecipe && (
        <pre className="recipe-output">{selectedRecipe}</pre>
      )}
    </div>
  );
}

export default AiRecipe;
