const xml2js = require('xml2js');
let {
  readFromFile
} = require('../files')
module.exports = {
  async readXMLAsJson(path) {
    var data = await readFromFile(path)
    var xmlParser = new xml2js.Parser();
    return new Promise((res, rej) => {
      xmlParser.parseString(data,
        function (err, result) {
          res(result)
        });
    })
  }
}