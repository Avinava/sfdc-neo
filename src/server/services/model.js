import { OpenAI } from "langchain/llms/openai";
import * as dotenv from "dotenv";
dotenv.config();

const model = new OpenAI({
  openAIApiKey: process.env.OPENAI_API_KEY,
  temperature: process.env.OPENAI_TEMPERATURE || 0.3,
  maxTokens: process.env.OPENAI_MAX_TOKENS || 3000,
  modelName: process.env.OPENAI_MODEL_NAME || "gpt-3.5-turbo",
});

export { model };
