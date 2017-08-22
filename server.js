const express = require('express');
const app = express();
const path = require('path');
const request = require('request');

/** Middleware to handle api request to billing service */
app.use('/api', function(req, res) {
    const apiUrl = 'http://'+process.env.BILLINGSERVICE_SERVICE_HOST +':'+ process.env.BILLINGSERVICE_SERVICE_PORT;
  let url = apiUrl + req.url;
  req.pipe(request({ qs:req.query, uri: url })).pipe(res);
});

app.use(express.static(__dirname + '/dist'));

app.get('/*', function(req, res) {
    res.sendFile(path.join(__dirname + '/dist/index.html'));
});

app.listen(80);