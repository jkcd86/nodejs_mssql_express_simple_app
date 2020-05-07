var express = require("express");
var bodyParser = require("body-parser");
var sql = require("mssql");
var cors = require("cors");
var app = express();

// Body Parser Middleware
app.use(bodyParser.json());
app.use(cors());

// Setting up server
var server = app.listen(process.env.PORT || 8080, function(){
    var port = server.address().port;
    console.log("App now running on port", port);
});

// Initializing connection string
var dbConfig = {
  user: process.env.USER,
  password: process.env.PASSWORD,
  server: process.env.SERVER,
  database: process.env.DataBase,
};

// GET API
app.get("/api/v1/employee", function(req, res) {
    getEmployess()
});

function getEmployess() {
    var dbConn = new sql.ConnectionError(dbConfig);
    dbConn.connect().then(function() {
        var request = new sql.Request(dbConn);
        request.query("SELECT * FROM employee").then(function (resp) {
            console.log(resp);
            dbConn.Close();
        }).catch(function (err) {
            console.log(err);
            dbConn.close();
        });
    }).catch(function (err) {
        console.log(err);
    });
}

// POST API
app.post("/api/v1/employee", function (req, res) {
  insertEmployees();
});
function insertEmployees() {
  var dbConn = new sql.Connection(dbConfig);
  dbConn.connect().then(function () {
    var transaction = new sql.Transaction(dbConn);
    transaction
      .begin()
      .then(function () {
        var request = new sql.Request(transaction);
        request
          .query(
            "INSERT INTO employee (name,salary,age) VALUES (req.body.name,req.body.salary,req.body.age"
          )
          .then(function () {
            transaction
              .commit()
              .then(function (resp) {
                console.log(resp);
                dbConn.close();
              })
              .catch(function (err) {
                console.log("Error in Transaction Commit " + err);
                dbConn.close();
              });
          })
          .catch(function (err) {
            console.log("Error in Transaction Begin " + err);
            dbConn.close();
          });
      })
      .catch(function (err) {
        console.log(err);
        dbConn.close();
      })
      .catch(function (err) {
        //12.
        console.log(err);
      });
  });
}

