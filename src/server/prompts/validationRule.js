import { PromptTemplate } from "langchain/prompts";
import { model } from "../services/model.js";
import YAML from "../services/yamlParser.js";

class ValidationRule {
  promptTemplate = `
# YOUR TASK
You are a developer who is reviewing the provided salesforce validation rules.
- Review the validation rule and provide feedback to the developer.
- Use the METADATA to generate the documentation.
- Suggested Description & Error Message should be under 255 characters.

# Naming Guidelines
Validation rule names should be unique, beginning with an uppercase letter. Use spaces to separate words.
examples:
- Street Address < 60 chars	
- Zipcode required (Suburb)
- Comments required (if Status = 'Closed Won')


# METADATA
{metadata}

# RESPONSE TEMPLATE
## Validation Rule: <validation rule name> Documentation
<insert formatted and indented validation rule>

### Description
<insert description what it does in simple terms>

### Suggested Improvements / Updates
#### Name
<validate name name against "Naming Guidelines", if it doesn't follows it, suggest a new name based on Naming Guidelines>
#### Description
<validate the existing description and suggest improvements if needed including grammar and typos>
#### Formula
<check errorConditionFormula against best practices and suggest if any improvement needed>
#### Error Message
<check if the errorMessage is user friendly and easy to understand, otherwise suggest changes including grammar and typos, return the complete updated text>

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
