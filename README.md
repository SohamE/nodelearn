Learn node.

### Node Server ###

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

### Import in node ###

To export objects from a file use the following

```
const add = (a, b) =>  a + b;

module.exports = {
    add,
}
```

To import the exported object use

```
const calculator = require('./basicfunction');
const ans = calculator.add(5, 20);

```