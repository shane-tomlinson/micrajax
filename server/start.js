#!/usr/bin/env node

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const express = require("express"),
      app = express.createServer(),
      root = __dirname + '/../';


app.set("views", root + "templates");
app.use(express.static(root + "client"));
app.use(express.bodyParser());

app.get("/", function(req, res) {
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
  var str = toString(req.query);
  res.contentType("text");
  res.send(toString(req.query));
});

app.get("/get_success_json", function(req, res) {
  res.json(req.query);
});

app.get("/get_failure", function(req, res) {
  res.send("get failure", 500);
});

app.post("/post_success_text", function(req, res) {
  res.contentType("text");
  res.send(toString(req.body));
});

app.post("/post_success_json", function(req, res) {
  res.json(req.body);
});

app.post("/post_failure", function(req, res) {
  res.send("post failure", 500);
});

app.listen(3000);

