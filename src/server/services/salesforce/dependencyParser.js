import sfdcSoup from "sfdc-soup";

/**
 * Class for parsing dependencies using the sfdc soup
 */
class DependencyParser {
  /**
   * Create a DependencyParser.
   * @param {Object} jsForceConnection - The jsForce connection object.
   */
  constructor(jsForceConnection) {
    this.connection = {
      token: jsForceConnection.accessToken,
      url: jsForceConnection.instanceUrl,
      version: "57.0",
    };
  }

  /**
   * Get the dependencies for a given entry point.
   * @param {string} entryPoint - The entry point to get dependencies for.
   * @returns {Promise<Object>} The dependencies.
   */
  async getDependencies(entryPoint) {
    let soupApi = sfdcSoup(this.connection, entryPoint);
    let dependencyResponse = await soupApi.getDependencies();
    return dependencyResponse;
  }
}

export default DependencyParser;
