import { PromptTemplate } from "langchain/prompts";
import { model } from "../services/model.js";
import sfdxScanner from "../services/sfdxScanner.js";
import YAML from "json-to-pretty-yaml"

class CodeReviewerPMD {
  promptTemplate = `
# YOUR TASK
You are a Salesforce Developer who is reviewing the apex class provided.
Use the apex class that was provided in context to review the code based on the following criteria.

- Use the PMD result JSON to guide you to generate the review. Use line numbers to list the issues and provide suggestions.
- Review hardcoded values / endpoints and other code issues.
- Review variable names, method names, class name (names should be small and descriptive) including typos.
- Suggest and list all possible naming that can be improved.
- Review code comments and documentation and check for typos, grammar, and spelling.
- Review Salesforce best practices, and how to improve the code.
- Review code formatting, large methods, and make sure it is readable, review indentation, extra spaces / lines and other formatting issues.
- flag any possibly security issues, soql injection, null pointer exceptions, and other issues that were returned by PMD.
- Make sure to include suggestions with examples and line numbers where applicable.
- Check for unused variables, methods, unreachable code, unnecessary code, and commented code.
- Comment about possible refactoring, use of static / instance methods that can improve code maintainability.


# PMD SCAN RESULTS
{PMDScanResults}

# APEX CLASS
{Body}

# RESPONSE INSTRUCTIONS
- return the review  in markdown format.
- include *Code Rating* from 1 to 10, 1 being the worst, with very short description. example: 5 - Code is readable, but needs improvement.

##
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

export default new CodeReviewerPMD();
