import BaseChatWriter from "./BaseChatWriter.js";

class CodeDocumenter extends BaseChatWriter {
  constructor() {
    const basePrompt = `
# YOUR TASK
You are a Salesforce developer who is documenting provided apex class.
- Use the apex class to generate the documentation.
- Use the apex-doc to guide you in writing the documentation.
- Add an overview of the class and the methods.

# Format
  ## <Class Name>
  ### Description <small description of the code what it does>

  ### Methods
  #### <Method Name>
  ##### Description <Method description and what it does>
  ##### Parameters and Return Values <Small description of the parameters and return values>
  ###### <Parameter Name> 

  #### <Method Name 2>

# RESPONSE INSTRUCTIONS
return the response in markdown format with class Name as header

##
  `;

    const inputVariables = [
      {
        label: "Apex Class",
        value: "Body",
      },
    ];

    super(basePrompt, inputVariables);
  }

  async generate(cls) {
    return this.extractCode(await super.generate(cls));
  }
}

export default new CodeDocumenter();
