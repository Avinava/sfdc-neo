import { PromptTemplate } from "langchain/prompts";
import { model } from "../services/model.js";

class CodeComments {
  promptTemplate = `
# YOUR TASK
You are a Salesforce developer updating an existing APEX CLASS to add comments and apex-doc for better readability and maintenance.
While updating the APEX CLASS make sure to follow the following guidelines.
- add apex-doc to the class / method if they are missing
- use the existing comments, apex-docs and make improvements where you can so that the code is easier to understand and maintain.
- fix any typos, spelling or grammar issues in the comments and docs

# Example Apex-Doc
- Class apex-doc
  @description: class description <updated short description of class>
  @author: <leave blank/unchanged>
  @group: <leave blank/unchanged>

- Method apex-doc
  @description: method description <what it does>
  @param: parameter description <type and name>
  @return: return description <type and name>

# APEX CLASS
{Body}

# RESPONSE INSTRUCTIONS
return the updated code only.

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
    const cleanedResponse = response
      .replace(/```apex\n/, "")
      .replace(/\n```$/, "");

    return cleanedResponse;
  }
}

export default new CodeComments();
