import { PromptTemplate } from "langchain/prompts";
import { model } from "../services/model.js";
import sfdxScanner from "../services/sfdxScanner.js";
import YAML from "../services/yamlParser.js";

class CodeRefactoring {
  promptTemplate = `
# YOUR TASK
- You are a Salesforce developer who is tasked to optimize and refactor the provided class keeping in mind salesforce best practices.
- Use the PMD result to guide you in refactoring the code.
- Break the large method into smaller methods so that it is easier to read and maintain.
- Add comments and apex-doc to the class / method if they are missing.
- don't change the existing method signature or functionality.

# APEX CLASS
{Body}

# PMD SCAN RESULTS
{PMDScanResults}

# RESPONSE Apex Class
  `;

  prompt;

  constructor() {
    this.prompt = new PromptTemplate({
      template: this.promptTemplate,
      inputVariables: ["Body", "PMDScanResults"],
    });
  }

  async generate(cls) {
    const results = await sfdxScanner.getScanResults(cls);
    cls.PMDScanResults = YAML.stringify(results);
    const input = await this.prompt.format(cls);
    const response = await model.call(input);
    return response;
  }
}

export default new CodeRefactoring();
