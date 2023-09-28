import { PromptTemplate } from "langchain/prompts";
import { model } from "../services/model.js";

class UnitTestsWriter {
  promptTemplate = `
# YOUR TASK
You are a world class salesforce developer who is writing unit test class for the provided APEX CLASS. Use the provided apex class to generate unit test class 
by following below guidelines.
- Test class should be private, shouldn't have hardcoded ids, have apex-doc comments (@description) for each method and class
- use the SOBJECT METADATA (required fields, type, length) to guide you in generating test and referenced data. Test data should be generated in @TestSetup method and make sure to populate all required fields and use the correct data type and length.
- custom metadata types, objects ending with __mdt cannot be created in test classes, don't create them
- To ensure proper testing, use Asserts, System.runAs, @TestSetup, Test.startTest() and Test.stopTest() where applicable
- test methods should test both positive and negative scenarios, some edge cases and bulk data wherever possible

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
