const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");

app.use(express.static("public"));
app.use(express.static("uploads"));
app.set("view engine", "ejs");

mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost/nodeApp", { useNewUrlParser: true });

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const Router = require("./routes/Router");
app.get("/", function(req, res) {
  res.render("index");
});

app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.use("/", Router);

app.listen(3000, () => console.log("Listening on port 3000.."));
