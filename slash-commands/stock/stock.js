const axios = require('axios');
const parser = require('csv-parse/lib/sync');

const API = 'https://stooq.com/q/l/';


init();

function init() {
    let query = process.argv[2];
    let value = parse(query);

    callAPI(value)
        .then(parseCSV)
        .then(showResults)
        .then(console.log)
        .catch(console.error);
}

function parse(query) {
    query = query.replace(/\/(stock)(\W)/i, '');
    return query.toUpperCase().trim();
}

function callAPI(value) {
    return axios.get(API, {
        params: {
            s: value,
            f: 'sd2t2ohlcv',
            h: '',
            e: 'csv'
        }
    })
    .then(response => response.data.trim());
}

function parseCSV(text) {
    let collection = parser(text, {
        columns: true,
        skip_empty_lines: true
    });

    return collection;
}

function showResults(collection) {
    let [company] = collection;
    return `${company.Symbol} quote is \$${company.Close} per share`;
}