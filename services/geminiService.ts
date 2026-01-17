
import { GoogleGenAI, Type } from "@google/genai";
import { AIJobResponse } from "../types";

export const generateJobContent = async (input: string): Promise<{ data: AIJobResponse, sources: any[] }> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    TASK: Generate a professional "Sarkari Result" style job post in HINDI.
    JOB NAME/INPUT: "${input}".
    
    CONTENT LENGTH REQUIREMENTS (STRICT):
    - shortDescription: Minimum 250 words to 500 words in Hindi. Summarize the importance and context.
    - howToApply: Minimum 300 words to 1000 words in Hindi. Provide a detailed step-by-step guide (Registration, Form Fill, Payment, Print).
    - vacancyDetails: Minimum 400 words to 1000 words in Hindi. Break down posts by category, department, and salary.
    - eligibility: Detailed educational requirements in Hindi.
    
    URL SEARCH (MANDATORY):
    - Use Google Search to find the ACTUAL LATEST links for "${input}".
    - applyOnlineLink: The real URL to the application portal.
    - notificationLink: The direct URL to the official PDF/Notification.
    - officialWebsiteLink: The main department/official website.

    JSON RESPONSE FORMAT:
    {
      "title": "Hindi Title",
      "shortDescription": "250-500 words Hindi content",
      "importantDates": "Dates details",
      "applicationFee": "Fee details",
      "ageLimit": "Age details",
      "vacancyDetails": "400-1000 words details in Hindi",
      "eligibility": "Eligibility details",
      "howToApply": "300-1000 words step-by-step Hindi guide",
      "applyOnlineLink": "URL string",
      "notificationLink": "URL string",
      "officialWebsiteLink": "URL string"
    }
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: prompt,
    config: {
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      maxOutputTokens: 25000, 
      thinkingConfig: { thinkingBudget: 10000 },
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          shortDescription: { type: Type.STRING },
          importantDates: { type: Type.STRING },
          applicationFee: { type: Type.STRING },
          ageLimit: { type: Type.STRING },
          vacancyDetails: { type: Type.STRING },
          eligibility: { type: Type.STRING },
          howToApply: { type: Type.STRING },
          applyOnlineLink: { type: Type.STRING },
          notificationLink: { type: Type.STRING },
          officialWebsiteLink: { type: Type.STRING }
        },
        required: ["title", "shortDescription", "importantDates", "applicationFee", "ageLimit", "vacancyDetails", "eligibility", "howToApply", "applyOnlineLink", "notificationLink", "officialWebsiteLink"]
      }
    },
  });

  const text = response.text || "{}";
  const data = JSON.parse(text) as AIJobResponse;
  const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

  return { data, sources };
};
