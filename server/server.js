const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

require("dotenv").config();
const DBURL = process.env.MONGODB_URL;
const PORT = process.env.PORT;
const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;

const register = require("./routes/register.js");

//creating express app
const app = express();

//cors
app.use(cors());

// Bodyparser middleware
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use(bodyParser.json());

//connecting to mongodb
const User = require("./model/User.js");
mongoose
  .connect(DBURL, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("MongoDB successfully connected");
  })
  .catch((err) => console.log(err));

// unsplash
require("es6-promise").polyfill();
require("isomorphic-fetch");
const nodeFetch = require("node-fetch").nodeFetch;
const createApi = require("unsplash-js").createApi;

const unsplash = createApi({
  accessKey: UNSPLASH_ACCESS_KEY,
  fetch: nodeFetch,
});

//routes
app.use(require("./routes/index")(unsplash));

//listen
app.listen(PORT, () => console.log(`Server up and running on port ${PORT}`));
