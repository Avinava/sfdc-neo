import { PromptTemplate } from "langchain/prompts";
import { model } from "../services/model.js";

class CodeDocumenter {
  promptTemplate = `
# YOUR TASK
You are a Salesforce developer who is documenting provided apex class.
- Use the apex class to generate the documentation.
- Use the apex-doc to guide you in writing the documentation.
- Add an overview of the class and the methods.

# Format
  ## <Class Name>
  ### Description

  ### Methods
  #### <Method Name>
  ##### Description <Method description and what it does>
  ##### Parameters and Return Values <Small description of the parameters and return values>
  ###### <Parameter Name> 

  #### <Method Name 2>
  ##### Description <Method description and what it does>
  ##### Parameters and Return Values
  ###### <Parameter Name>


# APEX CLASS
{Body}

# RESPONSE INSTRUCTIONS
return the response in markdown format with class Name as header

##
  `;

  prompt;

  constructor() {
    this.prompt = new PromptTemplate({
      template: this.promptTemplate,
      inputVariables: ["Body"],
    });
  }

  async generate(cls) {
    const input = await this.prompt.format(cls);
    const response = await model.invoke(input);
    return response.content;
  }
}

export default new CodeDocumenter();
