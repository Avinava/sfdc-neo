import { PromptTemplate } from "langchain/prompts";
import { model } from "../services/model.js";

class CodeDocumenter {
  promptTemplate = `
  # YOUR TASK
  You are a developer who is documenting the apex class provided.
  Use the apex class to generate the documentation.

  # APEX CLASS
  {apexclass}

  # RESPONSE INSTRUCTIONS
  return the response in markdown format with class Name as header
  `;

  prompt;

  constructor() {
    this.prompt = new PromptTemplate({
      template: this.promptTemplate,
      inputVariables: ["apexclass"],
    });
  }

  async generate(clsBody) {
    const input = await this.prompt.format({ apexclass: clsBody });
    const response = await model.call(input);
    return response;
  }
}

export default new CodeDocumenter();
