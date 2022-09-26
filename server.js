/////////////////////
//DEPENDENCIES
/////////////////////
//get .env variables
require("dotenv").config();
//pull PORT from .env, give default value of 4000
const { PORT = 4000, MONGODB_URL } = process.env;
//import express
const express = require("express");
const { default: mongoose } = require("mongoose");
//create application object
const app = express();
//import middlewares
const cors = require("cors");
const morgan = require("morgan");

// const MONGODB_URL = process.env.MONGODB_URL
///////////////////////
//DATABASE CONNECTION
///////////////////////
//Establish Connection
mongoose.connect(
  MONGODB_URL /*, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
}*/
);
//Connection Events
mongoose.connection
  .on("open", () => console.log("You are Connected to Mongoose"))
  .on("close", () => console.log("You are Disconnected from Mongoose"))
  .on("error", (error) => console.log(error));

///////////////////////
//MODELS
//////////////////////
const PeopleSchema = new mongoose.Schema({
  name: String,
  image: String,
  title: String,
});

const People = mongoose.model("People", PeopleSchema);

//////////////////////
//MIDDLEWARE
///////////////////////
app.use(cors()); //prevent cors errors, open access to all origins
app.use(morgan("dev")); //logging
app.use(express.json()); //parse json bodies

///////////////////////
//ROUTES
///////////////////////
//test route
app.get("/", (req, res) => {
  res.send("Hello World");
});

//INDEX
app.get("/people", async (req, res) => {
  try {
    //send all people
    res.json(await People.find({}));
  } catch (error) {
    //send error
    res.status(400).json(error);
  }
});

//CREATE
app.post("/people", async (req, res) => {
  try {
    //send all people
    res.json(await People.create(req.body));
  } catch (error) {
    //send error
    res.status(400).json(error);
  }
});

//DELETE

app.delete("/people/:id", async (req, res) => {
  try {
    //send all people
    res.json(await People.findByIdAndDelete(req.params.id));
  } catch (error) {
    //send error
    res.status(400).json(error);
  }
});

//UPDATE
app.put("/people/:id", async (req, res) => {
  try {
    //send all people
    res.json(
      await People.findByIdAndUpdate(req.params.id, req.body, { new: true })
    );
  } catch (error) {
    //send error
    res.status(400).json(error);
  }
});

////////////////////////
//LISTENER
////////////////////////
app.listen(PORT, () => console.log(`listening on PORT ${PORT}`));
