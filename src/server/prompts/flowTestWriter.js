import { PromptTemplate } from "langchain/prompts";
import { model } from "../services/model.js";

class FlowTestWriter {
  promptTemplate = `
# YOUR TASK
You are a salesforce developer who is writing test class for provide flow.
- name the test class in <FlowName>Test format where FlowName is the name of the flow
- make sure that the flow is covered by the test class



# FLOW JSON
{Metadata}

# RESPONSE INSTRUCTIONS
return only test class in response
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

export default new FlowTestWriter();
