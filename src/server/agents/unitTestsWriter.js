import { PromptTemplate } from "langchain/prompts";
import { model } from "../services/model.js";

class UnitTestsWriter {
  promptTemplate = `
  # YOUR TASK
  You are a developer who is writing unit test class for the provided apex class.
  Use the apex class to generate unit test class.

  # APEX CLASS
  {apexclass}

  # RESPONSE INSTRUCTIONS
  in your response only return code without any extra text or headers.

  # UNIT TEST CLASS
  
  `;

  prompt;

  constructor() {
    this.prompt = new PromptTemplate({
      template: this.promptTemplate,
      inputVariables: ["apexclass"],
    });
  }

  async generate(clsBody) {
    const input = await this.prompt.format({ apexclass: clsBody });
    const response = await model.call(input);
    return response;
  }
}

export default new UnitTestsWriter();
