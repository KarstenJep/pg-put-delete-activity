//const { response } = require("express");

$(document).ready(function(){
  console.log('jQuery sourced.');
  refreshBooks();
  addClickHandlers();
});

function addClickHandlers() {
  $('#submitBtn').on('click', handleSubmit);
  // TODO - Add code for edit & delete buttons
  $('#bookShelf').on('click', '.delete-book', deleteSongHandler)
  $('#bookShelf').on('click', '.mark-read', markReadHandler)
}

function handleSubmit() {
  console.log('Submit button clicked.');
  let book = {};
  book.author = $('#author').val();
  book.title = $('#title').val();
  book.read = false;
  addBook(book);
}

// adds a book to the database
function addBook(bookToAdd) {
  $.ajax({
    type: 'POST',
    url: '/books',
    data: bookToAdd,
    }).then(function(response) {
      console.log('Response from server.', response);
      refreshBooks();
    }).catch(function(error) {
      console.log('Error in POST', error)
      alert('Unable to add book at this time. Please try again later.');
    });
}

// refreshBooks will get all books from the server and render to page
function refreshBooks() {
  $.ajax({
    type: 'GET',
    url: '/books'
  }).then(function(response) {
    console.log(response);
    renderBooks(response);
  }).catch(function(error){
    console.log('error in GET', error);
  });
}


// Displays an array of books to the DOM
function renderBooks(books) {
  $('#bookShelf').empty();

  for(let i = 0; i < books.length; i += 1) {
    let book = books[i];
    // For each book, append a new row to our table
    //console.log('in renderBooks', book.title, book.author, book.isRead);
    
    $('#bookShelf').append(`
      <tr>
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.isRead}</td>
        <td>
          <button class="mark-read" data-id="${book.id}">Mark as Read</button>
          <button class="delete-book" data-id="${book.id}">Delete</button>
        </td>
      </tr>
    `);
  }
}

// Handler for mark as read button
function markReadHandler() {
  markRead($(this).data("id"), "true");
}

function markRead(bookId, hasRead) {
  console.log('In markRead');
  $.ajax({
    method: 'PUT',
    url: `/books/${bookId}`,
    data: {
      read: hasRead
    }
  })
  .then(response => {
    console.log('Marked read', bookId);
    refreshBooks();
  })
  .catch(error => {
    alert('error on markRead', error)
  })
}

// Handler for delete button. Call AJAX to delete book
function deleteSongHandler() {
  console.log('Deleting', this);
  
    deleteBook($(this).data("id"));
}

// Delete AJAX call for deleting book
function deleteBook(bookId) {
    $.ajax({
      method: 'DELETE',
      url: `/books/${bookId}`, 
    })
    .then(response => {
      console.log('deleted book', bookId);
      refreshBooks();
    })
    .catch(error => {
      alert('error on deleteBook', error)
    })
}