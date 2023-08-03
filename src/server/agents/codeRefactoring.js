import { PromptTemplate } from "langchain/prompts";
import { model } from "../services/model.js";
import sfdxScanner from "../services/sfdxScanner.js";

class CodeRefactoring {
  promptTemplate = `
  # YOUR TASK
  - You are a Salesforce developer who is tasked to optimize and refactor the provided class keeping in mind salesforce best practices.
  - Use the PMD result JSON to find the issues and refactor the code.

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
    cls.PMDScanResults = JSON.stringify(results);
    const input = await this.prompt.format(cls);
    const response = await model.call(input);
    return response;
  }
}

export default new CodeRefactoring();
