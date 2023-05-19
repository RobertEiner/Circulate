require("dotenv").config();

const db = require("./db");
const express = require("express"); // import the express module. This allows us to use the features of the express framework in the application
const morgan = require("morgan");
const app = express(); // here we create an instance of the express application. We initialize a new express application and assign it to app
// the express() fuinction is provided by the express module that was imported on previous line 

const port = process.env.PORT;
app.listen(port, () =>  {
    console.log(`Server is up and listening on port ${port}`);
});

// This is middleware, it is called before the route handler that the HTTP request
// is directed to, when it is finished it passes the execution on to the next middleware, 
// which is the route handler. Express reads file from top to bottom, so the position of middleware
// in the file is very important.
// here we use ,morgan as the middleware for logging different things. Miorgan can be used with your own middleware funcitons as well 
app.use(morgan("dev"));

// this middleware makes it possible for us to use the body of the request object that is sent form the client
app.use(express.json());

// (req, res) => is the same as function(req, res)
app.get("/", (req, res) => {
    res.json({
        message: "Welcome to Circulate"
    });
});

// app.get defnines a route handler (the route handler is the callback arrow function) for the HTTP GET method and specifies the path which is /getItems
// route for getting all items
app.get("/api/v1/items", async (req, res) => {
    // we use a try catch because we are querying the database
    try {
        const results = await db.query("SELECT * FROM items");
        console.log(results);
        res.status(200).json({
            data: {
            items: results.rows
            }
        });
    } catch(e) {
        console.log(e);
    }
});

// get a specific item
app.get("/api/v1/items/:id", async (req, res) => {
    console.log(req.params.id);
   // DON'T use template strings for querying (leads to SQL-injections) const result = await db.query(`SELECT * FROM items WHERE id = ${req.params.id}`) == BAD
   try {
       var id = req.params.id;
       const result = await db.query("SELECT * FROM items WHERE id = $1", [id]);    // $1 is the first element of the array passed as the 2nd arg to db.query
       // response to client 
       res.status(200).json({
           data: {
               item: result.rows[0]
           }
       })

   } catch(e) {
    console.log(e);
   }
});

// create an item
app.post("/api/v1/items", async (req, res) => {
    
    try {
        const results = await db.query("INSERT INTO items (name, price, category, description) values ($1, $2, $3, $4) RETURNING *", 
        [req.body.name, req.body.price, req.body.category, req.body.description]);
        console.log(results);
        res.status(201).json({
            data: results.rows
        })
        console.log(results);
    } catch(e) {
            console.log(e);
    }
});

// update an item
app.put("/api/v1/items/:id", (req, res) => {
    console.log(req.params.id);
    console.log(req.body);
});

// Delete an item
app.delete("/api/v1/items/:id", (req, res) => {
    res.status(202).json({
        status: "Deleted"
    });
});





