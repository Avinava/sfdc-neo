import { PromptTemplate } from "langchain/prompts";
import { model } from "../services/model.js";

class ValidationRule {
  promptTemplate = `
# YOUR TASK
You are a developer who is writing description for the provided salesforce validation rules

# Validation Rule
{formula}

# RESPONSE TEMPLATE
## Validation Rule: <validation rule name> Documentation
<insert formatted and indented validation rule>

### Description
<insert description what it does in simple terms>

### Examples
- <insert example when error will happen>
- <example 2>

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
