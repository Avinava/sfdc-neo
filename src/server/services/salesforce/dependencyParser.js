import sfdcSoup from "sfdc-soup";

class DependencyParser {
  constructor(jsForceConnection) {
    this.connection = {
      token: jsForceConnection.accessToken,
      url: jsForceConnection.instanceUrl,
      version: "57.0",
    };
  }

  async getDependencies(entryPoint) {
    let soupApi = sfdcSoup(this.connection, entryPoint);
    let dependencyResponse = await soupApi.getDependencies();
    return dependencyResponse;
  }
}

export default DependencyParser;
