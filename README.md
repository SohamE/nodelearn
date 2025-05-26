Learn node.

** Node Server **

To create a basic node server which listens to a port use the following
```
const http = require('http');
const server = http.createServer(( req, res) => {
    console.log("Hello");
    res.write("Hello World");
    res.end();
});
server.listen(3000);
```