class Transaction {
    constructor(inputs, outputs) {
        this.inputs = inputs;
        this.outputs = outputs;
    }

    execute() {
        this.inputs.forEach((input) => {
            input.spent = true;
        });
    }
}

module.exports = Transaction;