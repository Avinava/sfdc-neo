import { zodToJsonSchema } from "zod-to-json-schema";
import { JsonOutputFunctionsParser } from "langchain/output_parsers";
import {
  ChatPromptTemplate,
  SystemMessagePromptTemplate,
  HumanMessagePromptTemplate,
} from "@langchain/core/prompts";
import { model } from "../services/model.js";

class BaseWriter {
  constructor(basePrompt, schema, inputVariables) {
    // Handle input variables
    const { promptInputVariables, formattedInputVariables } =
      this.handleInputVariables(inputVariables);

    // Create prompt messages
    const promptMessages = [
      SystemMessagePromptTemplate.fromTemplate(basePrompt),
      ...formattedInputVariables.map((variable) =>
        HumanMessagePromptTemplate.fromTemplate(
          `${variable.label}: {${variable.value}}`
        )
      ),
    ];

    // Create prompt
    this.prompt = new ChatPromptTemplate({
      promptMessages,
      inputVariables: promptInputVariables,
    });

    // Set schema
    this.schema = schema;

    // Bind model to output formatter function
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

  // Method to handle input variables
  handleInputVariables(inputVariables) {
    const promptInputVariables = inputVariables.map((variable) =>
      typeof variable === "string" ? variable : variable.value
    );

    let formattedInputVariables = inputVariables;
    if (inputVariables.length && typeof inputVariables[0] === "string") {
      formattedInputVariables = inputVariables.map((variable) => ({
        label: variable,
        value: variable,
      }));
    }

    return { promptInputVariables, formattedInputVariables };
  }

  // Method to generate response
  async generate(data) {
    const outputParser = new JsonOutputFunctionsParser();
    const chain = this.prompt
      .pipe(this.functionCallingModel)
      .pipe(outputParser);
    const response = await chain.invoke(data);
    return response;
  }
}

export default BaseWriter;
