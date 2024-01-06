import { PromptTemplate } from "langchain/prompts";
import { model } from "../services/model.js";
import YAML from "../services/yamlParser.js";

class ValidationRule {
  promptTemplate = `
# YOUR TASK
You are a developer who is reviewing the provided salesforce validation rules.
- Review the validation rule and provide feedback to the developer.
- Use the METADATA to generate the documentation.

# METADATA
{metadata}

# RESPONSE TEMPLATE
## Validation Rule: <validation rule name> Documentation
<insert formatted and indented validation rule>

### Description
<insert description what it does in simple terms>

### Suggested Improvements / Updates
#### Name
<validate name if its appropriate, if not suggest a new name>
#### Description
<validate description and suggest improvements if needed>
#### Formula
<check errorConditionFormula against best practices and suggest if any improvement needed>
#### Error Message
<check if the errorMessage is user friendly and easy to understand, otherwise suggest changes, return the complete updated text>

### Examples
- <insert example when error will happen>
- <example 2>

### JSON
complete json representation of suggestion

  "Name" : "<validation rule name>",
  "Description" : "<complete description>",
  "ErrorMessage" : "<error message>",


  `;

  prompt;

  constructor() {
    this.prompt = new PromptTemplate({
      template: this.promptTemplate,
      inputVariables: ["metadata"],
    });
  }

  async generate(rule) {
    rule.Metadata.name = rule?.ValidationName;
    const input = await this.prompt.format({
      metadata: YAML.stringify(rule.Metadata),
    });
    const response = await model.call(input);
    return response;
  }
}

export default new ValidationRule();
