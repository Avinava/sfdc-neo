import { zodToJsonSchema } from "zod-to-json-schema";
import { JsonOutputFunctionsParser } from "langchain/output_parsers";
import BaseWriter from "./BaseWriter.js";

class BaseFunctionWriter extends BaseWriter {
  constructor(basePrompt, schema, inputVariables) {
    super(basePrompt, inputVariables);

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

  // Method to generate response
  async generate(data) {
    const outputParser = new JsonOutputFunctionsParser();
    const chain = this.prompt
      .pipe(this.functionCallingModel)
      .pipe(outputParser);
    const response = await chain.invoke(data);
    console.log(response);
    return response;
  }
}

export default BaseFunctionWriter;
