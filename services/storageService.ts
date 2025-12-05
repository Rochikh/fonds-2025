import { GoogleGenAI } from "@google/genai";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const generateThankYouMessage = async (amount: number): Promise<string> => {
  // Fonction simplifiée car nous avons retiré l'IA pour l'instant
  return "Merci";
};
