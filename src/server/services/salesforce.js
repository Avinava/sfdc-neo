import jsforce from "jsforce";
import AdmZip from "adm-zip";
import { XMLBuilder } from "fast-xml-parser";
import {
  ApexLexer,
  CaseInsensitiveInputStream,
  CommonTokenStream,
} from "apex-parser";

class Salesforce {
  session;
  connection;
  constructor(session) {
    this.session = session;
    const token = this.session.passport.user?.oauth?.accessToken.params;
    if (token) {
      this.connection = new jsforce.Connection({
        instanceUrl: token.instance_url,
        accessToken: token.access_token,
        version: "57.0",
      });
    }
  }

  async toolingQueryMore(queryResult) {
    const res = await this.connection.tooling.queryMore(
      queryResult.nextRecordsUrl
    );
    queryResult.records.push(...res.records);
    if (!res.done) {
      await this.toolingQueryMore(queryResult);
    }
    return queryResult;
  }

  async toolingQueryAll(query) {
    let res = await this.connection.tooling.query(query);
    if (!res.done) {
      res = await this.toolingQueryMore(res);
    }
    return res.records;
  }

  async queryAll(queryStr) {
    let records = [];
    return new Promise((resolve, reject) => {
      this.connection
        .query(queryStr)
        .on("record", (record) => {
          records.push(record);
        })
        .on("end", () => {
          resolve(records);
        })
        .on("error", (err) => {
          reject(err);
        })
        .run({ autoFetch: true, maxFetch: 500000, scanAll: true });
    });
  }

  async getEmailTemplates() {
    const query = `SELECT Id, Name, Body, ApiVersion, HtmlValue, DeveloperName, FolderName FROM EmailTemplate `;
    // WHERE NamespacePrefix = null ORDER BY Name ASC
    const emailTemplates = await this.queryAll(query);
    return emailTemplates;
  }

  async getApexClasses() {
    const query = `SELECT Id, Name, Body, ApiVersion, Status FROM ApexClass WHERE NamespacePrefix = null ORDER BY Name ASC`;
    const apexClasses = await this.toolingQueryAll(query);
    return apexClasses;
  }

  async getValidationRules() {
    const query = `SELECT Id, EntityDefinitionId, EntityDefinition.MasterLabel, Active, ErrorDisplayField, ErrorMessage, Description, ValidationName FROM ValidationRule WHERE NamespacePrefix = null ORDER BY ValidationName ASC`;
    const validationRules = await this.toolingQueryAll(query);
    return validationRules;
  }

  async getValidationRuleMetadata(validationRuleId) {
    const query = `SELECT Id, Metadata FROM ValidationRule WHERE Id = '${validationRuleId}'`;
    const validationRules = await this.toolingQueryAll(query);
    return Array.isArray(validationRules)
      ? validationRules[0]
      : validationRules;
  }

  async getFlowDefinitions() {
    const query = `SELECT  Id, ActiveVersionId, ActiveVersion.MasterLabel, DeveloperName from FlowDefinition where ActiveVersionId != null`;
    const flowDefinitions = await this.toolingQueryAll(query);
    return flowDefinitions;
  }

  async getFlowDefinitionMetadata(flowDefinitionId) {
    const query = `select Id, Metadata from Flow where Id = '${flowDefinitionId}'`;
    const flowDefinitions = await this.toolingQueryAll(query);
    const flow = Array.isArray(flowDefinitions)
      ? flowDefinitions[0]
      : flowDefinitions;

    const builder = new XMLBuilder({
      format: true,
    });
    flow.Metadata = builder.build(flow.Metadata);
    return flow;
  }

  getConnection() {
    return this.connection;
  }

  isVaild() {
    return !!this.connection;
  }

  async isSessionValid() {
    let isValid = false;
    try {
      // identity.me() throws exception that can't be caught
      await this.connection
        .requestGet("/chatter/users/me")
        .then((res) => {
          isValid = true;
          return res;
        })
        .catch((err) => {
          isValid = false;
        });
    } catch (error) {}
    return isValid;
  }

  parseClassName(classStr) {
    const stream = new CaseInsensitiveInputStream({}, classStr);
    const lexer = new ApexLexer(stream);
    const tokens = new CommonTokenStream(lexer);
    tokens.fill();
    // get the first Identifier token after class
    let foundClass = false;
    for (const token of tokens.tokens) {
      if (token.type === ApexLexer.CLASS) {
        foundClass = true;
      }
      if (foundClass && token.type === ApexLexer.Identifier) {
        return token.text;
      }
    }

    return;
  }

  /**
   *
   * @param {*} payload {Name, Body}
   */
  async deployClass(cls) {
    const zip = new AdmZip();
    cls.Name = cls.Name || this.parseClassName(cls.Body);
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

  async checkDeployStatus(id) {
    const deployResult = await this.connection.metadata.checkDeployStatus(
      id,
      true
    );
    return deployResult;
  }
}

export default Salesforce;
