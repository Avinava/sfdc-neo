import { reflect } from "@cparra/apex-reflection";

import SymbolTableGenerator from "./symbolTableGenerator.js";

class TestFactoryDiscovery {
  constructor(connection) {
    this.connection = connection;
  }

  async run(forceBuild = false) {
    const res = {};
    const factoryDef = await this.generate(forceBuild);
    for (const clsName in factoryDef) {
      res[clsName] = {
        methods: {},
      };
      const apexClass = factoryDef[clsName];
      for (const method in apexClass.methods) {
        const methodDef = apexClass.methods[method];
        res[clsName].methods[method] = {
          description: methodDef.description,
          parameters: methodDef.parameters,
          returnType: methodDef.returnType,
        };
      }
    }

    return res;
  }

  async generate(forceBuild = false) {
    const factoryDef = await this.discover(forceBuild);
    // iterate over the factoryDef and generate the test factory
    for (const clsName in factoryDef) {
      const apexClass = factoryDef[clsName];
      const reflectData = reflect(apexClass.body).typeMirror;
      delete apexClass.body;
      if (reflectData.methods) {
        // move reflect.methods to factoryDef[clsName].methods
        factoryDef[clsName].methods = factoryDef[clsName].methods || {};
        for (const method of reflectData.methods) {
          if (factoryDef[clsName].methods[method.name]) {
            factoryDef[clsName].methods[method.name].description =
              method.docComment?.description;
          }
        }
      }
    }

    return factoryDef;
  }

  async discover(forceBuild = false) {
    const testClasses = await this.getAllTestClasses();
    const classes = testClasses.map((testClass) => testClass.Name);
    let symbolRecords = [];
    let classesWithoutSymbolTable = classes;

    if (!forceBuild) {
      // query class with symbol table
      const classesWithSymbolTableResult = await this.connection.tooling.query(
        `SELECT Id, ContentEntity.Name, SymbolTable FROM ApexClassMember WHERE ContentEntity.Name IN ('${classes.join(
          "','"
        )}')`
      );

      if (classesWithSymbolTableResult.records.length > 0) {
        // get all classes that doesn't have symbol table
        classesWithoutSymbolTable =
          classesWithSymbolTableResult.records
            .filter((r) => !r.SymbolTable)
            .map((r) => r.Name) || [];
      } else {
        classesWithoutSymbolTable = classes;
      }

      symbolRecords = classesWithSymbolTableResult.records.filter(
        (r) => r.SymbolTable
      );
    }

    if (classesWithoutSymbolTable.length > 0) {
      const symbolTableResult = await new SymbolTableGenerator(
        this.connection
      ).run(classesWithoutSymbolTable);

      symbolRecords.push(...symbolTableResult.records);
    }

    // figure out which externalReferences are commonly used in most test classes
    const occurences = {};
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
            if (!occurences[externalReference.name]) {
              occurences[externalReference.name] = 0;
            }
            occurences[externalReference.name]++;
          }
        }
      }
    }

    // find the top 3 most commonly used externalReferences and should be used in atleast 2 test classes
    // and should be in classes
    const top3 = Object.keys(occurences)
      .filter((key) => occurences[key] >= 2)
      .sort((a, b) => occurences[b] - occurences[a])
      .slice(0, 3);

    const factory = {};
    if (top3.length > 0) {
      // find the records in symbolTableResult.records
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
      // assign the body to the factory
      for (const record of apexClasses.records) {
        factory[record.Name].body = record.Body;
      }
    }
    return factory;
  }

  async getAllTestClasses() {
    const result = await this.connection.search(
      `FIND {@isTest} IN ALL FIELDS RETURNING ApexClass(Id, Name)`
    );
    return result.searchRecords || [];
  }
}

export default TestFactoryDiscovery;
