import BaseChatWriter from "./BaseChatWriter.js";

class FlowTestWriter extends BaseChatWriter {
  constructor() {
    const basePrompt = `
# YOUR TASK
You are a salesforce developer who is writing test class for provide flow.
- name the test class in <FlowName>Test format where FlowName is the name of the flow
- make sure that the flow is covered by the test class

# RESPONSE INSTRUCTIONS
return only test class in response
  `;

    const inputVariables = [
      {
        label: "Flow JSON",
        value: "Metadata",
      },
    ];

    super(basePrompt, inputVariables);
  }

  async generate(flow) {
    return {
      result: this.extractCode(await super.generate(cls)),
    };
  }
}

export default new FlowTestWriter();
