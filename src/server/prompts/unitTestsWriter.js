import { PromptTemplate } from "langchain/prompts";
import { model } from "../services/model.js";

class UnitTestsWriter {
  promptTemplate = `
# YOUR TASK
You are a world class salesforce developer who is writing unit test class for the provided APEX CLASS. Generate unit test class 
by following below guidelines.
- Test class should be private, shouldn't have hardcoded ids and must have apex-doc for each method 
- if TEST FACTORY DEFINITION available then use the class and methods to generate test data
- incase suitable methods are not available in TEST FACTORY DEFINITION then use the SOBJECT METADATA (required fields, type, length) to guide you in generating test and referenced data.
- RecordType, custom metadata types, objects ending with __mdt cannot be created.
- To ensure proper testing, use Asserts, System.runAs, @TestSetup, Test.startTest() and Test.stopTest() where applicable
- test methods should test both positive and negative scenarios, some edge cases and bulk data wherever possible

- Method apex-doc
  @description: method description, include what is being tested and which methods

- Assertion
  Avoid System.assert and Always use the new Assert class for Assertion using methods: areEqual(expected, actual, msg), areNotEqual(notExpected, actual), isTrue(condition, msg), isFalse(condition, msg), isNull(actual, msg), isNotNull(actual, msg), fail(msg), isInstanceOfType(instance, expectedType, msg), isNotInstanceOfType(instance, notExpectedType, msg)


# APEX CLASS
{Body}

# SOBJECT METADATA
{requiredMetadata}

# TEST FACTORY DEFINITION
{testFactoryDef}

{additionalContext}

# RESPONSE INSTRUCTIONS
Provide a generated Apex test class that compiles successfully as the response, excluding any additional information. Never truncate the code.

# UNIT TEST CLASS
  `;

  prompt;

  constructor() {
    this.prompt = new PromptTemplate({
      template: this.promptTemplate,
      inputVariables: [
        "Body",
        "additionalContext",
        "requiredMetadata",
        "testFactoryDef",
      ],
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

    if (!cls.testFactoryDef) {
      cls.testFactoryDef = "";
    }

    const input = await this.prompt.format(cls);
    console.log(input);
    const response = await model.invoke(input);
    const cleanedResponse = response.content
      .replace(/```apex\n/, "")
      .replace(/\n```$/, "");

    return cleanedResponse;
  }
}

export default new UnitTestsWriter();
