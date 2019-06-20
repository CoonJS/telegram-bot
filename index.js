const fs = require('fs');
const https = require('https');
const express = require('express');

const token = fs.readFileSync('./token.txt');
const chatId = '347227894';
const text = 'HELLO WORLD';

const requestURL = `https://api.telegram.org/bot${token}/sendMessage?chat_id=-${chatId}&text=Hello + World`;
console.log(requestURL, 'tok')

const port = 443;
const app = express();
const options = {
    key: fs.readFileSync('./domain.key'),
    cert: fs.readFileSync('./domain.crt')
};

app.get('/', (req, res) => {
    res.send("IT'S WORKING!")
});


https.createServer(options, app).listen(port, () => {
    console.log('server running at ' + port)
});
