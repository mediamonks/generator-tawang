const needle = require('needle');
const makeSourceMap = require('./makeSourceMap');

/**
 * Utility for testing a Tawang server.
 */
module.exports = class {
  /**
   * Create a test.
   * @param {String} serverHost The domain name of the server to test.
   */
  constructor(serverHost) {
    this.serverHost = serverHost;
  }

  /**
   * Checks if the server is available at that domain
   * @return {boolean} Boolean indicating wether the test was successful or not
   */
  async checkDomain() {
    let url = `https://${this.serverHost}`;
    let response = await needle('get', url);

    return response.body === 'ok';
  }

  /**
   * Checks the source map post endpoint of the server.
   * @return {boolean} Boolean indicating wether the test was successful or not
   */
  async checkPost() {
    // Assembling the url of the source map post endpoint.
    let url = `https://${this.serverHost}/source-map`;

    // Generating a fake source map.
    this.sourceMap = makeSourceMap();

    // Assembling the data and sending to server.
    let data = { map: this.sourceMap.json };
    let options = { json: true };
    let response = await needle('post', url, data, options);

    // Inspecting the response for errors.
    if (response.body) {
      return response.body.id === this.sourceMap.hash;
    } else {
      return false;
    }
  }

  /**
   * Checks the source map parse endpoint of the server.
   * @return {boolean} Boolean indicating wether the test was successful or not
   */
  async checkParse() {
    // Assembling url for the parse endpoint.
    let url = `https://${this.serverHost}/source-map/${this.sourceMap.hash}`;

    // Assembling a fake location in the source map.
    let error = [
      {
        line: 3,
        column: 6,
      },
    ];

    // Assembling the data and sending to server.
    let data = { errors: error };
    let options = { json: true };
    let response = await needle('post', url, data, options);

    // Inspecting the response for errors.
    if (response.body) {
      let resultObj = response.body[0];
      return resultObj.line === 1 && resultObj.column === 6;
    } else {
      return false;
    }
  }
};
