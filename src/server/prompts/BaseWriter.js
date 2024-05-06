import {
  ChatPromptTemplate,
  SystemMessagePromptTemplate,
  HumanMessagePromptTemplate,
} from "@langchain/core/prompts";

class BaseWriter {
  constructor(basePrompt, inputVariables, instructions) {
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

    // Add instructions
    if (instructions) {
      promptMessages.push(
        HumanMessagePromptTemplate.fromTemplate(instructions)
      );
    }

    // Create prompt
    this.prompt = new ChatPromptTemplate({
      promptMessages,
      inputVariables: promptInputVariables,
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
}

export default BaseWriter;
