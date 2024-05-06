import { PromptTemplate } from "langchain/prompts";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import { JsonOutputFunctionsParser } from "langchain/output_parsers";
import {
  ChatPromptTemplate,
  SystemMessagePromptTemplate,
  HumanMessagePromptTemplate,
} from "@langchain/core/prompts";
import { model } from "../services/model.js";

class UnitTestsWriter {
  basePrompt = `
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
  `;

  prompt;

  constructor() {
    this.prompt = new ChatPromptTemplate({
      promptMessages: [
        SystemMessagePromptTemplate.fromTemplate(this.basePrompt),
        HumanMessagePromptTemplate.fromTemplate("APEX CLASS: {Body}"),
        HumanMessagePromptTemplate.fromTemplate(
          "SOBJECT METADATA: {requiredMetadata}"
        ),
        HumanMessagePromptTemplate.fromTemplate(
          "TEST FACTORY DEFINITION: {testFactoryDef}"
        ),
        HumanMessagePromptTemplate.fromTemplate(
          "ADDITIONAL CONTEXT: {additionalContext}"
        ),
      ],
      inputVariables: [
        "Body",
        "additionalContext",
        "requiredMetadata",
        "testFactoryDef",
      ],
    });

    this.schema = z.object({
      Body: z
        .string()
        .describe("generated Apex test class that compiles successfully"),
    });

    this.functionCallingModel = model.bind({
      functions: [
        {
          name: "output_formatter",
          description: "Should always be used to properly format output",
          parameters: zodToJsonSchema(this.schema),
        },
      ],
      function_call: { name: "output_formatter" },
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

    const outputParser = new JsonOutputFunctionsParser();
    const chain = this.prompt
      .pipe(this.functionCallingModel)
      .pipe(outputParser);
    const response = await chain.invoke(cls);
    return response;
  }
}

export default new UnitTestsWriter();
