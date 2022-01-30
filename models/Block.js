const SHA256 = require('crypto-js/sha256')

class Block {
    constructor() {
        this.timestamp = Date.now() * 100 + Math.floor(Math.random() * 100);
        this.nonce = 0;
        this.transactions = []
    }

    hash() {
        return SHA256(
            this.timestamp 
            + "" 
            + this.nonce
            + JSON.stringify(this.transactions)
            ).toString();
    }

    addTransaction(transaction) {
        this.transactions.push(transaction);
    }

    execute() {
        this.transactions.forEach((tx) => tx.execute());
    }
}

module.exports = Block;