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
      ...formattedInputVariables.map((variable) => {
        if (!variable.description) {
          return HumanMessagePromptTemplate.fromTemplate(
            `${variable.label}: {${variable.value}}`
          );
        } else {
          return HumanMessagePromptTemplate.fromTemplate(
            `${variable.label}: {${variable.value}}\n---\n${variable.description}`
          );
        }
      }),
    ];

    // Add instructions
    if (instructions) {
      promptMessages.push(
        SystemMessagePromptTemplate.fromTemplate(instructions)
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

  extractCode(codeBody) {
    const codeBlockRegex = /```(?:java|apex|Java|Apex)?\s*([\s\S]*?)\s*```/g;
    let match;
    let codeBlocks = [];
    while ((match = codeBlockRegex.exec(codeBody)) !== null) {
      if (match[1]) {
        codeBlocks.push(match[1].trim());
      }
    }
    return codeBlocks.length > 0 ? codeBlocks[0] : codeBody;
  }
}

export default BaseWriter;
