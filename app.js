var express = require('express');
var app = express();
const port = process.env.PORT || 4000;
var bodyParser = require('body-parser');
var dateFormat = require('dateformat');

//Parse incoming requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//Middleware
app.use(function (req, res, next) {
    console.log("\r");
    var d = dateFormat(Date.now(), "dd/mm/yyyy H:MM:ss TT");
    console.log(d + ": " + req.method + " " + req.url);
    var interceptObj = function (obj, key) { if (obj && Object.keys(obj).length > 0) { console.log(key, obj); } }
    interceptObj(req.query, "query");
    interceptObj(req.params, "params");
    interceptObj(req.body, "body");
    next();  // Passing the request to the next handler in the stack.
});

// serve static files from template
app.use(express.static(__dirname + '/public'));

var serverInfo = {
    expressVersion: require('express/package').version,
    port: port,
    upTime: dateFormat(Date.now(), "dd/mm/yyyy H:MM:ss TT"),
}

app.get('/server', function (req, res) {
    res.send(serverInfo);
})

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('File Not Found');
    err.status = 404;
    next(err);
});

// error handler
// define as the last app.use callback
app.use(function (err, req, res, next) {
    console.log("Error handler");
    res.status(err.status || 500);
    console.log(err.message);
    console.log(err.status);
    res.send(err.message);
});

app.listen(port);

console.log('Server is listening on port: ' + port);