const http = require('http');
const server = http.createServer(( req, res) => {
    console.log("Hello");
    res.write("Hello World");
    res.end();
});
server.listen(3000);