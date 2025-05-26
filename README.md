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

# Middleware

## Request Response cycle

Request comes in, it passes through all the middleware stacks and then sends response.

```
        ___________________pipeline _________________
        |                                           |
Request -> middleware -> middleware -> middleware -> Response
            next()        next()        res.send()
```

The middleware stack follows the sequence the middleware is declared (synchronously, line by line)

To use middleware we use the _use_ method. _express.json()_ returns a function and that adds to the middleware stack.

```
app.use(express.json())
```

## Custom middleware

```
app.use((req, res, next) => {
  console.log('Hello from the middleware');
  next();
})
```

Every middleware function has access to request, response and next method. After adding functionality in the function we have to call the next() method to pass continue the request-response cycle.
The above middleware doesnot specify a route, hence it will work for all routes.
Where the middleware is defined, i.e. the order is important and it decides on which route the middleware works.

In the following case as the middleware is defined after Route 1, the middleware will not work for Route 1, because the cycle has ended when the controller method calls the res.send(). But it will work for Route 2.

```
// Route 1
app
  .route("/api/v1/tours")
  .get(myController.getAllTours)
  .post(myController.createTour);

app.use((req, res, next) => {
  console.log('Hello from the middleware');
  // Without the following the request - response cycle stops.
  next();
})

// Route 2
app
  .route("/api/v1/tours/:id")
  .get(myController.getTourById)
  .patch(myController.updateTour)
  .delete(myController.deleteTour);
```

# Important Concepts

1. Node.js, similar to javascript, executes code synchronously, line by line.
2. Format for REST api json response

```
{
    status: 'success',
    results: tours.length,
    data: {
      tours
    }
}
```

status can be success/ fail (error at client)/ error ( error at server).
