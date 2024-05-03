import { ChatOpenAI } from "@langchain/openai";
import { AzureChatOpenAI } from "@langchain/azure-openai";
import * as dotenv from "dotenv";
dotenv.config();

let model;

if (process.env.AZURE_ENABLED === "true") {
  model = new AzureChatOpenAI({
    azureOpenAIEndpoint: process.env.AZURE_ENDPOINT,
    apiKey: process.env.AZURE_OPENAI_KEY,
    azureOpenAIApiDeploymentName: process.env.AZURE_MODEL,
    model: process.env.AZURE_MODEL,
    azureOpenAIApiVersion: process.env.AZURE_API_VERSION,
  });
} else {
  model = new ChatOpenAI({
    openAIApiKey: process.env.OPENAI_API_KEY,
    temperature: (process.env.OPENAI_TEMPERATURE || 0.3) * 1,
    maxTokens: (process.env.OPENAI_MAX_TOKENS || 3000) * 1,
    modelName: process.env.OPENAI_MODEL_NAME || "gpt-3.5-turbo",
  });
}

export { model };
