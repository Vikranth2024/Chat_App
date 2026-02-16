import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI("AIzaSyAu7-b4rchMBap3oKfgRIjZzit_gWHwn-k");

const languageMap = {
  "en": "English",
  "hi": "Hindi",
  "ta": "Tamil",
  "es": "Spanish",
  "fr": "French",
  "de": "German",
  "it": "Italian",
  "pt": "Portuguese",
  "ru": "Russian",
  "ja": "Japanese",
  "ko": "Korean",
  "zh": "Chinese"
};

export const translateText = async (text, targetLanguageCode) => {
  if (!text || !targetLanguageCode) return text;

  const targetLanguage = languageMap[targetLanguageCode] || targetLanguageCode;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

    const prompt = `You are a translation assistant. Translate the following text into ${targetLanguage}. 
    If the text is already in ${targetLanguage} or is a name/common phrase that doesn't need translation, return the original text.
    Return ONLY the translated text, nothing else. No "Here is the translation" or quotes.
    
    Text: "${text}"`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const translated = response.text().trim();
    return translated;
  } catch (error) {
    console.error("AI Translation Error:", error.message);
    return text; // Fallback to original text on error
  }
};
