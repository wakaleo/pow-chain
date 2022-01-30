const client = require('./client')

client.request('stopMining', [], function (err, response) {
    console.log(response.result); // success
});

