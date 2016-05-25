var mongoose = require("mongoose");
var Schema = mongoose.Schema;

// books schema
var BookSchema = new Schema({
     title: String,
     author: {
       type: Schema.Types.ObjectId,
       ref: "Author"
     },
     image: String,
     release_date: String
});

// books model
var Book = mongoose.model("Book", BookSchema);

module.exports = Book;
