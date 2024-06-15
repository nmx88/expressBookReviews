const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb");
// const { json } = require("express");
// const books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  //returns boolean
  //write code to check is the username is valid
  return users.includes(username);
};

const authenticatedUser = (username, password) => {
  //returns boolean
  return users[username] === password;
  //write code to check if username and password match the one we have in records.
};

// New user registration

regd_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  // Check if username/password missing
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required!" });
  }

  // Username already exists
  if (isValid(username)) {
    return res.status(400).json({ message: "Username already exists." });
  }

  // User registration
  users.push(username);
  users[username] = password;

  return res.status(200).json({ message: " User registration completed!" });
});

//only registered users can login
regd_users.post("/login", (req, res) => {
  //Write your code here
  const { username, password } = req.body;

  // Check if username or password is missing
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required." });
  }

  // Check if the username exists and password matches
  if (authenticatedUser(username, password)) {
    const accessToken = jwt.sign({ username: username }, "access");
    req.session.authorization = { accessToken };
    return res.status(200).json({ accessToken });
  } else {
    return res.status(401).json({ message: "Invalid username or password." });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const { review } = req.body;

  const loggedInUser = req.user.username;

  // Check if review data is missing
  if (!review || typeof review !== "string") {
    return res.status(400).json({ message: "Review data is required." });
  }

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found." });
  }

  if (!books[isbn].reviews) {
    books[isbn].reviews = {};
  }

  // Check if there's already a review by the logged-in user for this ISBN
  if (books[isbn].reviews[loggedInUser]) {
    // Modify the existing review
    books[isbn].reviews[loggedInUser] = review;
    return res.status(200).json({ message: "Review updateD successfully." });
  } else {
    // New Review
    books[isbn].reviews[loggedInUser] = review;
    return res.status(200).json({ message: "Review added successfully." });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
