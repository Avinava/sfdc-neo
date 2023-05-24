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
  return the review  in markdown format.
  also include Code Quality Rating from 1 to 10, 1 being the worst, with very short description

  ##
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

export default new CodeReviewer();
