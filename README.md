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

## Routes

Both works same

```
app.get("/api/v1/tours", myController.getAllTours);
app.get("/api/v1/tours/:id", myController.getTourById);
```

```
app
  .route("/")
  .get(tourController.getAllTours)
  .post(tourController.createTour);
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

## Middleware chaining

middleware chaining can be done like the following. tourController.checkBody is the middleware.

```
router.post(tourController.checkBody, tourController.createTour);
```

## Serve static files

Use the following middleware to server static files. To access it in browser use _/filename_

```
app.use(express.static(`${__dirname}/public`));
```

# Mounting routes

Instead of defining the routes directly on the _app_ object, we can mount routes, this help use creating seperate routers and decouple the application, helps use spread route across files. Once Routes are created we can use middleware to link it to the _app_ object. We can have the router in seperate file and export.

```
const tourRouter = express.Router();

tourRouter
  .route("/")
  .get(myController.getAllTours)
  .post(myController.createTour);

// middleware
app.use('/api/v1/tours', tourRouter);
```

# Mongoose

Mongoose is object data model, which helps node application connect to mongodb and it provides multiple middlewares to easy our mongodb interactions.

## Schema & Model

Every data model in mongodb must declare a schema which will follow during document creation. It is done as following.

```
const tourSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "A tour must have a name"],
    unique: true,
  },
  rating: {
    type: Number,
    default: 3.5,
  },
  price: {
    type: Number,
    required: [true, "A tour must have a price"],
  },
});
```

Once schema is defined we have to create the model based on it. Based on the model name the Collection will be determined. For _Tour_ documents collection name will be _Tours_

```
const Tour = mongoose.model("Tour", tourSchema);
```

## Schema Validators

There are multiple validators we can use while defining mongoose schema. Even custom validators can be created.
Custom validators look like following:

```
priceDiscount: {
  type: Number,
  validate: {
    validator: function (discount) {
      // this only points to current doc on NEW document creations.
      return discount < this.price;
    },
    message: "Discount price ({VALUE}) should be below regular price",
  },
},
```

We can combine the validator library with custom validators to add sanitization and validation.

Know more at [Mongoose validator](https://mongoosejs.com/docs/validation.html)

## Create Document

Following can be used to create document

```
const newTour = new Tour({
  ...req.body
});
newTour.save();
```

OR

```
const newTour = await Tour.create({
  ...req.body,
});
```

Both are asynchronous functions and must be handled with promises/async&await
To handle errors wrap in try&catch block.
While creating a new document if we add properties which were not defined in the schema, it will ignore them and not store in document.

## Virtual fields

virtual fields are fields which are derived from actual fields, but are not stored in database, rather computed when requested. These fields cannot be used in queries like in _find_ methods.

```
tourSchema.virtual("durationWeeks").get(function () {
  return this.duration / 7;
});
```

To make virtual fields show up as json/objects use

```
tourSchema = mongoose.schema({...},
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)
```

## Mongoose Middleware/Hooks

Mongoose middleware/hook allows us to hook into events before (_pre_) and after (_post_) events like save, find and et.c.
To know more visit: [Mongoose Middleware](https://mongoosejs.com/docs/middleware.html)

### Document Middleware/Hooks

The following hook will be called when _create/save_ event is triggered but not on _insertMany_, _findOneAndUpdate_, et.c event.
We can use this hook to derive new fields and save in the document. Given we have to define the field in the schema.
this -> will refer to the document we are saving.

```
tourSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});
```

### Query Middleware/Hooks

this -> refer to the current query.
The following query will be added before every _find_ event, but not for _findOne_.

```
tourSchema.pre("find", function (next) {
  this.find({ secretTour: { $ne: true } });
  next();
});
```

To trigger the hook for all _find_ events, use regex.

```
tourSchema.pre(/^find/, function (next) { .... });
```

### Aggregate Middleware/Hooks

```
tourSchema.pre("aggregate", function (next) {
  this.pipeline().unshift({
    $match: { secretTour: { $ne: true } },
  });
  next();
});
```

# Data Modelling

## Embedding

We can embed data using pre hooks, as such. The following will take ids of users as input and embed the user data in the tourSchema.

```
tourSchema.pre("save", async function (next) {
  const guidesPromises = this.guides.map(async (id) => await User.findById(id));
  this.guides = await Promise.add(guidesPromises);
  next();
});
```

## Reference

We can add document references by collection as follows.

```
guides: [
  {
    type: mongoose.Schema.ObjectId,
    reference: "User",
  },
],
```

### Populate data

When we are adding documents as a reference, while fetching the data we can use _populate_ to show the referenced data. This is expensive as mongoose, in the backend, queries the collection to get the data.

```
const tour = await Tour.findOne({ _id: req.params.id }).populate("guides");
// OR to cherry pick fields
const tour = await Tour.findOne({ _id: req.params.id }).populate({
  path: "guides",
  select: "-__v -passwordChangedAt"
});
```

### Virtual populate

Virtually populates the parent with childs having parent referencing.
The following links the _tour_ field of the Reviews Collection data with the _id_ field of Tours Collection data.

```
// Virtual populate.
tourSchema.virtual("reviews", {
  ref: "Review",
  foreignField: "tour", // Name of the field in review collection.,
  localField: "_id", // Map the field of current collection.
});
```

# Merge Params

Each route has access to their our route params. To get access to other attached routes we use merge params.

```
// reviewRoute.js

