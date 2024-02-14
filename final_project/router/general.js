const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username)=>{
    let userswithsamename = users.filter((user)=>{
      return user.username === username
    });
    if(userswithsamename.length > 0){
      return true;
    } else {
      return false;
    }
  }

public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

  if (username && password) {
    if (!doesExist(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});    
    }
  } 
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    let booklist = new Promise((resolve, reject)=>{
        resolve(books)
    })
    booklist.then((data)=> {
        res.send(JSON.stringify(data, null, 4 ));
    })
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    let book = new Promise((resolve, reject) =>{
        resolve(books[isbn])
    })
    book.then((data)=> {
        res.send(JSON.stringify(data, null, 4 ));
 })
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const bookKeys = Object.keys(books);
    const BooksbyAuthor = [];
    let BooksPromise = new Promise((resolve, reject) => {
    for (const key of bookKeys) {
        const book = books[key];
        if (book.author === req.params.author) {
            BooksbyAuthor.push(book)
        }
        
    }
    resolve(BooksbyAuthor)
})
    BooksPromise.then((data)=> {
    res.send(JSON.stringify(data,null,4));
    })
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const bookKeys = Object.keys(books);
    const BooksbyTitle = [];
    let BooksPromise = new Promise((resolve, reject) => {
    for (const key of bookKeys) {
        const book = books[key];
        if (book.title === req.params.title) {
            BooksbyTitle.push(book)
        }
        
    }
    resolve(BooksbyTitle)
})
    BooksPromise.then((data)=> {
    res.send(JSON.stringify(data,null,4));
    })
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    res.send(JSON.stringify(books[isbn].reviews,null,4))
});

module.exports.general = public_users;
