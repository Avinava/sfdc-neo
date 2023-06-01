import { PromptTemplate } from "langchain/prompts";
import { model } from "../services/model.js";

class ValidationRule {
  promptTemplate = `
  # YOUR TASK
  You are a developer who is writing description for the provided salesforce validation rules

  # Validation Rule
  {formula}

  # RESPONSE DESCRIPTION
  `;

  prompt;

  constructor() {
    this.prompt = new PromptTemplate({
      template: this.promptTemplate,
      inputVariables: ["formula"],
    });
  }

  async generate(rule) {
    const input = await this.prompt.format({
      formula: rule?.Metadata?.errorConditionFormula,
    });
    const response = await model.call(input);
    return response;
  }
}

export default new ValidationRule();
