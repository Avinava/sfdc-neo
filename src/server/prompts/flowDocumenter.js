import BaseChatWriter from "./BaseChatWriter.js";

class FlowDocumenter extends BaseChatWriter {
  constructor() {
    const basePrompt = `
# YOUR TASK
You are a salesforce developer who is documenting the flow provided.
- document the flow so that it can be easily understood by admins and BA
- document when the flow will be triggered and what conditions will trigger it
- what are the actions that will be performed when the flow is triggered

# RESPONSE INSTRUCTIONS
return the response in markdown format

# RESPONSE TEMPLATE
## Flow: <flow name> Documentation
<flow description>

### Flow Trigger
<when will the flow be triggered>

### Flow Steps
<flow steps in bullet format>

### Flow Actions
<actions performed by the flow in bullet format>

### Additional Notes

##
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
    return this.extractCode(await super.generate(flow));
  }
}

export default new FlowDocumenter();
