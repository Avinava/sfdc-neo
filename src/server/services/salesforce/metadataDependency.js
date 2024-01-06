import DependencyParser from "./dependencyParser.js";
import Papa from "papaparse";
import codeParser from "../codeParser.js";

/**
 * Class for handling metadata dependencies.
 */
class MetadataDependency {
  /**
   * Create a MetadataDependency.
   * @param {Object} jsForceConnection - The jsForce connection object.
   */
  constructor(jsForceConnection) {
    this.connection = jsForceConnection;
  }

  /**
   * Get the required sobject metadata from the apex code
   * @param {*} apexClass
   * @returns {Promise<{ sobject : {fields: {name, type, length}[]}}>}
   */
  async getRequiredSObjectMetadata(apexClass) {
    const dependencyData =
      await this.getRequiredSObjectMetadataDependency(apexClass);

    let sobjects = codeParser.parseDeclarationTypes(apexClass.Body);
    let sobjectFields = codeParser.parseReferences(apexClass.Body);

    // filter all Metadata Type = CustomObject and add to sobjects only return Name
    const customObjects = dependencyData
      .filter((d) => d["Metadata Type"] === "CustomObject")
      .map((d) => d.Name.toLowerCase());

    sobjects = new Set([...sobjects, ...customObjects]);

    const customFields = dependencyData
      .filter((d) => d["Metadata Type"] === "CustomField")
      .map((d) => d.Name.toLowerCase().split(".")[1]);

    sobjectFields = new Set([...sobjectFields, ...customFields]);

    // describe all sobjects
    const describePromises = Array.from(sobjects).map((sobj) =>
      this.describeSObject(sobj)
    );

    const results = await Promise.all(describePromises);
    const sobjectMetadata = {};

    for (const result of results) {
      // check if the result is valid
      if (result.name) {
        sobjectMetadata[result.name] = {
          fields: [],
        };
        for (const field of result.fields || []) {
          if (
            (!field.nillable &&
              !field.defaultedOnCreate &&
              field.createable &&
              field.type !== "boolean") ||
            sobjectFields.has(field.name.toLowerCase())
          ) {
            const fieldMeta = {
              name: field.name,
              type: field.type,
              length: field.length,
              updateable: field.updateable,
            };

            if (field.type === "reference") {
              fieldMeta.referenceTo = field.referenceTo;
            }

            if (field.picklistValues && field.picklistValues.length > 0) {
              fieldMeta.picklistValues = field.picklistValues.map(
                (v) => v.value
              );
            }

            sobjectMetadata[result.name].fields.push(fieldMeta);
          }
        }
      }
    }
    return sobjectMetadata;
  }

  /**
   * Get the required sobject metadata dependency.
   * @param {Object} apexClass - The apex class object.
   * @returns {Promise<Object>} The required sobject metadata dependency.
   */
  async getRequiredSObjectMetadataDependency(apexClass) {
    const dp = new DependencyParser(this.connection);

    const dependencies = await dp.getDependencies({
      type: "ApexClass",
      name: apexClass.Name,
      id: apexClass.Id,
    });

    const dependencyData =
      Papa.parse(dependencies.csv, { header: true }).data || {};

    return dependencyData;
  }
}

export default MetadataDependency;
