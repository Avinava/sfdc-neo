import { reflect } from "@cparra/apex-reflection";
import SymbolTableGenerator from "./symbolTableGenerator.js";

/**
 * Class responsible for discovering test factories.
 */
class TestFactoryDiscovery {
  /**
   * Creates a new instance of TestFactoryDiscovery.
   * @param {Object} connection - The connection object.
   */
  constructor(connection) {
    this.connection = connection;
  }

  /**
   * Runs the discovery process.
   * @param {boolean} forceBuild - Whether to force the build process.
   * @return {Promise<Object>} The result of the discovery process.
   */
  async run(forceBuild = false) {
    const factoryDef = await this.generate(forceBuild);
    return this.buildResult(factoryDef);
  }

  /**
   * Builds the result object from the factory definition.
   * @param {Object} factoryDef - The factory definition.
   * @return {Object} The result object.
   */
  buildResult(factoryDef) {
    const res = {};
    for (const clsName in factoryDef) {
      res[clsName] = this.buildClassResult(factoryDef, clsName);
    }
    return res;
  }

  /**
   * Builds the result object for a specific class.
   * @param {Object} factoryDef - The factory definition.
   * @param {string} clsName - The name of the class.
   * @return {Object} The result object for the class.
   */
  buildClassResult(factoryDef, clsName) {
    const res = { methods: {} };
    const apexClass = factoryDef[clsName];
    for (const method in apexClass.methods) {
      res.methods[method] = this.buildMethodResult(apexClass, method);
    }
    return res;
  }

  /**
   * Builds the result object for a specific method.
   * @param {Object} apexClass - The Apex class.
   * @param {string} method - The name of the method.
   * @return {Object} The result object for the method.
   */
  buildMethodResult(apexClass, method) {
    const methodDef = apexClass.methods[method];
    return {
      description: methodDef.description,
      parameters: methodDef.parameters,
      returnType: methodDef.returnType,
    };
  }

  /**
   * Generates the factory definition.
   * @param {boolean} forceBuild - Whether to force the build process.
   * @return {Promise<Object>} The factory definition.
   */
  async generate(forceBuild = false) {
    const factoryDef = await this.discover(forceBuild);
    return this.buildFactoryDef(factoryDef);
  }

  /**
   * Builds the factory definition.
   * @param {Object} factoryDef - The factory definition.
   * @return {Object} The factory definition.
   */
  buildFactoryDef(factoryDef) {
    for (const clsName in factoryDef) {
      const apexClass = factoryDef[clsName];
      const reflectData = reflect(apexClass.body).typeMirror;
      delete apexClass.body;
      if (reflectData.methods) {
        factoryDef[clsName].methods = this.buildMethods(
          factoryDef,
          clsName,
          reflectData
        );
      }
    }
    return factoryDef;
  }

  /**
   * Builds the methods for a specific class.
   * @param {Object} factoryDef - The factory definition.
   * @param {string} clsName - The name of the class.
   * @param {Object} reflectData - The reflection data for the class.
   * @return {Object} The methods for the class.
   */
  buildMethods(factoryDef, clsName, reflectData) {
    const methods = factoryDef[clsName].methods || {};
    for (const method of reflectData.methods) {
      if (methods[method.name]) {
        methods[method.name].description = method.docComment?.description;
      }
    }
    return methods;
  }

  /**
   * Discovers the test factories.
   * @param {boolean} forceBuild - Whether to force the build process.
   * @return {Promise<Object>} The test factories.
   */
  async discover(forceBuild = false) {
    const testClasses = await this.getAllTestClasses();
    const classes = testClasses.map((testClass) => testClass.Name);
    let symbolRecords = [];
    let classesWithoutSymbolTable = classes;

    if (!forceBuild) {
      const classesWithSymbolTableResult =
        await this.getClassesWithSymbolTable(classes);
      classesWithoutSymbolTable = this.getClassesWithoutSymbolTable(
        classesWithSymbolTableResult
      );
      symbolRecords = this.getSymbolRecords(classesWithSymbolTableResult);
    }

    if (classesWithoutSymbolTable.length > 0) {
      const symbolTableResult = await new SymbolTableGenerator(
        this.connection
      ).run(classesWithoutSymbolTable);
      symbolRecords.push(...symbolTableResult.records);
    }

    const occurrences = this.getOccurrences(symbolRecords, classes);
    const top3 = this.getTop3(occurrences);
    return this.buildFactory(top3);
  }

  /**
   * Gets all test classes.
   * @return {Promise<Array>} The list of all test classes.
   */
  async getAllTestClasses() {
    const result = await this.connection.search(
      `FIND {@isTest} IN ALL FIELDS RETURNING ApexClass(Id, Name)`
    );
    return result.searchRecords || [];
  }

  /**
   * Gets the occurrences of each class in the symbol records.
   * @param {Array} symbolRecords - The symbol records.
   * @param {Array} classes - The classes.
   * @return {Object} The occurrences of each class.
   */
  getOccurrences(symbolRecords, classes) {
    const occurrences = {};
    for (const member of symbolRecords || []) {
      if (member.SymbolTable) {
        for (const externalReference of member.SymbolTable.externalReferences ||
          []) {
          if (
            externalReference.namespace == null &&
            externalReference.methods &&
            externalReference.methods.length > 0 &&
            classes.includes(externalReference.name)
          ) {
            if (!occurrences[externalReference.name]) {
              occurrences[externalReference.name] = 0;
            }
            occurrences[externalReference.name]++;
          }
        }
      }
    }
    return occurrences;
  }

  /**
   * Gets the top 3 classes with the most occurrences.
   * @param {Object} occurrences - The occurrences of each class.
   * @return {Array} The top 3 classes.
   */
  getTop3(occurrences) {
    const sortedOccurrences = Object.entries(occurrences).sort(
      (a, b) => b[1] - a[1]
    );
    return sortedOccurrences.slice(0, 3).map(([className]) => className);
  }

  /**
   * Builds the factory for the top 3 classes.
   * @param {Array} top3 - The top 3 classes.
   * @return {Promise<Object>} The factory for the top 3 classes.
   */
  async buildFactory(top3) {
    const factory = {};
    if (top3.length > 0) {
      const records = (
        await new SymbolTableGenerator(this.connection).run(top3)
      ).records.filter((member) => {
        return top3.includes(member.ContentEntity.Name);
      });

      for (const record of records) {
        factory[record.ContentEntity.Name] = {
          methods: {},
        };
        for (const method of record.SymbolTable.methods) {
          for (const modifier of method.modifiers) {
            if (modifier === "public") {
              factory[record.ContentEntity.Name].methods =
                factory[record.ContentEntity.Name].methods || {};

              factory[record.ContentEntity.Name].methods[method.name] = method;
            }
          }
        }
      }

      const apexClasses = await this.connection.query(
        `SELECT Id, Name, Body FROM ApexClass WHERE Name IN ('${top3.join(
          "','"
        )}')`
      );
      for (const record of apexClasses.records) {
        factory[record.Name].body = record.Body;
      }
    }
    return factory;
  }
}

export default TestFactoryDiscovery;
