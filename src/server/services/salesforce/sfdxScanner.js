import { execSync } from "child_process";
import temp from "temp";
import { join } from "path";
import fs from "fs-extra";

/**
 * Class for handling SFDX scanning.
 */
class SFDXScanner {
  /**
   * Get scan results for a given class.
   * @param {Object} cls - The class to scan.
   * @returns {Promise<Object>} The grouped violations.
   */
  async getScanResults(cls) {
    const sfdxScannerResult = await this.scan(cls.Body);
    const violations = sfdxScannerResult.violations || [];
    // filter out Documentation
    const filteredViolations = violations.filter(
      (violation) =>
        violation.category !== "Documentation" &&
        violation.ruleName !== "ApexCRUDViolation"
    );
    // group results by category and then ruleName and create a markdown document
    const groupedViolations = filteredViolations.reduce((acc, violation) => {
      const { category, ruleName } = violation;
      if (!acc[category]) {
        acc[category] = {};
      }
      if (!acc[category][ruleName]) {
        acc[category][ruleName] = [];
      }

      // remove unneeded properties
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

  /**
   * Scan a given class body.
   * @param {string} clsBody - The body of the class to scan.
   * @returns {Promise<Object>} The result of the scan.
   */
  async scan(clsBody) {
    temp.track();
    // create a temp file and run sfdx scanner
    const tempDir = await temp.mkdir("sfdx-scanner");
    const tempFile = join(tempDir, "scanner-target.cls");
    const outFile = join(tempDir, "scanner-output.json");

    await fs.writeFile(tempFile, clsBody);
    execSync(
      `npx sfdx scanner:run --target ${tempFile} --format json --outfile ${outFile}`,
      {
        encoding: "utf-8",
      }
    );

    const fileContent = await fs.readFile(outFile, "utf-8");
    await temp.cleanup();
    const result = JSON.parse(fileContent);
    return Array.isArray(result) ? result[0] : result;
  }
}

export default new SFDXScanner();
