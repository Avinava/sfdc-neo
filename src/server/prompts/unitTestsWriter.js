import { z } from "zod";
import BaseChatWriter from "./BaseChatWriter.js";

class UnitTestsWriter extends BaseChatWriter {
  constructor() {
    const basePrompt = `
# YOUR TASK
You are a world class salesforce developer who is writing unit test class for the provided APEX CLASS. Generate unit test class  by following below guidelines.
- Test class should be private, shouldn't have hardcoded ids and must have apex-doc for each method 
- if TEST FACTORY DEFINITION available then use the class and methods to generate test data
- incase suitable methods are not available in TEST FACTORY DEFINITION then use the SOBJECT METADATA (required fields, type, length) to guide you in generating test and referenced data.
- RecordType, custom metadata types, objects ending with __mdt cannot be created.
- To ensure proper testing, use Assert class, System.runAs, @TestSetup, Test.startTest() and Test.stopTest() where applicable
- test methods should test both positive and negative scenarios, some edge cases and bulk data wherever possible
- follow best practices and ensure that the test class is well structured and easy to read

- Method apex-doc
  @description: method description, include what is being tested and which methods

- Assertion
  Avoid System.assert and Always use the new Assert class for Assertion using methods: areEqual(expected, actual, msg), areNotEqual(notExpected, actual), isTrue(condition, msg), isFalse(condition, msg), isNull(actual, msg), isNotNull(actual, msg), fail(msg), isInstanceOfType(instance, expectedType, msg), isNotInstanceOfType(instance, notExpectedType, msg)
  
# RESPONSE INSTRUCTIONS
Provide a generated Apex test class that compiles successfully as the response, excluding any additional information. Never truncate the code. 
  `;
    const inputVariables = [
      {
        label: "Apex Class Body",
        value: "Body",
      },
      {
        label: "Additional Context",
        value: "additionalContext",
      },
      {
        label: "Required Metadata",
        value: "requiredMetadata",
      },
      {
        label: "Test Factory Definition",
        value: "testFactoryDef",
      },
    ];

    super(basePrompt, inputVariables);
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

    return this.extractCode(await super.generate(cls));
  }
}

export default new UnitTestsWriter();
