import { PromptTemplate } from "langchain/prompts";
import { model } from "../services/model.js";
import sfdxScanner from "../services/sfdxScanner.js";

class CodeReviewerPMD {
  promptTemplate = `
  # YOUR TASK
  You are a Salesforce Technical Architect who is reviewing the apex class provided.
  Use the apex class that was provided in context to review the code based on the following criteria.
  
  - Review variable names, method names, class name (names should be small and descriptive) including typos.
  - Suggest and list all possible naming that can be improved.
  - Review code comments and documentation and check for typos, grammar, and spelling.
  - Review Salesforce best practices, and how to improve the code.
  - Review hardcoded values / endpoints, SOQL / DML in loops, and other code issues.
  - Review code formatting, large methods, and make sure it is readable, review indentation, extra spaces / lines and other formatting issues.
  - flag any possibly security issues, soql injection, null pointer exceptions, and other issues.
  - Make sure to include suggestions with examples and line numbers where applicable.
  - Check for unused variables, methods, unreachable code, unnecessary code, and commented code.
  - Comment about possible refactoring, use of static / instance methods that can improve code maintainability.
  - Use the PMD result JSON to help you with your review. Use line numbers to list the issues.

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
    const results = await this.getScanResults(cls);
    cls.PMDScanResults = JSON.stringify(results, null, 2);
    const input = await this.prompt.format(cls);
    const response = await model.call(input);
    return response;
  }

  async getScanResults(cls) {
    const sfdxScannerResult = await sfdxScanner.run(cls.Body);

    const violations = sfdxScannerResult.violations || [];
    // filter out Documentation
    const filteredViolations = violations.filter(
      (violation) => violation.category !== "Documentation"
    );
    // ];

    // group results by category and then ruleName and create a markdown document
    const groupedViolations = filteredViolations.reduce((acc, violation) => {
      const { category, ruleName } = violation;
      if (!acc[category]) {
        acc[category] = {};
      }
      if (!acc[category][ruleName]) {
        acc[category][ruleName] = [];
      }

      delete violation.url;
      delete violation.ruleName;
      delete violation.category;
      delete violation.message;
      delete violation.endLine;
      delete violation.endColumn;
      acc[category][ruleName].push(violation);
      return acc;
    }, {});
    return groupedViolations;
  }
}

export default new CodeReviewerPMD();
