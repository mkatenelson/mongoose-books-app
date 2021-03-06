// server.js
// SERVER-SIDE JAVASCRIPT


/////////////////////////////
//  SETUP and CONFIGURATION
/////////////////////////////

//require express in our app
var express = require('express'),
  bodyParser = require('body-parser');

// generate a new express app and call it 'app'
var app = express();

var db = require('./models');
// serve static files in public
app.use(express.static('public'));

// body parser config to accept our datatypes
app.use(bodyParser.urlencoded({ extended: true }));


////////////////////
//  DATA
///////////////////

var books = [
  {
    _id: 15,
    title: 'The Four Hour Workweek',
    author: 'Tim Ferriss',
    image: 'https://s3-us-west-2.amazonaws.com/sandboxapi/four_hour_work_week.jpg',
    release_date: 'April 1, 2007'
  },
  {
    _id: 16,
    title: 'Of Mice and Men',
    author: 'John Steinbeck',
    image: 'https://s3-us-west-2.amazonaws.com/sandboxapi/of_mice_and_men.jpg',
    release_date: 'Unknown 1937'
  },
  {
    _id: 17,
    title: 'Romeo and Juliet',
    author: 'William Shakespeare',
    image: 'https://s3-us-west-2.amazonaws.com/sandboxapi/romeo_and_juliet.jpg',
    release_date: 'Unknown 1597'
  }
];







////////////////////
//  ROUTES
///////////////////

// define a root route: localhost:3000/
app.get('/', function (req, res) {
  res.sendFile('views/index.html' , { root : __dirname});
});

// get all books
app.get('/api/books', function (req, res) {
  // send all books as JSON response
  db.Book.find()
    // populate fills in the author id with all the author data
    .populate('author')
    .exec(function(err, books){
      if (err) { return console.log('index error: ' + err); }
      res.json(books);
    });
});

// get one book
app.get('/api/books/:id', function (req, res) {
  // find one book by its id
  db.Book.findById(req.params.id, function(err, book) {
    if(err) { return console.log('show error: ' + err); }
    res.json(book);
  });
});

// create new book
app.post('/api/books', function (req, res) {
  // create new book with form data (`req.body`)
  var newBook = new db.Book({
    title: req.body.title,
    image: req.body.image,
    releaseDate: req.body.releaseDate,
  });


  // this code will only add an author to a book if the author already exists
    db.Author.findOne({name: req.body.author}, function(err, author){
      newBook.author = author;
      // add newBook to database
      newBook.save(function(err, book){
        if (err) {
          return console.log('create error: ' + err);
        }
        console.log('created ', book.title);
        res.json(book);
      });
    });

  });


  // Create a character associated with a book
  app.post('/api/books/:book_id/characters', function (req, res) {
    // Get book id from url params (`req.params`)
    var bookId = req.params.book_id;
    db.Book.findById(bookId)
      .populate('author') // Reference to author
      // now we can worry about saving that character
      .exec(function(err, foundBook) {
        console.log(foundBook);
        if (err) {
          res.status(500).json({error: err.message});
        } else if (foundBook === null) {
          // Is this the same as checking if the foundBook is undefined?
          res.status(404).json({error: 'No Book found by this ID'});
        } else {
          // push character into characters array
          foundBook.characters.push(req.body);
          // save the book with the new character
          foundBook.save();
          res.status(201).json(foundBook);
        }
      }
    );
  });
  

// update book
// app.put('/api/books/:id', controllers.books.update);

// delete book
app.delete('/api/books/:id', function (req, res) {
  // get book id from url params (`req.params`)
  console.log(req.params);
  var bookId = req.params.id;
  // find the index of the book we want to remove
  var deleteBookIndex = books.findIndex(function(element, index) {
    return (element._id === parseInt(req.params.id)); //params are strings
  });
  console.log('deleting book with index', deleteBookIndex);
  var bookToDelete = books[deleteBookIndex];
  books.splice(deleteBookIndex, 1);
  res.json(bookToDelete);
});

app.post('/api/books/:book_id/characters', function(req, res));




app.listen(process.env.PORT || 3000, function () {
  console.log('Example app listening at http://localhost:3000/');
});
