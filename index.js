const jayson = require('jayson')
const { PORT } = require('./config')
const miner = require('./mine')
const db = require('./db')

db.load()
setInterval(() => miner.mine(), 5000);

const express = require('express')
const app = express()

// respond with "hello world" when a GET request is made to the homepage
app.get('/', function (req, res) {
    res.send(`
    <h3>BLOCKCHAIN SERVER RUNNING</h3>
    <ul>
    <li>/start - start mining</li>
    <li>/stop - stop mining</li>
    <li>/blockchain - Display the current blockchain</li>
    <li>/balance?account=KEY</li>
    <li>/deposit?account=KEY&amount=100</li>
    <li>/withdraw?account=KEY&amount=100</li>
    </ul>
    `);
})

app.get('/start', function (req, res) {
    miner.startMining()
    res.send("MINING STARTED");
})

app.get('/stop', function (req, res) {
    miner.stopMining()
    res.send("MINING STOPPED");
})

app.get('/balance', function (req, res) {
    const address = req.query.account;
    const total = db.blockchain.accountBalance(address);
    res.send("BALANCE: " + total);
})

app.get('/deposit', function (req, res) {
    const address = req.query.account;
    const amount = req.query.amount;
    miner.deposit(address, amount)
    res.send("DEPOSIT ORDER SUBMITTED");
})

app.get('/transfer', function (req, res) {
    const address = req.query.account;
    const amount = req.query.amount;
    const payee = req.query.payee;
    miner.transfer(address, payee, amount)
    res.send("TRANSFER ORDER SUBMITTED");
})

app.get('/blockchain', function (req, res) {
    res.send(db.blockchain.history());
})

app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`)
})

