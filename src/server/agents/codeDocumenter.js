import { PromptTemplate } from "langchain/prompts";
import { model } from "../services/model.js";

class CodeDocumenter {
  promptTemplate = `
# YOUR TASK
You are a developer who is documenting the apex class provided.
- Use the apex class to generate the documentation.
- Use the apex-doc to guide you in writing the documentation. Fix any typos, grammar, and spelling.
- Add an overview of the class and the methods.

# Example
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
    const response = await model.call(input);
    return response;
  }
}

export default new CodeDocumenter();
