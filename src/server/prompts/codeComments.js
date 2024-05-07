import BaseChatWriter from "./BaseChatWriter.js";

class CodeComments extends BaseChatWriter {
  constructor() {
    const basePrompt = `
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
`;

    const inputVariables = [
      {
        label: "Apex Class",
        value: "Body",
      },
    ];

    super(basePrompt, inputVariables, [
      `Here is the updated code that can be directly copied and pasted into the APEX CLASS:
      `,
    ]);
  }

  async generate(cls) {
    return {
      result: this.extractCode(await super.generate(cls)),
    };
  }
}

export default new CodeComments();
