#!/usr/bin/env node

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const express = require("express"),
      cors = require("cors"),
      app = express.createServer(),
      cors_app = express.createServer(),
      root = __dirname + '/../',
      client = root + "client/",
      IP_ADDRESS = process.env['IP_ADDRESS'] || "0.0.0.0",
      PORT = process.env['PORT'] || "3000",
      CORS_PORT = process.env['CORS_PORT'] || "3001";

// Set up the main app

app.set("views", client + "templates");
app.use(express.static(client + "static"));
app.use(express.bodyParser());

app.get("/", function(req, res) {
  res.render("index.ejs", { layout: false });
});

app.get("/index.html", function(req, res) {
  res.render("index.ejs", { layout: false });
});

function toString(fields) {
  var parts = [];
  for(var key in fields) {
    parts.push(key + "=" + fields[key]);
  }

  var str = parts.join("&") || "";
  return str;
}

app.get("/get_success_text", function(req, res) {
  res.contentType("text");
  res.send(toString(req.query));
});

app.get("/get_success_json", function(req, res) {
  res.json(req.query);
});

app.get("/get_failure", function(req, res) {
  res.send("get failure", 400);
});

app.get("/get_headers", function(req, res) {
  res.json(req.headers);
});

app.get("/request_with_latency", function(req, res) {
  var timeout = req.params.timeout || 5000;

  setTimeout(function() {
    res.json({ success: true });
  }, timeout);
});


app.post("/post_success_text", function(req, res) {
  res.contentType("text");
  res.send(toString(req.body));
});

app.post("/post_success_json", function(req, res) {
  res.json(req.body);
});

app.post("/post_failure", function(req, res) {
  res.send("post failure", 400);
});

app.post("/post_headers", function(req, res) {
  res.json(req.headers);
});

console.log("listening on: " + IP_ADDRESS + ":" + PORT);
app.listen(PORT, IP_ADDRESS);

// Set up the CORS app

cors_app.use(cors());
cors_app.get("/cors_get_success_text", function(req, res) {
  res.contentType("text");
  res.send("this is a CORS response");
});

cors_app.post("/cors_post_success_text", function(req, res) {
  res.contentType("text");
  res.send("this is a CORS POST response");
});

console.log("listening on: " + IP_ADDRESS + ":" + CORS_PORT);
cors_app.listen(CORS_PORT, IP_ADDRESS);

