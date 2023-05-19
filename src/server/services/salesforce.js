import jsforce from "jsforce";

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
      });
    }
  }

  async toolingQuery(query) {
    return await this.connection.tooling.query(query);
  }

  async getApexClasses() {
    const query = `SELECT Id, Name, Body, ApiVersion, Status FROM ApexClass WHERE NamespacePrefix = null ORDER BY Name ASC LIMIT 100`;
    const apexClasses = await this.toolingQuery(query);
    return apexClasses;
  }
}

export default Salesforce;
