const jayson = require('jayson');
const { PORT } = require('../config')
// create a client
const client = jayson.Client.http({
    port: PORT
});

module.exports = client;