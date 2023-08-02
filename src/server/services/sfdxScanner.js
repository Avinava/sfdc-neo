import { execSync } from "child_process";
import temp from "temp";
import { join } from "path";
import fs from "fs-extra";

class SFDXScanner {
  async run(clsBody) {
    temp.track();
    const tempDir = await temp.mkdir("sfdx-scanner");
    const tempFile = join(tempDir, "scanner-target.cls");
    const outFile = join(tempDir, "scanner-output.json");

    await fs.writeFile(tempFile, clsBody);
    execSync(
      `sfdx scanner:run --target ${tempFile} --format json --outfile ${outFile}`,
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
