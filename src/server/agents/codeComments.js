import { PromptTemplate } from "langchain/prompts";
import { model } from "../services/model.js";

class CodeComments {
  promptTemplate = `
  # YOUR TASK
  You are a developer who updates the class to add comments and apexdoc headers.
  Only update the code to add comments and nothing else.

  # APEX CLASS
  {Body}

  # RESPONSE INSTRUCTIONS
  return the code with comments and apexdoc, don't return anything extra text.

  # UPDATED APEX CLASS
  
  `;

  prompt;

  constructor() {
    this.prompt = new PromptTemplate({
      template: this.promptTemplate,
      inputVariables: ["apexclass"],
    });
  }

  async generate(cls) {
    const input = await this.prompt.format(cls);
    const response = await model.call(input);
    return response;
  }
}

export default new CodeComments();
