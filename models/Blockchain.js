fs = require('fs');

class Blockchain {
    constructor() {
        this.blocks = []
    }

    addBlock(block) {
        this.blocks.push(block);
    }

    blockHeight() {
        return this.blocks.length;
    }

    history() {
        return JSON.stringify(this.blocks);
    }

    accountBalance(accountOwner) {
        const relevantUTXOs = this.findUtxosForAccount(accountOwner.toString()).filter((utxo) => !utxo.spent);
        return relevantUTXOs.reduce((p,c) => p + c.amount,0);    
    }

    findUtxosForAccount(accountOwner) {

        let utxos = []

        this.blocks.forEach(
            (block) => {
                block.transactions.forEach(
                    (transaction) => {
                        transaction.outputs.forEach(
                            (outputUtxo) => {if (outputUtxo.owner === accountOwner) {
                                utxos.push(outputUtxo);
                            }
                        })
                    }
                )
            }
        )
        return utxos;
    }

    unspentUtxosForAccount(accountOwner) {
        return this.findUtxosForAccount(accountOwner).filter((utxos) => !utxos.spent)
    }
}

module.exports = Blockchain;
