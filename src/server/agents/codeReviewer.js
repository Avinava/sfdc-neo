import { PromptTemplate } from "langchain/prompts";
import { model } from "../services/model.js";

class CodeReviewer {
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

# APEX CLASS
{Body}

# RESPONSE INSTRUCTIONS
- return the review  in markdown format.
- include *Code Rating* from 1 to 10, 1 being the worst, with very short description. example: 5 - Code is readable, but needs improvement.

# FORMAT
## <Class Name> - Review
### Code Rating: <Rating>
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
      inputVariables: ["Body"],
    });
  }

  async generate(cls) {
    const input = await this.prompt.format(cls);
    const response = await model.call(input);
    return response;
  }
}

export default new CodeReviewer();
