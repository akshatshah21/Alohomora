const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

const register = require("./routes/register.js");

require("dotenv").config();
const DBURL = process.env.DBURL;
const PORT = process.env.PORT;

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

//routes
app.use("/api/register", register);

//listen
app.listen(PORT, () => console.log(`Server up and running on port ${PORT}`));
