import { OpenAI } from "langchain/llms/openai";
import * as dotenv from "dotenv";
dotenv.config();

const model = new OpenAI({
  openAIApiKey: process.env.OPENAI_API_KEY,
  temperature: 0.9,
  maxTokens: 3000,
});

export { model };
