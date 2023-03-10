//jshint esversion:6
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.set("strictQuery", false);
mongoose.connect("mongodb://127.0.0.1:27017/userDB", { useNewUrlParser: true });

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});

const User = mongoose.model("User", userSchema);

app.get("/", function (req, res) {
  res.render("home");
});

app.get("/login", function (req, res) {
  res.render("login");
});

app.get("/register", function (req, res) {
  res.render("register");
});

app.get("/secrets", function (req, res) {
  res.render("secrets");
});

app.post("/register", function (req, res) {
  const user = new User({
    email: req.body.username,
    password: req.body.password,
  });
  user.save(function (err) {
    if (!err) {
      res.render("secrets");
    } else {
      console.log(err);
    }
  });
});

app.post("/login", function (req, res) {
  User.findOne({ email: req.body.username }, function (err, result) {
    if (err) {
      console.log(err);
    } else {
      if (result) {
        if (result.password === req.body.password) {
          res.render("secrets");
        } else {
          console.log("wrong pass");
        }
      } else {
        console.log("wrong email");
      }
    }
  });
});

app.listen(3000, function () {
  console.log("server is running on port 3000!");
});
