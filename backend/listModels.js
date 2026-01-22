import { GoogleGenerativeAI } from "@google/generative-ai";
import "dotenv/config";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const listModels = async () => {
  const models = await genAI.listModels();
  models.models.forEach((m) => {
    console.log(m.name, "→ supports:", m.supportedGenerationMethods);
  });
};

listModels();
