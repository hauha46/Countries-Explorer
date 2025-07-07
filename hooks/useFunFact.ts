import { useState } from 'react';
import { Country } from '../types/country';

// In a real app, this would call an actual LLM API with your API key
// For demo purposes, we'll simulate the LLM response with interesting facts about countries
export const useFunFact = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const getFunFact = async (country: Country): Promise<string> => {
    setLoading(true);
    setError(null);

    try {
      // Simulate API call latency
      await new Promise(resolve => setTimeout(resolve, 1000));

      // In a real implementation, you would call the OpenAI API here:
      // const response = await fetch('https://api.openai.com/v1/completions', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      //   },
      //   body: JSON.stringify({
      //     model: "gpt-3.5-turbo-instruct",
      //     prompt: `Tell me one interesting fact about ${country.name.common} in a single sentence.`,
      //     max_tokens: 100
      //   })
      // });
      // const data = await response.json();
      // return data.choices[0].text.trim();

      // For demo purposes, return a pre-defined fun fact based on region
      const funFacts: Record<string, string[]> = {
        Africa: [
          `${country.name.common} is home to some of the world's most diverse wildlife and ecosystems.`,
          `${country.name.common} has one of the youngest populations in the world, with a median age under 20.`,
        ],
        Americas: [
          `${country.name.common} contains some of the world's largest freshwater reserves.`,
          `${country.name.common} has one of the most biodiverse ecosystems on the planet.`,
        ],
        Asia: [
          `${country.name.common} has some of the world's oldest continuous civilizations.`,
          `${country.name.common} is known for its rich culinary traditions that date back thousands of years.`,
        ],
        Europe: [
          `${country.name.common} has some of the world's oldest universities and academic institutions.`,
          `${country.name.common} has a rich history of art, music, and literature that has influenced global culture.`,
        ],
        Oceania: [
          `${country.name.common} has some of the world's most unique endemic species due to its geographical isolation.`,
          `${country.name.common} has some of the world's most pristine marine ecosystems and coral reefs.`,
        ],
      };

      const regionFacts = funFacts[country.region] || funFacts.Europe;
      const randomIndex = Math.floor(Math.random() * regionFacts.length);
      
      return regionFacts[randomIndex];
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch fun fact';
      setError(errorMessage);
      return 'Could not load a fun fact at this time.';
    } finally {
      setLoading(false);
    }
  };

  return {
    getFunFact,
    loading,
    error,
  };
};
