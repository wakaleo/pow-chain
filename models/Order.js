class Order {
    constructor(type, owner, amount, payee) {
        this.type = type;
        this.owner = owner;
        this.payee = payee;
        this.amount = amount;
    }
}
module.exports=Order