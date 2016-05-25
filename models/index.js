var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/book-app");

// models/index.js - import/export Book model
module.exports.Book = require("./book.js");

// author/index.js - import/export Author model
module.exports.Author = require("./author.js");
