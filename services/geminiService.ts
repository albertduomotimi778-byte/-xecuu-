import { GoogleGenAI, Type } from "@google/genai";

const apiKey = process.env.API_KEY || '';

// Initialize the client only when needed to ensure API key is present
const getAIClient = () => {
  if (!apiKey) {
    throw new Error("API Key is missing. Please check your environment variables.");
  }
  return new GoogleGenAI({ apiKey });
};

/**
 * Uses Gemini to break down a complex task into smaller, actionable subtasks.
 */
export const breakDownTask = async (taskDescription: string): Promise<string[]> => {
  try {
    const ai = getAIClient();
    
    // Using gemini-3-flash-preview for fast, responsive text generation
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Break down the following task into 3 to 5 concise, actionable checklist items. 
      Task: "${taskDescription}". 
      Return ONLY a JSON array of strings.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.STRING
          }
        },
        systemInstruction: "You are an expert project manager. Your goal is to simplify complex tasks into clear, professional, and actionable steps."
      }
    });

    const responseText = response.text;
    if (!responseText) {
      throw new Error("No response received from AI.");
    }

    const subtasks = JSON.parse(responseText) as string[];
    return subtasks;

  } catch (error) {
    console.error("Error breaking down task:", error);
    throw error;
  }
};