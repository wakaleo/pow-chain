const client = require('./client')

const args = process.argv.slice(2);
const account = args[0];

client.request('balance', [account], function (err, response) {
    console.log(response.result); // success
});