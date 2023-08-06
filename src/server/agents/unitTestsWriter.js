import { PromptTemplate } from "langchain/prompts";
import { model } from "../services/model.js";

class UnitTestsWriter {
  promptTemplate = `
  # YOUR TASK
  You are a developer who is writing unit test class for the provided apex class.
  - Use the apex class to generate unit test class
  - Use the provided SObject metadata (required fields, type, length) to generate test data and reference data
  - don't insert custom metadata types (objects ending with __mdt) in test classes
  - Don't use hardcoded ids
  - use @testSetup wherever possible
  - use Asserts wherever possible
  - use System.runAs wherever possible
  - use Test.startTest() and Test.stopTest() wherever possible
  - if needed add both positive and negative test cases
  - if needed add test cases for bulk data
  

  # APEX CLASS
  {Body}

  # SOBJECT METADATA JSON
  {requiredMetadata}
  
  {additionalContext}

  # RESPONSE INSTRUCTIONS
  in your response only return code without any extra text or headers.

  # UNIT TEST CLASS
  
  `;

  prompt;

  constructor() {
    this.prompt = new PromptTemplate({
      template: this.promptTemplate,
      inputVariables: ["Body", "additionalContext", "requiredMetadata"],
    });
  }

  async generate(cls) {
    cls.additionalContext = "";
    if (cls.prompt) {
      cls.additionalContext = `# ADDITIONAL INSTRUCTIONS / CONTEXT
  ${cls.prompt}
  # NOTE : if instructions are not related to apex test class then ignore them
      `;
    }
    const input = await this.prompt.format(cls);
    const response = await model.call(input);
    return response;
  }
}

export default new UnitTestsWriter();
