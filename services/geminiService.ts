import { GoogleGenAI, Type } from "@google/genai";
import { HAIR_STYLES, MAKEUP_STYLES, NAIL_STYLES } from '../constants';

// Initialize Gemini
// Note: In a real production app, you might proxy this through a backend to protect the key,
// but for this client-side demo as per instructions, we use process.env.API_KEY.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeImageAndSuggestStyle = async (base64Image: string): Promise<any> => {
  const modelId = "gemini-2.5-flash"; // Optimized for speed and multimodal
  
  const hairOptions = HAIR_STYLES.map(s => s.name).join(", ");
  const makeupOptions = MAKEUP_STYLES.map(s => s.name).join(", ");
  const nailOptions = NAIL_STYLES.map(s => s.name).join(", ");

  const prompt = `
    Actúa como un consultor de belleza de alta costura y experto en visagismo (Yury Malaver).
    Analiza la imagen proporcionada (el rostro del usuario).
    Determina la forma del rostro (ovalado, cuadrado, etc.) y el tono de piel.
    Basado en esto, recomienda UNO de cada uno de los siguientes estilos de nuestra colección exclusiva:
    
    Colección Cabello: [${hairOptions}]
    Colección Maquillaje: [${makeupOptions}]
    Colección Uñas: [${nailOptions}]

    Responde SOLAMENTE en formato JSON con la siguiente estructura (en español):
    {
      "faceShape": "string",
      "skinTone": "string",
      "suggestedHair": "string (nombre exacto de la lista)",
      "suggestedMakeup": "string (nombre exacto de la lista)",
      "suggestedNails": "string (nombre exacto de la lista)",
      "reasoning": "Breve explicación elegante y sofisticada de por qué estos estilos favorecen sus rasgos."
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: {
        parts: [
          { inlineData: { mimeType: "image/jpeg", data: base64Image } },
          { text: prompt }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            faceShape: { type: Type.STRING },
            skinTone: { type: Type.STRING },
            suggestedHair: { type: Type.STRING },
            suggestedMakeup: { type: Type.STRING },
            suggestedNails: { type: Type.STRING },
            reasoning: { type: Type.STRING }
          }
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text);
    }
    throw new Error("No response text");
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw error;
  }
};
