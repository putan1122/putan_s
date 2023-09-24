const express = require('express');
const cors = require('cors');
const config = require('./config');
const routes = require('./routes');

const app = express();
app.use(cors({
  origin: '*',
}));

// We use express to define our various API endpoints and
// provide their handlers that we implemented in routes.js
app.get('/owner/:type', routes.owner);
app.get('/random/:type', routes.random);
app.get('/authors', routes.authors);
app.get('/popular_books/:rate_type', routes.popular_books);
app.get('/search_books', routes.search_books);
app.get('/search_authors', routes.search_authors);
app.get('/popular_books/:rate_type', routes.popular_books);
app.get('/search_books/:book_id', routes.book_from_id);
app.get('/search_authors/:author_id', routes.author_from_id);
app.get('/author_genres/:author_id', routes.author_genres);
app.get('/book_genres/:book_id', routes.book_genres);
app.get('/search_book_authors/:book_id', routes.get_book_authors);
app.get('/popular_authors', routes.get_popular_authors);
app.get('/popular_genres', routes.get_popular_genres);


app.listen(config.server_port, () => {
  console.log(`Server running at http://${config.server_host}:${config.server_port}/`)
});

module.exports = app;
