const https = require('https')
const { Get } = require('../mongodb')
const axios = require('axios');
const querystring = require('querystring')
module.exports = {
  isNull(data) {
    return data === '' || data === undefined || data === null
  },
  async get(path) {
    return new Promise((resolve, reject) => {
      https
        .get(path, (res) => {
          var rawData = ''
          res.setEncoding('utf8')
          res.on('data', (d) => {
            rawData += d
          })
          res.on('end', () => {
            try {
              resolve(JSON.parse(rawData))
            } catch (e) {
              reject(e.message)
            }
          })
        })
        .end()
    })
  },
  async post(path, data) {
    // return new Promise((resolve, reject) => { 
    //   const postData = querystring.stringify(data) 
    //   var request = https.request(
    //     {
    //       path: path,
    //       body: data,
    //       headers: {
    //         'Content-Type': 'application/x-www-form-urlencoded',
    //         'Content-Length': Buffer.byteLength(postData),
    //       },
    //     },
    //     (res) => {
    //       var rawData = ''
    //       res.setEncoding('utf8')
    //       res.on('data', (d) => {
    //         console.log(rawData)
    //         rawData += d
    //       })
    //       res.on('err', (err) => {
    //         console.log('rawData.err')
    //         reject(err.message)
    //       })
    //       res.on('end', () => {
    //         try {
    //           console.log('rawData.end',rawData)
    //           resolve(JSON.parse(rawData))
    //         } catch (e) {
    //           reject(e.message)
    //         }
    //       })
    //     }
    //   ) 
    //   request.on('data', (e) => {
    //     // reject(e.message)
    //     console.log(e)
    //   })
    //   request.on('error', (e) => {
    //     reject(e.message)
    //   })
    //   request.write(postData)
    //   request.end()
    // })
    return axios.post(path,data)
    },
}
