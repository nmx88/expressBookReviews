const express = require("express");
const axios = require("axios");
const books = require("./booksdb.js");
// let isValid = require("./auth_users.js").isValid;
// let users = require("./auth_users.js").users;
const public_users = express.Router();

// public_users.post("/register", (req, res) => {
//   //Write your code here
//   return res.status(300).json({ message: "Yet to be implemented" });
// });

// Get the book list available in the shop
public_users.get("/", async function (req, res) {
  //Write your code here
  try {
    return res.status(200).json(books);
  } catch (error) {
    console.error("Error fetching books:", error.message);
    return res.status(500).json({ message: "Failed to fetch books." });
  }
});

// Get book details based on ISBN
// Function to fetch book details by ISBN asynchronously
async function getBookByISBN(isbn) {
  return new Promise((resolve, reject) => {
    // Simulating fetching book details from a db or external API
    setTimeout(() => {
      const book = books[isbn];
      if (book) {
        resolve(book);
      } else {
        reject(new Error("Book not found"));
      }
    }, 500); // Delay
  });
}

public_users.get("/isbn/:isbn", async function (req, res) {
  //Write your code here
  const isbn = req.params.isbn; // Retrieve the ISBN from the request parameters
  try {
    const book = await getBookByISBN(isbn); // Look up the book details using the ISBN
    return res.status(200).send(JSON.stringify(book, null, 2));
  } catch (error) {
    console.error("Error fetching book details:", error.message);
    return res
      .status(404)
      .json({ message: "This ISBN didn't return any book" });
  }
});

// Get book details based on author
public_users.get("/author/:author", async function (req, res) {
  try {
    const author = req.params.author;
    let matchedBooks = [];

    // Iterate through the books object to find books by the specified author

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
    // Return Matched books
    if (matchedBooks.length > 0) {
      return res.status(200).json(matchedBooks);
    } else {
      return res
        .status(404)
        .json({ message: "Books not found from this author" });
    }
  } catch (error) {
    console.error("Error fetching books by author:", error.message);
    return res.status(500).json({ message: "Failed to fetch books by author" });
  }
});

// Get all books based on title
// Function to fetch books by title asynchronously (simulated)
async function getBooksByTitle(title) {
  return new Promise((resolve, reject) => {
    // Simulate fetching book details from a database or external API
    setTimeout(() => {
      let matchedBooks = [];

      Object.keys(books).forEach((isbn) => {
        const book = books[isbn];
        if (book.title.toLowerCase() === title.toLowerCase()) {
          matchedBooks.push({
            isbn: isbn,
            author: book.author,
            reviews: book.reviews,
          });
        }
      });

      if (matchedBooks.length > 0) {
        resolve(matchedBooks);
      } else {
        reject(new Error("Books not found with this title"));
      }
    }, 500); // Simulating delay
  });
}

// Get book details based on title asynchronously with async-await and Axios
public_users.get("/title/:title", async function (req, res) {
  const title = req.params.title; // Retrieve the title from the request parameters

  try {
    // Simulating asynchronous operation using setTimeout and Promise
    const matchedBooks = await getBooksByTitle(title);

    return res.status(200).json(matchedBooks);
  } catch (error) {
    console.error("Error fetching books by title:", error.message);
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
