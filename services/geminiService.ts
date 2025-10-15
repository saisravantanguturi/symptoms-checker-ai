
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from '../types';

// API key is handled by environment variables.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
const model = 'gemini-2.5-flash';

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    riskLevel: { 
      type: Type.STRING, 
      enum: ['Low', 'Medium', 'High', 'Critical'],
      description: 'Overall risk assessment based on symptoms.'
    },
    symptomSeverity: {
      type: Type.ARRAY,
      description: 'Analysis of each symptom provided by the user.',
      items: {
        type: Type.OBJECT,
        properties: {
          symptom: { type: Type.STRING },
          severity: { type: Type.STRING, enum: ['Mild', 'Moderate', 'Severe'] }
        },
        required: ['symptom', 'severity']
      }
    },
    possibleConditions: {
      type: Type.ARRAY,
      description: 'List of potential health conditions with likelihood.',
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          probability: { type: Type.INTEGER, description: 'Estimated likelihood percentage (e.g., 70 for 70%).' },
          description: { type: Type.STRING, description: 'A brief, easy-to-understand explanation.' }
        },
        required: ['name', 'probability', 'description']
      }
    },
    emergencyAlert: { 
      type: Type.STRING, 
      description: 'A clear, urgent message if critical symptoms (e.g., chest pain, difficulty breathing) are detected. Should be null otherwise.' 
    },
    lifestyleTips: {
      type: Type.ARRAY,
      description: 'Actionable, safe self-care and first-aid advice. Do not mention specific medications.',
      items: { type: Type.STRING }
    },
    clarificationQuestions: {
      type: Type.ARRAY,
      description: 'If user input is vague, provide questions to get more specific details. If input is clear, this should be an empty array.',
      items: { type: Type.STRING }
    },
    healthTip: { 
      type: Type.STRING, 
      description: 'A single, relevant health tip or a suggestion to read a related article.' 
    },
    disclaimer: {
        type: Type.STRING,
        description: 'The mandatory disclaimer that this is not a medical diagnosis.'
    }
  },
  required: ['riskLevel', 'disclaimer']
};


export const getSymptomAnalysis = async (symptoms: string): Promise<AnalysisResult> => {
  const systemInstruction = `You are an advanced Healthcare Symptom Checker AI. Your role is to provide a structured, informational analysis of user-provided symptoms based on the provided JSON schema. You are NOT a medical professional.

Core Rules:
1.  **Emergency First:** If symptoms like "chest pain," "difficulty breathing," "severe bleeding," or "sudden confusion" are mentioned, set 'riskLevel' to "Critical" and 'emergencyAlert' to "Seek immediate medical attention! These symptoms could indicate a life-threatening condition."
2.  **Severity Analysis:** The user provides symptoms with a severity rating ('Mild', 'Moderate', 'Severe'). Use this as the primary factor. Your 'symptomSeverity' response should reflect the user's input.
3.  **Risk Assessment:** Determine the 'riskLevel' ('Low', 'Medium', 'High') based on the combination and severity of symptoms.
4.  **Probabilities:** Provide 'possibleConditions' with an estimated 'probability'. The sum does not need to equal 100.
5.  **Safe Advice:** 'lifestyleTips' must be safe, general advice (e.g., "Stay hydrated," "Get plenty of rest"). NEVER suggest specific medications.
6.  **Vague Input:** If symptoms are unclear (e.g., "I feel sick"), populate 'clarificationQuestions' and provide minimal other data.
7.  **Disclaimer:** Always include the standard disclaimer.
8.  **Language:** Interpret symptoms in any language, but the JSON response must be in English.
`;
  
  const prompt = `Analyze the following symptoms: "${symptoms}"`;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      systemInstruction: systemInstruction,
      config: {
          temperature: 0.2,
          responseMimeType: "application/json",
          responseSchema: responseSchema,
      }
    });
    // The response text is expected to be a JSON string.
    return JSON.parse(response.text) as AnalysisResult;
  } catch (error) {
    console.error("Error calling Gemini API or parsing JSON:", error);
    // Create a user-friendly error structure
    const errorResult: AnalysisResult = {
        riskLevel: 'Medium',
        disclaimer: 'This information is for awareness only. Please consult a licensed healthcare professional for an accurate diagnosis.',
        emergencyAlert: 'Failed to get analysis from AI service. Please check your connection and try again.'
    };
    return errorResult;
  }
};