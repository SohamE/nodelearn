Learn node.

# Node Server

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

# Import in node

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

# Server In Express

To create a server in express use following:

```
const express = require('express');
const app = express();
app.listen(5000, () => {
    console.log(`App running on port ${process.env.PORT}`)
});
```

## GET, POST, PATCH, DELETE

Send response to client.

```
app.get('/', myController.home);

const home = (req, res) => {
    res.status(200).send("Home");
}

```

If route and method is same, the first method will take precedence. The following will throw error.

```
app.get("/", (req, res) => {
  res.status(404).json("Not found");
});
app.get("/", myController.home);
```

# Important Concepts

1. Node.js, similar to javascript, executes code synchronously, line by line.
