const client = require('./client')

client.request('startMining', [], function (err, response) {
    console.log(response.result); // success
});

