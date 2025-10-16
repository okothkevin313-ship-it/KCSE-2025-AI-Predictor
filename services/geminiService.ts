
import { GoogleGenAI, Type } from "@google/genai";
import { type GeminiResponse, type Subject } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    questions: {
      type: Type.ARRAY,
      description: "An array of 5 KCSE prediction questions.",
      items: {
        type: Type.OBJECT,
        properties: {
          questionNumber: { type: Type.NUMBER, description: "The question number, e.g., 1." },
          questionText: { type: Type.STRING, description: "The full text of the question, including any sub-parts (a, b, c)." },
          totalMarks: { type: Type.NUMBER, description: "Total marks available for the entire question." },
          markingScheme: {
            type: Type.ARRAY,
            description: "A detailed step-by-step marking scheme for the question.",
            items: {
              type: Type.OBJECT,
              properties: {
                step: { type: Type.STRING, description: "Description of the step or point being awarded marks." },
                marks: { type: Type.STRING, description: "The marks code and count (e.g., 'M1', 'A1', 'B1')." }
              },
              required: ["step", "marks"]
            }
          }
        },
        required: ["questionNumber", "questionText", "totalMarks", "markingScheme"]
      }
    }
  },
  required: ["questions"]
};

export const generateKcseQuestions = async (subject: Subject, topic: string): Promise<GeminiResponse> => {
  const model = 'gemini-2.5-pro';

  const prompt = `
    You are an expert curriculum developer and seasoned examiner for the Kenyan KCSE national examinations, with deep specialization in ${subject}. 
    Your task is to generate 5 highly probable prediction questions for the KCSE 2025 ${subject} paper, focusing specifically on the topic of "${topic}".

    Instructions:
    1.  Create 5 unique questions.
    2.  The questions must be challenging and accurately reflect the style, structure, and cognitive demands of actual KCSE final exams.
    3.  For each question, provide a detailed marking scheme. The scheme should break down the answer into steps, awarding marks for method (M), accuracy (A), and bonus/knowledge (B) where appropriate.
    4.  Ensure the total marks for each question are clearly stated.
    5.  The questions should cover various cognitive levels: recall, comprehension, application, analysis, and synthesis.
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        temperature: 0.8,
        topP: 0.95,
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    const jsonText = response.text.trim();
    const parsedResponse: GeminiResponse = JSON.parse(jsonText);
    
    if (!parsedResponse.questions || !Array.isArray(parsedResponse.questions)) {
        throw new Error("Invalid response format from API. Expected a 'questions' array.");
    }
    
    return parsedResponse;

  } catch (error) {
    console.error("Error generating content from Gemini:", error);
    throw new Error("Failed to generate questions. The AI model may be temporarily unavailable.");
  }
};
