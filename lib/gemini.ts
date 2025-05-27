import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || "AIzaSyC-if6ei1E11uPPPs2JOAmfquSXCHPMtCo");

// Helper function to add delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Helper function to retry failed requests
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  initialDelay: number = 1000
): Promise<T> {
  let retries = 0;
  while (true) {
    try {
      return await fn();
    } catch (error: any) {
      if (retries >= maxRetries || !error?.message?.includes("503")) {
        throw error;
      }
      const delayTime = initialDelay * Math.pow(2, retries);
      console.log(`Retry ${retries + 1}/${maxRetries} after ${delayTime}ms...`);
      await delay(delayTime);
      retries++;
    }
  }
}

// Helper function to extract JSON from markdown-formatted text
function extractJsonFromResponse(text: string): any {
  try {
    // If the response is wrapped in markdown code blocks, extract the JSON
    const jsonMatch = text.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
    if (jsonMatch && jsonMatch[1]) {
      return JSON.parse(jsonMatch[1]);
    }
    // If no markdown, try parsing the text directly
    return JSON.parse(text);
  } catch (error) {
    console.error("Error parsing JSON response:", text);
    throw new Error("Failed to parse API response");
  }
}

export async function analyzeFood(imageBase64: string) {
  return retryWithBackoff(async () => {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
      
      const prompt = `Analyze this food image and provide the following information in JSON format (respond with ONLY the JSON, no markdown or other text):
      {
        "foodName": "name of the food",
        "calories": "estimated calories",
        "protein": "protein content in grams",
        "fat": "fat content in grams",
        "carbs": "carbohydrate content in grams",
        "servingSize": "estimated serving size",
        "confidence": "confidence score between 0 and 1"
      }`;

      const result = await model.generateContent([
        prompt,
        {
          inlineData: {
            mimeType: "image/jpeg",
            data: imageBase64.split(",")[1]
          }
        }
      ]);

      const response = await result.response;
      const text = response.text();
      return extractJsonFromResponse(text);
    } catch (error) {
      console.error("Error analyzing food:", error);
      throw error;
    }
  });
}

export async function getFoodRecommendations(userProfile: any, goal: string, activityLevel: string) {
  return retryWithBackoff(async () => {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

      const prompt = `As a fitness nutrition expert, provide personalized food recommendations based on the following profile (respond with ONLY the JSON, no markdown or other text):
      - Gender: ${userProfile.gender}
      - Height: ${userProfile.heightCm}cm
      - Weight: ${userProfile.currentWeightKg}kg
      - Fitness Goal: ${goal}
      - Activity Level: ${activityLevel}

      Provide 3 food recommendations in the following JSON format:
      {
        "recommendations": [
          {
            "name": "food name",
            "category": "Breakfast/Lunch/Dinner/Snack",
            "calories": number,
            "protein": "protein in grams",
            "carbs": "carbs in grams",
            "fat": "fat in grams",
            "benefits": ["benefit1", "benefit2", "benefit3"],
            "bestTime": "best time to consume",
            "servingSize": "recommended serving size",
            "difficulty": "Easy/Medium/Hard",
            "prepTime": "preparation time",
            "rating": number between 1-5
          }
        ]
      }`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      return extractJsonFromResponse(text);
    } catch (error) {
      console.error("Error getting food recommendations:", error);
      throw error;
    }
  });
} 