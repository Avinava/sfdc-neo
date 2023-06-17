import { PromptTemplate } from "langchain/prompts";
import { model } from "../services/model.js";

class FlowDocumenter {
  promptTemplate = `
  # YOUR TASK
  You are a salesforce developer who is documenting the flow provided.
  - document the flow so that it can be easily understood by admins and BA
  - document when the flow will be triggered and what conditions will trigger it
  - what are the actions that will be performed when the flow is triggered
  

  # FLOW JSON
  {Metadata}

  # RESPONSE INSTRUCTIONS
  return the response in markdown format
  ##
  `;

  prompt;

  constructor() {
    this.prompt = new PromptTemplate({
      template: this.promptTemplate,
      inputVariables: ["Metadata"],
    });
  }

  async generate(flow) {
    const input = await this.prompt.format(flow);
    const response = await model.call(input);
    return response;
  }
}

export default new FlowDocumenter();