const reviewRouter = express.Router();
reviewRouter
  .route("/:abcId")
  .get(reviewController.getReviews);

// app.js

app.use("abc/:defId", reviewRouter)
```

In the above example the getReviews controller handler will not have access to _defId_, it will only have access to _abcId_. To get access to the _defId_ we use mergeParams like.

```
const reviewRouter = express.Router({
  mergeParams: true,
});
```

# Error Handling

By passing 4 params in a middleware, express considers it as a error handling middleware.

```
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
});
```

In any middleware function if we call the function next with any parameters, express triggers the error handling middleware. The following will trigger the error handling middleware above with _err_ mapped to _err_.

```
app.all("/*splat", (req, res, next) => {
  const err = new Error(`Can't find ${req.originalUrl} on this server`);
  err.status = "fail";
  err.statusCode = 404;

  next(err);
});
```

If there are multiple errorhandlers, they will be called in the order we put them in our .use statements. Every errorhandler has to do next(err) though in order to pass the error on.

# Sessions

use _express-session_ npm package for session handling. It is used as a middleware and we store the data in _req.session_

```
app.use(session({
  name: "my-session",
  ...
}));

app.use((req, res, next) => {
  let { visit } = req.session;
  if (!visit) {
    visit = {
      count: 1,
    }
  } else {
    visit.count++;
  }
  req.session.visit = visit;
})
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

3. Application Logic - code concerned about application implementation, not underlying business problem. In express, managing req and response. It is technical part, bridge between model and view.
   Business Logic - Business problem we set out to solve. What the application will do to achieve the business needs.

4. Promisify in js util converts a function to it's promise alternative

```
The function passed to util.promisify must :
a. The final parameter of the function passed to promisify must be a callback.
b. The callback must follow Node’s callback style

Node's callback style is :  ( err, result )

1. the first parameter ( err ) can be :  null, Error Object, String...  or anything we want -> but its purpose is : tell us what is wrong in our function

  - Typically is  "null" <=> does not have any error in our function , everything work correctly

-  And an Error Object <=> something is wrong in our function  <=> in catch(e) block  , we can get message by using  :  e.message

-  And another type is using String -> it tells us what wrong in our function if we dont want to create an Error Object   <=>  in catch block we just  console.log(e) instead of using console.log(e.message)
2. The value what we want that function return for us

```

5. Types of Relationship

a. One to One -> One movie can have one name.
b. One to Many -> One movie can have many reviews.
c. Many to Many -> One actor plays in multiple movie and one movie can have multiple actors.

6. Types of referencing

a. Child referencing -> the parent should have all the child reference as an array.
b. Parent referencing -> Each child will have a single field referencing to the parent. This can help keeping the parent clean, hence it's better than child referencing.
c. Two-Way referencing ->

7. To debug node files use the command `node inspect filename`. In this file breakpoints can be added similar to DOM js using _debugger_

8. _helmet_ npm package helps protecting our site as a middleware.
