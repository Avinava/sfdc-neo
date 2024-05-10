import jsforce from "jsforce";
import { XMLBuilder } from "fast-xml-parser";
import TestFactoryDiscovery from "./testFactoryDiscovery.js";
import MetadataDependency from "./metadataDependency.js";
import Deployment from "./deployment.js";

/**
 * Salesforce class for interacting with the Salesforce API.
 */
class Salesforce {
  session;
  connection;

  /**
   * Constructs a new Salesforce instance.
   * @param {Object} session - The session object.
   */
  constructor(session) {
    if (session) {
      this.session = session;
      const token = this.session?.org?.token;
      if (token) {
        this.connection = new jsforce.Connection({
          instanceUrl: token.instanceUrl,
          accessToken: token.accessToken,
          version: "57.0",
        });
      }
    }
  }

  /**
   * Executes a paginated query on the Salesforce API and recursively fetches all pages of the result.
   * @param {Object} queryResult - The result of a query.
   * @returns {Object} The complete result of the query.
   */
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

  /**
   * Executes a query on the Salesforce API and fetches all results.
   * @param {string} query - The SOQL query.
   * @returns {Array} The records returned by the query.
   */
  async toolingQueryAll(query) {
    let res = await this.connection.tooling.query(query);
    if (!res.done) {
      res = await this.toolingQueryMore(res);
    }
    return res.records;
  }

  /**
   * Executes a query on the Salesforce API and fetches all results.
   * @param {string} queryStr - The SOQL query.
   * @returns {Promise<Array>} A promise that resolves with the records returned by the query.
   */
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

  /**
   * Fetches all email templates.
   * @returns {Promise<Array>} A promise that resolves with the email templates.
   */
  async getEmailTemplates() {
    const query = `SELECT Id, Name, Body, ApiVersion, HtmlValue, DeveloperName, FolderName FROM EmailTemplate `;
    const emailTemplates = await this.queryAll(query);
    return emailTemplates;
  }

  /**
   * Fetches records from an object.
   * @param {string} objectName - The name of the object.
   * @param {Array} fields - The fields to fetch.
   * @param {boolean} tooling - Whether to use the tooling API.
   * @returns {Promise<Array>} A promise that resolves with the records.
   */
  async getRecordDetails(objectName, recordId, fields, tooling = false) {
    const query = `SELECT ${fields.join(
      ","
    )} FROM ${objectName} WHERE Id = '${recordId}'`;
    const records = await (tooling
      ? this.toolingQueryAll(query)
      : this.queryAll(query));
    return records[0];
  }

  /**
   * Fetches all Apex classes.
   * @returns {Promise<Array>} A promise that resolves with the Apex classes.
   */
  async getApexClasses() {
    const query = `SELECT Id, Name, ApiVersion, Status FROM ApexClass WHERE ManageableState != 'installed' ORDER BY Name ASC`;
    const apexClasses = await this.toolingQueryAll(query);
    return apexClasses;
  }

  /**
   * Fetches all validation rules.
   * @returns {Promise<Array>} A promise that resolves with the validation rules.
   */
  async getValidationRules() {
    const query = `SELECT Id, EntityDefinitionId, EntityDefinition.MasterLabel, Active, ErrorDisplayField, ErrorMessage, Description, ValidationName FROM ValidationRule WHERE NamespacePrefix = null ORDER BY ValidationName ASC`;
    const validationRules = await this.toolingQueryAll(query);
    return validationRules;
  }

  /**
   * Fetches the metadata for a validation rule.
   * @param {string} validationRuleId - The ID of the validation rule.
   * @returns {Promise<Object>} A promise that resolves with the validation rule metadata.
   */
  async getValidationRuleMetadata(validationRuleId) {
    const query = `SELECT Id, Metadata FROM ValidationRule WHERE Id = '${validationRuleId}'`;
    const validationRules = await this.toolingQueryAll(query);
    return Array.isArray(validationRules)
      ? validationRules[0]
      : validationRules;
  }

  /**
   * Fetches all flow definitions.
   * @returns {Promise<Array>} A promise that resolves with the flow definitions.
   */
  async getFlowDefinitions() {
    const query = `SELECT  Id, ActiveVersionId, ActiveVersion.MasterLabel, DeveloperName from FlowDefinition where ActiveVersionId != null`;
    const flowDefinitions = await this.toolingQueryAll(query);
    return flowDefinitions;
  }

  /**
   * Fetches the metadata for a flow definition.
   * @param {string} flowDefinitionId - The ID of the flow definition.
   * @returns {Promise<Object>} A promise that resolves with the flow definition metadata.
   */
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

  /**
   * Returns the jsforce connection.
   * @returns {jsforce.Connection} The jsforce connection.
   */
  getConnection() {
    return this.connection;
  }

  /**
   * Checks if the jsforce connection is valid.
   * @returns {boolean} True if the connection is valid, false otherwise.
   */
  isVaild() {
    return !!this.connection;
  }

  /**
   * Checks if the session is valid.
   * @returns {Promise<boolean>} A promise that resolves with true if the session is valid, false otherwise.
   */
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

  /**
   * Deploys a class.
   * @param {Object} cls - The class to deploy.
   * @returns {Promise<Object>} A promise that resolves with the deployment result.
   */
  async deployClass(cls) {
    const deployment = new Deployment(this.connection);
    return await deployment.deployClass(cls);
  }

  /**
   * Checks the status of a deployment.
   * @param {string} id - The ID of the deployment.
   * @returns {Promise<Object>} A promise that resolves with the deployment status.
   */
  async checkDeployStatus(id) {
    const deployment = new Deployment(this.connection);
    return await deployment.checkDeployStatus(id);
  }

  /**
   * Gets the required sObject metadata from the Apex code.
   * @param {Object} apexClass - The Apex class.
   * @returns {Promise<Object>} A promise that resolves with the sObject metadata.
   */
  async getRequiredSObjectMetadata(apexClass) {
    const metadataDependency = new MetadataDependency(this.connection);
    return await metadataDependency.getRequiredSObjectMetadata(apexClass);
  }

  /**
   * Gets the test factory definition.
   * @param {Salesforce} salesforce - The Salesforce instance.
   * @param {boolean} force - Whether to force the operation.
   * @returns {Promise<Object>} A promise that resolves with the test factory definition.
   */
  async getTestFactoryDefinition(salesforce, force = false) {
    return await new TestFactoryDiscovery(salesforce.connection).run(force);
  }

  /**
   * Updates an entity using the tooling API.
   * @param {string} entity - The name of the entity.
   * @param {Object} body - The body of the request.
   * @returns {Promise<Object>} A promise that resolves with the result of the update operation.
   */
  async toolingUpdate(entity, body) {
    const deployment = new Deployment(this.connection);
    return await deployment.toolingUpdate(entity, body);
  }
}

export default Salesforce;
