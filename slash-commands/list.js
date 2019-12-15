
module.exports = [
    {
        command: 'stock',
        selfMessage: true,
        match: /\/(stock)(\W)([\w\.\-]+)/i,
        sendQuery: true,
        run: 'node ./slash-commands/stock/stock.js'
    },
    {
        command: 'shrug',
        selfMessage: false,
        match: '/shrug',
        sendQuery: false,
        run: 'cat ./slash-commands/shrug/shrug.txt',
    },
];
