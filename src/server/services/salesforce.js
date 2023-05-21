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

  async toolingQuery(query) {
    let res = await this.connection.tooling.query(query);
    if (!res.done) {
      res = await this.toolingQueryMore(res);
    }
    return res.records;
  }

  async getApexClasses() {
    const query = `SELECT Id, Name, Body, ApiVersion, Status FROM ApexClass WHERE NamespacePrefix = null ORDER BY Name ASC LIMIT 100`;
    const apexClasses = await this.toolingQuery(query);
    return apexClasses;
  }

  getConnection() {
    return this.connection;
  }

  isVaild() {
    return !!this.connection;
  }
}

export default Salesforce;
