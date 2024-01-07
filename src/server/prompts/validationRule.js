import { PromptTemplate } from "langchain/prompts";
import { model } from "../services/model.js";
import YAML from "../services/yamlParser.js";

class ValidationRule {
  promptTemplate = `
You are a developer who is reviewing the provided salesforce validation rules.
- Review the validation rule and provide feedback based on GUIDELINES.
- Use the METADATA to generate the documentation.
- Provide score between (1-10) for Naming, Description and ErrorMessage in JSON based on how much they follow the GUIDELINES, where 10 means they follow guidelines strictly

# GUIDELINES

## NAMING
Validation rule names should be unique, beginning with an uppercase letter. 
- Use underscores to separate words
- Name should be descriptive and not generic. 
- Should be under 40 characters.
- Examples:
  - Street_Address_Required
  - Zipcode_Required
  - Comments_Required_If_Status_Closed_Won

## DESCRIPTION
- The description should be descriptive and should clearly tell what this validation rule does under 255 characters

## ERROR MESSAGE
- The error message should be descriptive and should guide the user about the error under 255 characters

# METADATA
{metadata}

# RESPONSE TEMPLATE
## Validation Rule: <validation rule name> Documentation
<insert formatted and indented validation rule>

### Description
<insert description what it does in simple terms>

### Suggested Improvements / Updates
#### Name
<validate name name against "NAMING GUIDELINES" >
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
<insert json representation of suggestion for application use, this should parse and in below format
{{
  "Name":"<new name>",
  "Description":"<new description>",
  "ErrorMessage":"<new error message>",
  "score": {{ 
    "Name": <score in integer>,
    "Description": <score>,
    "ErrorMessage": <score>
  }}
}}
>
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
