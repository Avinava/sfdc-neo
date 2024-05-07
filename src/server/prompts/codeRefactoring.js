import BaseChatWriter from "./BaseChatWriter.js";
import sfdxScanner from "../services/salesforce/sfdxScanner.js";
import YAML from "../services/yamlParser.js";

class CodeRefactoring extends BaseChatWriter {
  constructor() {
    const basePrompt = `
# YOUR TASK
You are a world class Salesforce developer who is tasked to optimize and refactor the provided apex class keeping in mind salesforce best practices
- Use the PMD result to guide you in refactoring the code and fixing the issues
- Break large methods into smaller methods so that it is easier to read and maintain and test
- Add comments and apex-doc to the class / method if they are missing
- don't change the existing method signature or functionality, you can update function level variable naming and add new variables if needed
- the updated code should compile and run without any errors, any new methods that are called from code should be defined in the class or should already exist

# RESPONSE Apex Class
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
    return {
      result: this.extractCode(await super.generate(cls)),
      pmd: results,
    };
  }
}

export default new CodeRefactoring();
