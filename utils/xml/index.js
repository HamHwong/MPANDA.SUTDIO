const xml2js = require('xml2js');
let {
  readFromFile
} = require('../files')
/**
 * 读取XML成JSON 
 * @param {*} path
 * @return {*} 
 */
async function readXMLAsJson(path) {
  var data = await readFromFile(path)
  var xmlParser = new xml2js.Parser();
  return new Promise((res, rej) => {
    xmlParser.parseString(data,
      function (err, result) {
        res(result)
      });
  })
}
module.exports = {
  readXMLAsJson
}