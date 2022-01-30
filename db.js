const { sortedUniq } = require('lodash');
const Blockchain = require('./models/Blockchain')

const db = {
    blockchain: new Blockchain(),

    save() {
        fs.writeFile('blocks.json', JSON.stringify(this.blockchain.blocks), function (err) {
            if (err) return console.log(err);
        });
    },

    load() {
        if (fs.existsSync('blocks.json')) {
            fs.readFile('blocks.json', (error, data) => {
                if (error) {
                    console.error(error);
                    return;
                }
                this.blockchain.blocks = JSON.parse(data);
                console.log(`Loaded ${this.blockchain.blocks.length} blocks`)
            });
        }
    }
}



module.exports = db