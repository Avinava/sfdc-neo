/**
 * Class for generating symbol tables.
 */
class SymbolTableGenerator {
  /**
   * Create a SymbolTableGenerator.
   * @param {Object} connection - The connection object.
   */
  constructor(connection) {
    this.connection = connection;
  }

  /**
   * Generate a symbol table for the given classes.
   * @param {Array<string>} classes - The names of the classes.
   * @returns {Promise<Object>} The results of the symbol table generation.
   */
  async generateSymbolTable(classes) {
    // query if there is a metadata container named neo-container
    const query = `SELECT Id, Name FROM MetadataContainer WHERE Name = 'neo-container'`;
    const metadataContainers = await this.connection.tooling.query(query);

    if (metadataContainers.totalSize > 0) {
      // if there is, delete it
      await this.connection.tooling.delete(
        "MetadataContainer",
        metadataContainers.records[0].Id
      );
    }
    // create a new metadata container
    const metadataContainer = await this.connection.tooling.create(
      "MetadataContainer",
      {
        Name: "neo-container",
      }
    );

    // query classes by name
    const apexClassQuery = `SELECT Id, Name, Body FROM ApexClass WHERE Name IN ('${classes.join(
      "','"
    )}')`;
    const apexClasses = await this.connection.tooling.query(apexClassQuery);

    // create apex class member for each class
    const apexClassMembers = apexClasses.records.map((apexClass) => {
      return {
        MetadataContainerId: metadataContainer.id || metadataContainer.Id,
        ContentEntityId: apexClass.Id,
        Body: apexClass.Body,
      };
    });

    // insert apex class members
    const apexClassMemberResults = await this.connection.tooling
      .sobject("ApexClassMember")
      .create(apexClassMembers);

    // Create ContainerAysncRequest to deploy (check only) the Apex Classes and thus obtain the SymbolTable's
    const result = await this.connection.tooling
      .sobject("ContainerAsyncRequest")
      .create({
        MetadataContainerId: metadataContainer.id || metadataContainer.Id,
        IsCheckOnly: true,
      });

    // wait for the container to finish
    await this.waitForContainerAsyncRequest(result.id);

    return {
      apexClassMemberResults,
      result,
    };
  }

  /**
   * Wait for the ContainerAsyncRequest to finish.
   * @param {string} id - The ID of the ContainerAsyncRequest.
   * @returns {Promise<Object>} The ContainerAsyncRequest.
   */
  async waitForContainerAsyncRequest(id) {
    const containerAsyncRequest = await this.connection.tooling.retrieve(
      "ContainerAsyncRequest",
      id,
      ["State"]
    );

    if (containerAsyncRequest.State === "Failed") {
      if (containerAsyncRequest.DeployDetails.componentSuccesses.length > 0) {
        return containerAsyncRequest;
      }
      throw new Error("symbol table generation failed");
    } else if (containerAsyncRequest.State === "Completed") {
      return containerAsyncRequest;
    } else {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return this.waitForContainerAsyncRequest(id);
    }
  }

  /**
   * Run the symbol table generation for the given classes.
   * @param {Array<string>} classes - The names of the classes.
   * @returns {Promise<Object>} The results of the symbol table generation.
   */
  async run(classes) {
    const result = await this.generateSymbolTable(classes);
    // get apex class member ids
    const apexClassMemberIds = result.apexClassMemberResults.map(
      (apexClassMemberResult) => {
        return apexClassMemberResult.id;
      }
    );

    // query the apexclassmember to get the symbol table
    const query = `SELECT Id, ContentEntity.Name, SymbolTable FROM ApexClassMember WHERE Id IN ('${apexClassMemberIds.join(
      "','"
    )}')`;
    return await this.connection.tooling.query(query);
  }
}

export default SymbolTableGenerator;
