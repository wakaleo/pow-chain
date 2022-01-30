const db = require('./db');
const Block = require('./models/Block');
const Order = require('./models/Order');
const TARGET_DIFFICULTY = BigInt("0x00" + "F".repeat(62));
const BLOCK_REWARD = 10;
const SHA256 = require('crypto-js/sha256');
const Transaction = require('./models/Transaction');
const UTXO = require('./models/UTXO');
const {PUBLIC_KEY} = require('./config');
const { blockchain } = require('./db');

const miner = {
    active: true,
    mempool: [],

    startMining() {
        this.active = true;
        console.log(`Mining operations started!`)
        // this.mine();
    },

    stopMining() {
        console.log("Mining operations stopped!")
        this.active = false;
    },

    deposit(accountOwner, amount) {
        this.mempool.push(new Order("DEPOSIT", accountOwner, amount, null));
    },

    transfer(accountOwner, payee, amount) {
        this.mempool.push(new Order("TRANSFER", accountOwner, amount, payee));
    },

    mine() {
        if (!this.active) {
            return;
        }

        const block = new Block()
        this.processMempoolOrders(block);
        this.addCoinbaseTx(block);
    
        while(BigInt('0x' + block.hash()) >= TARGET_DIFFICULTY) {
            block.nonce++;
        }
        block.execute();
    
        db.blockchain.addBlock(block);
        db.save()
    
        console.log(`Block #${db.blockchain.blockHeight()}: {hash: ${block.hash()}, nonce: ${block.nonce}}`)
    
        setTimeout(this.mine, 2000);  
    },

    processMempoolOrders(block) {
        for(let i = 0; i < 10; i++) {
            if (this.mempool.length > 0) {
                const order = this.mempool.shift();
                console.log("PROCESSING ORDER " + i + ":" + JSON.stringify(order));
                if (order.type === "DEPOSIT") {
                    this.processDeposit(order, block);
                } else if (order.type === "TRANSFER") {
                    this.processTransfer(order, block);
                }
            }
        }
    },

    processDeposit(order, block) {
        const orderUTXO = new UTXO(order.owner, parseInt(order.amount));
        const orderTX = new Transaction([],[orderUTXO]);
        block.addTransaction(orderTX);
    },

    processTransfer(order, block) {
        // Check that the order owner has enough funds
        console.log("CURRENT BALANCE:" + db.blockchain.accountBalance(order.owner));
        if (db.blockchain.accountBalance(order.owner) < order.amount) {
            console.log("INSUFFICIENT FUNDS");
        } else {
            console.log("SUFFICIENT FUNDS");
            // We need to spend the UTXOs up until the value of the transfer
            const unspentUTXOs = blockchain.unspentUtxosForAccount(order.owner);

            let inputUTXOs = []

            let totalSpent = 0;
            while (totalSpent < order.amount) {
                let nextUTXO = unspentUTXOs.shift();
                nextUTXO.spent = true;
                inputUTXOs.push(nextUTXO);
                totalSpent = totalSpent + nextUTXO.amount;
            }
            let changeUTXO = new UTXO(order.owner, totalSpent - order.amount);
            let transferUTXO = new UTXO(order.payee, order.amount);
            let outputUTXOs = [changeUTXO, transferUTXO];
    
            const orderUTXO = new UTXO(order.payee, parseInt(order.amount));
            const orderTX = new Transaction(inputUTXOs,[orderUTXO]);
            block.addTransaction(orderTX);
        }
    },

    addCoinbaseTx(block) {
        const coinbaseUTXO = new UTXO(PUBLIC_KEY, BLOCK_REWARD);
        const coinbaseTX = new Transaction([],[coinbaseUTXO]);    
        block.addTransaction(coinbaseTX);
    }
}

module.exports = miner