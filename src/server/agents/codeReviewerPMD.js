import { PromptTemplate } from "langchain/prompts";
import { model } from "../services/model.js";
import sfdxScanner from "../services/sfdxScanner.js";
import YAML from "../services/yamlParser.js";

class CodeReviewerPMD {
  promptTemplate = `
# YOUR TASK
You are a world class Salesforce Developer who is reviewing the apex class provided. To assist with your code review you have been provided with the PMD SCAN RESULTS, which you can use along with the below guidelines to review the code.

- Look for hardcoded values, hardcoded ids and check if they can be replaced with custom settings, custom metadata types, custom labels, constants, or custom permissions.
- Review variable names, method names, class name including typos. Naming should be descriptive and follow the best practices. Suggest and list all possible naming that can be improved.
- Review code comments and documentation and check for typos, grammar. There should be enough comments to explain the code.
- Review the code based Salesforce best practices, and flag any possibly security issues, soql injection, null pointer exceptions, and other issues that were returned by PMD.
- Review code formatting, large methods, and make sure it is readable, review indentation, extra spaces / lines and other formatting issues.
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

# FORMAT
## <Class Name> - Review
### Code Rating: <Rating>/10
<Short Summary of Rating>

### Review
<Summary>

#### Naming Conventions
- <Issues & Suggestions 1>
- <Issues & Suggestions 2>

#### Hardcoded Values
- <Issues & Suggestions>

#### Code Formatting
- <Issues & Suggestions>

#### Comments and Documentation
- <Issues & Suggestions>

#### Security
- <Issues & Suggestions>

#### Best Practices
- <Issues & Suggestions>

#### Possible Refactoring & Unused Code
- <Issues & Suggestions>

#### Maintainability
- <Issues & Suggestions>

#### Additional Suggestions
- <Issues & Suggestions>

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
