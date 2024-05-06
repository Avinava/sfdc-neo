import BaseChatWriter from "./BaseChatWriter.js";
import sfdxScanner from "../services/salesforce/sfdxScanner.js";
import YAML from "../services/yamlParser.js";

class CodeReviewerPMD extends BaseChatWriter {
  constructor() {
    const basePrompt = `
# YOUR TASK
As a Salesforce Developer, review the provided Apex class. Use the PMD SCAN RESULTS, and follow the guidelines below:

- Look for hardcoded values / ids and check if they can be replaced with custom settings, custom metadata types, custom labels, constants, email templates, or custom permissions.
- Review variable, method, class names including typos. Naming should be descriptive and follow the best practices. Suggest and list all possible naming that can be improved.
- Review comments and documentation for clarity and correctness. Check for typos, grammar, and spelling.
- Review the code based Salesforce best practices, and flag any possibly security issues, soql injection, null pointer exceptions, and other issues that were returned by PMD.
- Review code formatting, large methods, and make sure it is readable, review indentation, extra spaces / lines and other formatting issues.
- Make sure to include suggestions with examples and line numbers where applicable.
- Check for unused variables, methods, unreachable code, unnecessary code, and commented code.
- Identify possible refactoring, use of static / instance methods that can improve code maintainability.
- SOQL in for loops, DML in for loops, and other performance issues should be flagged.

# SCORING WEIGHTAGE
Naming Conventions: 10%
Hardcoded Values: 10%
Code Formatting: 10%
Comments and Documentation: 10%
Security: 15%
Best Practices: 15%
Possible Refactoring & Unused Code: 10%
Maintainability: 10%
Additional Suggestions: 5%
PMD Summary: 5%

# RESPONSE INSTRUCTIONS
- return the review  in markdown format.
- include *Code Rating* from 1 to 10, 1 being the worst, with very short description. example: 5 - Code is readable, but needs improvement.

# FORMAT
## <Class Name> - Review
### Code Rating: <Rating> / 10
<Short Summary of Rating>

### Review
<Summary>

#### Naming Conventions
- <Suggestions 1>
- <Suggestions 2>

#### Hardcoded Values
- <Suggestions>

#### Code Formatting
- <Suggestions>

#### Comments and Documentation
- <Suggestions>

#### Security
- <Suggestions>

#### Best Practices
- <Suggestions>

#### Refactoring & Unused Code
- <Suggestions>

#### Maintainability
- <Suggestions>

#### Additional Suggestions
- <Suggestions>

#### PMD Summary
- <Suggestions from PMD SCAN RESULTS>

#### How to Improve
- <Suggestions to improve the rating - include specific points and action items>

##
  `;

    const inputVariables = [
      {
        label: "Apex Class",
        value: "Body",
      },
      {
        label: "PMD Scan Results",
        value: "PMDScanResults",
      },
    ];

    super(basePrompt, inputVariables);
  }

  async generate(cls) {
    const results = await sfdxScanner.getScanResults(cls);
    cls.PMDScanResults = YAML.stringify(results);
    return this.extractCode(await super.generate(cls));
  }
}

export default new CodeReviewerPMD();
