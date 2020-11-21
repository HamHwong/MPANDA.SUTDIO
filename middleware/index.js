const jsonify = require('./jsonify')
module.exports = (app) => {
  app.use(jsonify())
}