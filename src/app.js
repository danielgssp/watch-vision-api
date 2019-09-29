const PORT = 4000;
const express = require("express");
var bodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;

const uri =
  "mongodb+srv://admin:123@watchvision-r9f5i.mongodb.net/test?retryWrites=true&w=majority";

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(function(req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "content-type");
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});

//create
app.post("/create", function(req, res) {
  const client = new MongoClient(uri, { useNewUrlParser: true });
  var datetime = new Date();
  var media = {
    ...req.body,
    date: datetime
  };

  client.connect(err => {
    const collection = client.db("mediadb").collection("media");
    collection.insertOne(media, function(err, res) {
      console.log("saved!");
    });

    client.close();
  });

  res.json({ code: 200, status: "successfull" });
});

//listAll
app.get("/listMedia", function(req, res) {
  const client = new MongoClient(uri, { useNewUrlParser: true });
  client.connect(err => {
    const collection = client.db("mediadb").collection("media");
    collection.find({}).toArray(function(err, result) {
      if (err) throw err;
      res.json(result);
      client.close();
    });

    client.close();
  });
});

app.listen(PORT, () => console.log("Server Up:)"));
