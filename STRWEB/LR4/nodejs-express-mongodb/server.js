const express = require("express");
const cors = require("cors");
const passport = require("./app/config/passport"); 

const app = express();

var corsOptions = {
  origin: "http://localhost:3000"
};

app.use(cors(corsOptions));

app.use(express.json({ limit: '50mb' }));

app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use(passport.initialize());

const db = require("./app/models");
const Role = db.role;

const connectWithRetry = (retries = 5) => {
  console.log("Attempting to connect to the database...");
  db.mongoose
    .connect(db.url)
    .then(() => {
      console.log("Successfully connected to the database!");
      initial();
    })
    .catch(err => {
      if (retries > 0) {
        console.log(`Cannot connect to the database, retrying in 5 sec... (${retries - 1} attempts left)`);
        setTimeout(() => connectWithRetry(retries - 1), 5000);
      } else {
        console.log("Could not connect to the database after multiple attempts. Exiting.", err);
        process.exit();
      }
    });
};

connectWithRetry();

async function initial() {
  try {
    const count = await Role.estimatedDocumentCount();
    if (count === 0) {
      await new Role({ name: "user" }).save();
      console.log("added 'user' to roles collection");

      await new Role({ name: "admin" }).save();
      console.log("added 'admin' to roles collection");
    }
  } catch (err) {
    console.log("error", err);
  }
}

app.get("/", (req, res) => {
  res.json({ message: "Welcome to Household Chemicals Store application." });
});

require('./app/routes/auth.routes')(app);
require("./app/routes/product.routes")(app);
require("./app/routes/category.routes")(app);
require("./app/routes/ollama.routes")(app); 

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
