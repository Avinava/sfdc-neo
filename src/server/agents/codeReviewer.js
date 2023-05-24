import { PromptTemplate } from "langchain/prompts";
import { model } from "../services/model.js";

class CodeReviewer {
  promptTemplate = `
  # YOUR TASK
  You are a developer who is reviewing the apex class provided.
  Use the apex class that was provided in context and review it based on salesforce best practices.

  # APEX CLASS
  {apexclass}

  # RESPONSE INSTRUCTIONS
  return the response in markdown format.
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
    console.log("response", response);
    return response;
  }
}

export default new CodeReviewer();
