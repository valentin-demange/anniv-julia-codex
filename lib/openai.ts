import OpenAI from "openai";

let cachedClient: OpenAI | null = null;

export function getOpenAIClient() {
  if (!cachedClient) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error("OPENAI_API_KEY manquante. Ajoutez-la dans vos variables d'environnement.");
    }

    cachedClient = new OpenAI({ apiKey });
  }

  return cachedClient;
}
