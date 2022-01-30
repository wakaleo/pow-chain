class UTXO {
    constructor(owner, amount) {
        this.id = Date.now() * 100 + Math.floor(Math.random() * 100);
        this.owner = owner;
        this.amount = amount;
        this.spent = false;
    }
}

module.exports = UTXO