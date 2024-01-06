import AdmZip from "adm-zip";
import codeParser from "../codeParser.js";

/**
 * Class representing a Salesforce deployment.
 */
class Deployment {
  /**
   * Create a Deployment.
   * @param {Object} jsForceConnection - The jsForce connection object.
   */
  constructor(jsForceConnection) {
    this.connection = jsForceConnection;
  }

  /**
   * Deploy a class to Salesforce.
   * @param {Object} cls - The class to deploy.
   * @returns {Promise<Object>} The result of the deployment.
   */
  async deployClass(cls) {
    const zip = new AdmZip();
    cls.Name = cls.Name || codeParser.parseClassName(cls.Body);
    cls.Metadata =
      cls.Metadata ||
      `<?xml version="1.0" encoding="UTF-8"?>
        <ApexClass xmlns="http://soap.sforce.com/2006/04/metadata">
            <apiVersion>${cls.ApiVersion || "57.0"}</apiVersion>
            <status>${cls.Status || "Active"}</status>
        </ApexClass>`;

    zip.addFile(`classes/${cls.Name}.cls`, Buffer.from(cls.Body));
    zip.addFile(`classes/${cls.Name}.cls-meta.xml`, Buffer.from(cls.Metadata));
    zip.addFile(
      "package.xml",
      Buffer.from(`<?xml version="1.0" encoding="UTF-8"?>
      <Package xmlns="http://soap.sforce.com/2006/04/metadata">
          <types>
              <members>*</members>
              <name>ApexClass</name>
          </types>
          <version>${cls.ApiVersion || "57.0"}</version>
      </Package>`)
    );

    const zipStream = zip.toBuffer();
    const deployResult = await this.connection.metadata.deploy(zipStream, {
      rollbackOnError: true,
      singlePackage: true,
      checkOnly: !!cls.checkOnly,
    });

    return deployResult;
  }

  /**
   * Check the status of a deployment.
   * @param {string} id - The ID of the deployment.
   * @returns {Promise<Object>} The status of the deployment.
   */
  async checkDeployStatus(id) {
    const deployResult = await this.connection.metadata.checkDeployStatus(
      id,
      true
    );
    return deployResult;
  }

  /**
   * Update an entity using the Salesforce Tooling API.
   * @param {string} entity - The name of the entity.
   * @param {Object} body - The body of the request.
   * @returns {Promise<Object>} The result of the update operation.
   */
  async toolingUpdate(entity, body) {
    // NOTE: only metadata fields are updated https://salesforce.stackexchange.com/questions/82069/salesforce-tooling-api-for-validationrule
    return await this.connection.tooling.sobject(entity).update(body);
  }
}

export default Deployment;
