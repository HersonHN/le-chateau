
module.exports = [
    {
        command: 'stock',
        selfMessage: true,
        match: /\/(stock)(\W)(\w+)/i,
        run: 'node ./slash-commands/stock/stock.js'
    },
    {
        command: 'shrug',
        selfMessage: false,
        match: '/shrug',
        run: 'cat ./slash-commands/shrug/shrug.txt',
    },
];
