const calculator = require('./basicfunction');

const http = require('http');
const server = http.createServer(( req, res) => {
    const ans = calculator.add(5, 20);
    console.log(`Hello ${ans}`);
    res.write(`Hello world ${ans}`);
    res.end();
});
server.listen(3000);