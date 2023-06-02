import { PromptTemplate } from "langchain/prompts";
import { model } from "../services/model.js";

class CodeRefactoring {
  promptTemplate = `
  # YOUR TASK
  You are a Salesforce developer who is tasked to optimize and refactor the provided class keeping in mind
  salesforce best practices.\

  # APEX CLASS
  {apexclass}

  # RESPONSE Apex Class
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

export default new CodeRefactoring();
