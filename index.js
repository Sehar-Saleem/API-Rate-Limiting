const express = require("express");

require("dotenv").config();

const app = express();
const port = process.env.PORT;

app.use(express.static("public"));
app.use(express.json());

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});
