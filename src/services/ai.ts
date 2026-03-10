import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function checkSymptoms(symptoms: string) {
  try {
    const model = "gemini-2.5-flash-preview";
    const prompt = `
      You are a medical AI assistant for APNA HOSPITAL.
      Based on the following symptoms provided by a patient, provide a preliminary assessment and recommendation.
      
      Symptoms: ${symptoms}
      
      Format your response as JSON with the following structure:
      {
        "possibleConditions": ["Condition 1", "Condition 2"],
        "recommendation": "See a doctor immediately / Monitor for 24 hours / etc.",
        "urgency": "High/Medium/Low",
        "advice": "General advice..."
      }
      
      Disclaimer: Always advise the user to consult a real doctor.
    `;

    const result = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });
    
    return JSON.parse(result.text || "{}");
  } catch (error) {
    console.error("AI Error:", error);
    throw new Error("Failed to analyze symptoms");
  }
}

export async function chatWithAI(message: string) {
  try {
    const model = "gemini-2.5-flash-preview";
    const prompt = `
      You are a helpful medical assistant for APNA HOSPITAL.
      Answer the following health query briefly and professionally.
      
      Query: ${message}
    `;

    const result = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });
    
    return result.text;
  } catch (error) {
    console.error("AI Chat Error:", error);
    throw new Error("Failed to get response");
  }
}
