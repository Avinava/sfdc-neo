import { PromptTemplate } from "langchain/prompts";
import { model } from "../services/model.js";

class UnitTestsWriter {
  promptTemplate = `
# YOUR TASK
You are a developer who is writing unit test class for the provided apex class. Use the provided apex class to generate unit test class 
by following the below guidelines.
- generated test class should have private, have apex-doc comments for each method and class
- use the SObject metadata (required fields, type, length) to guide you in generating test and referenced data. In test data make
sure you populate all required fields and use the correct data type and length.
- don't insert custom metadata types (objects ending with __mdt) in test classes
- don't use hardcoded ids in test classes
- use @testSetup, Asserts, System.runAs wherever possible
- use Test.startTest() and Test.stopTest() wherever possible
- add both positive and negative test cases wherever possible
- add test cases for bulk data wherever possible


# APEX CLASS
{Body}

# SOBJECT METADATA
{requiredMetadata}

{additionalContext}

# RESPONSE INSTRUCTIONS
in your response only return generated apex class without any extra text, the generated class should be compilable

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
