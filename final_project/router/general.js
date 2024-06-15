const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  //Write your code here
  return res.status(300).json({ message: "Yet to be implemented" });
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  //Write your code here
  return res.status(200).send(JSON.stringify(books, null, 2));
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  //Write your code here
  const isbn = req.params.isbn; // Retrieve the ISBN from the request parameters
  const book = books[isbn]; // Look up the book details using the ISBN

  if (book) {
    return res.status(200).send(JSON.stringify(book, null, 2));
  } else {
    return res
      .status(404)
      .json({ message: "This ISBN didn't return any book" });
  }
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  //Write your code here
  const author = req.params.author;

  let matchedBooks = [];

  Object.keys(books).forEach((isbn) => {
    const book = books[isbn];
    if (book.author === author) {
      matchedBooks.push({
        isbn: isbn,
        title: book.title,
        reviews: book.reviews,
      });
    }
  });

  if (matchedBooks.length > 0) {
    return res.status(200).json(matchedBooks);
  } else {
    return res
      .status(404)
      .json({ message: "Books not found from this author" });
  }
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  // Retrieve the title from the request parameters
  const title = req.params.title;

  // Initialize an array to store matched books
  let matchedBooks = [];

  // Iterate through the books object
  Object.keys(books).forEach((isbn) => {
    const book = books[isbn];
    // Check if the book title matches the one provided in the request parameters
    if (book.title.toLowerCase() === title.toLowerCase()) {
      // If a match is found, add the book details to the matchedBooks array
      matchedBooks.push({
        isbn: isbn,
        author: book.author,
        reviews: book.reviews,
      });
    }
  });

  // If matchedBooks array is not empty, return the matched books with status 200
  if (matchedBooks.length > 0) {
    return res.status(200).json(matchedBooks);
  } else {
    // If no books are found, return a 404 status with an appropriate message
    return res.status(404).json({ message: "Books not found with this title" });
  }
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  //Write your code here
  const isbn = req.params.isbn; // Retrieve the ISBN from the request parameters
  const book = books[isbn]; // Look up the book details using the ISBN
  if (book && book.reviews) {
    return res.status(200).send(JSON.stringify(book.reviews, null, 2));
  } else {
    return res
      .status(404)
      .json({ message: "This ISBN didn't return any reviews" });
  }
});

module.exports.general = public_users;
