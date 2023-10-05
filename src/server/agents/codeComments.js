import { PromptTemplate } from "langchain/prompts";
import { model } from "../services/model.js";

class CodeComments {
  promptTemplate = `
# YOUR TASK
You are a Salesforce developer updating an apex class to add comments and apex-doc.
- add apex-doc to the class / method if they are missing
- use the existing comments and make improvements where you can so that the code is easier to understand
- fix any typos, spelling or grammar issues in the comments

# Example Apex-Doc
- Class apex-doc
  @description: class description
  @author: leave blank
  @group: leave blank

- Method apex-doc
  @description: method description
  @param: parameter description
  @return: return description

# APEX CLASS
{Body}

# RESPONSE INSTRUCTIONS
return the updated code, don't return anything extra.

# UPDATED APEX CLASS
  
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
    const response = await model.call(input);
    return response;
  }
}

export default new CodeComments();
