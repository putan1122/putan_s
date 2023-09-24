const mysql = require("mysql")
const config = require("./config.json")

// Creates MySQL connection using database credential provided in config.json
// Do not edit. If the connection fails, make sure to check that config.json is filled out correctly
const connection = mysql.createConnection({
  host: config.rds_host,
  user: config.rds_user,
  password: config.rds_password,
  port: config.rds_port,
  database: config.rds_db
});
connection.connect((err) => err && console.log(err));

/********************************
 * BASIC INFO ROUTES *
 ********************************/

// Route 1: GET /owner/:type
const owner = async function (req, res) {
  // TODO (TASK 1): replace the values of name and pennKey with your own
  const name = 'Tianyi Wei & Yuan Zhuang & Meiru Han & Pu Tan';
  const pennKey = 'tywei & paulzy & meiru & putan';

  // checks the value of type the request parameters
  // note that parameters are required and are specified in server.js in the endpoint by a colon (e.g. /author/:type)
  if (req.params.type === 'name') {
    // res.send returns data back to the requester via an HTTP response
    res.send(`Created by ${name}`);
  } else if (req.params.type === 'pennkey') {
    res.send(`Created by ${pennKey}`);
    // TODO (TASK 2): edit the else if condition to check if the request parameter is 'pennkey' and if so, send back response 'Created by [pennkey]'
  } else {
    // we can also send back an HTTP status code to indicate an improper request
    res.status(400).send(`'${req.params.type}' is not a valid author type. Valid types are 'name' and 'pennkey'.`);
  }
};

// Route 2: GET /random/:type
const random = async function (req, res) {
  // Here is a complete example of how to query the database in JavaScript.
  // Only a small change (unrelated to querying) is required for TASK 3 in this route.
  if (req.params.type === 'book') {
    connection.query(`
      SELECT book_id, title
      FROM Book
      ORDER BY RAND(FLOOR((UNIX_TIMESTAMP() - 14400)/86400))
      LIMIT 1;
    `, (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.json({});
      } else {
        res.json(data);
      }
  });
  } else if (req.params.type === 'author') {
    connection.query(`
    SELECT author_id, name
    FROM Author
    ORDER BY RAND(FLOOR((UNIX_TIMESTAMP() - 14400)/86400)+1)
    LIMIT 1;
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data);
    }
  });
  } else {
    res.status(400).send(`'${req.params.type}' is not a valid random recommendation type. Valid types are 'book' and 'author'.`);
  }
};


// Route 3: GET /authors
// List all authors in alphabetic order by Last name
const authors = async function (req, res) {
  connection.query(`
  SELECT author_id, name
  FROM Author
  ORDER BY SUBSTRING_INDEX(name, ' ', -1)`,
  (err, data) => {
    if (err || data.length === 0) {
      console.log(err)
      res.json({});
    } else {
      res.json(data);
    }
  }); 
};


// Route 4: GET /search_books/:book_id
const book_from_id = async function (req, res) {
  connection.query(
  `
  SELECT DISTINCT B.book_id, B.title, B.description, B.image, B.preview_link, B.publisher, B.published_date, R.user_id, R.score, R.review_text, U.name as user_name
  FROM Book B
  JOIN Review R ON B.book_id = R.book_id
  JOIN User U on U.user_id = R.user_id
  WHERE B.book_id = '${req.params.book_id}'`,
    (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.json({});
      } else {
        res.json(data);
      }
    }
  );
};

// Route 5: GET /search_authors/:author_id
const author_from_id = async function (req, res) {
  connection.query(
  `
  SELECT A.author_id, A.name, A.fan_count, A.image_url, A.rating_count, A.website, A.about, A.average_rate, A.country, B.book_id, B.image, B.title
  FROM Author A JOIN Author_Of AO 
  ON A.author_id = AO.author_id 
  JOIN Book B ON AO.book_id = B.book_id
  JOIN Review R ON B.book_id = R.book_id
  WHERE A.author_id = '${req.params.author_id}'
  GROUP BY B.book_id
  ORDER BY COUNT(R.user_id) DESC`,
    (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.json({});
      } else {
        res.json(data);
      }
    }
  );
};

// Route 6: GET /book_genres/:book_id
const book_genres = async function (req, res) {
  connection.query(
    `
    SELECT DISTINCT G.name
    FROM Book B JOIN Belong_To BT ON B.book_id = BT.book_id
    JOIN Genre G ON G.genre_id = BT.genre_id
    WHERE B.book_id = '${req.params.book_id}'
  `,
    (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.json({});
      } else {
        res.json(data);
      }
    }
  );
};

// Route 7: GET /author_genres/:author_id
const author_genres = async function (req, res) {
  connection.query(
    `
    SELECT DISTINCT G.name
    FROM Author A JOIN Write_In WI on A.author_id = WI.author_id
    JOIN Genre G on WI.genre_id = G.genre_id
    WHERE A.author_id = '${req.params.author_id}'`,
    (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.json({});
      } else {
        res.json(data);
      }
    }
  );
};

// Route 8: GET /search_book_authors/:book_id
//get author info for a book id 
const get_book_authors = async function (req, res) {
  connection.query(
    `
    SELECT DISTINCT A.name, A.author_id
    FROM Book B
    JOIN Author_Of AO on B.book_id = AO.book_id
    JOIN Author A on AO.author_id = A.author_id
    WHERE B.book_id = '${req.params.book_id}'`,

    (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.json({});
      } else {
        res.json(data);
      }
    }
  );
};

/************************
 * ADVANCED INFO ROUTES *
 ************************/

// Route 9 (complex): GET /popular_books/:rate_type
const popular_books = async function (req, res) {
  const page = req.query.page;
  const pageSize = req.query.page_size ?? 10;

  if (!page) {
    if (req.params.rate_type === 'num_rating') {
      connection.query(`
      WITH book_rating AS (
        SELECT Book.book_id, COUNT(user_id) AS num_rating
        FROM Review JOIN Book
        ON Review.book_id = Book.book_id
        GROUP BY Book.book_id)
      SELECT Book.book_id, Book.title, book_rating.num_rating
      FROM Book JOIN book_rating 
      ON Book.book_id = book_rating.book_id
      ORDER BY num_rating DESC
      LIMIT 100;`, 
      (err, data) => {
        if (err || data.length === 0) {
          console.log(err);
          res.json({});
        } else {
          res.json(data);
        }
      }); 
    } else if (req.params.rate_type === 'ave_rating') {
      //Might need to change this to a new route for getting average rating for each book
      connection.query(`
      WITH book_rating AS (
        SELECT Book.book_id, ROUND(AVG(Review.score),2) AS avg_rating
        FROM Review JOIN Book
        ON Review.book_id = Book.book_id
        GROUP BY Book.book_id)
      SELECT Book.book_id, Book.title, book_rating.avg_rating
      FROM Book JOIN book_rating 
      ON Book.book_id = book_rating.book_id
      ORDER BY avg_rating DESC
      LIMIT 100;`, 
      (err, data) => {
        if (err || data.length === 0) {
          console.log(err);
          res.json({});
        } else {
          res.json(data);
        }
      }); 
    } else {res.status(400).send(`'${req.params.rate_type}' is not a valid rating type. Valid types are 'num_rating' and 'ave_rating'.`);}
  } else {
    if (req.params.rate_type === 'num_rating') {
      connection.query(`
      WITH book_rating AS (
        SELECT Book.book_id, COUNT(user_id) AS num_rating
        FROM Review JOIN Book
        ON Review.book_id = Book.book_id
        GROUP BY Book.book_id)
      SELECT Book.book_id, Book.title, book_rating.num_rating
      FROM Book JOIN book_rating 
      ON Book.book_id = book_rating.book_id
      ORDER BY num_rating DESC
      LIMIT ${pageSize} OFFSET ${(page-1)*pageSize}`,
      (err, data) => {
        if (err || data.length === 0){
          console.log(err);
          res.json(err);
        } else {
          res.json(data);
        }
      });
    } else if (req.params.rate_type === 'ave_rating') {
      connection.query(`
      WITH book_rating AS (
        SELECT Book.book_id, ROUND(AVG(Review.score),2) AS avg_rating
        FROM Review JOIN Book
        ON Review.book_id = Book.book_id
        GROUP BY Book.book_id)
      SELECT Book.book_id, Book.title, book_rating.avg_rating
      FROM Book JOIN book_rating 
      ON Book.book_id = book_rating.book_id
      ORDER BY avg_rating DESC
      LIMIT ${pageSize} OFFSET ${(page-1)*pageSize}`,
      (err, data) => {
        if (err || data.length === 0){
          console.log(err);
          res.json(err);
        } else {
          res.json(data);
        }
      });
    } else {res.status(400).send(`'${req.params.rate_type}' is not a valid rating type. Valid types are 'num_rating' and 'ave_rating'.`);} // replace this with your implementation
  }
};

// Route 10 (complex): GET /search_books
const search_books = async function(req, res) {
  const title = req.query.title ?? '';
  const author = req.query.author ?? '';
  const dateLow = req.query.published_date_low ?? '0101-01-01';
  const dateHigh = req.query.published_date_high;
  const genre = req.query.genre ?? '';
  const publisher = req.query.publisher ?? '';
  const ratingLow = req.query.rating_low ?? 0;
  const ratingHigh = req.query.rating_high ?? 5;
  const numratingLow = req.query.numrating_low ?? 0;
  const numratingHigh = req.query.numrating_high ?? 3000;
  connection.query(`
  SELECT DISTINCT B.book_id, B.title, B.publisher, B.published_date, G.name AS genre, A.author_id, A.name AS author, R.score_avg, 2, R.num_ratings
  FROM Book B
  INNER JOIN Author_Of AO ON B.book_id = AO.book_id
  INNER JOIN Author A ON AO.author_id = A.author_id
  INNER JOIN Belong_To BT ON B.book_id = BT.book_id
  INNER JOIN Genre G ON BT.genre_id = G.genre_id
  INNER JOIN (
      SELECT book_id, ROUND(AVG(score),2) AS score_avg, COUNT(user_id) AS num_ratings
      FROM Review
      GROUP BY book_id
  ) R ON B.book_id = R.book_id
  WHERE B.title LIKE '%${title}%'
  AND A.name LIKE '%${author}%'
  AND G.name LIKE '%${genre}%'
  AND B.publisher LIKE '%${publisher}%'
  AND B.published_date BETWEEN '${dateLow}' AND COALESCE('${dateHigh}', CURDATE())
  AND R.score_avg >= ${ratingLow} AND R.score_avg <= ${ratingHigh}
  AND R.num_ratings >= ${numratingLow} AND R.num_ratings <= ${numratingHigh}
  ORDER BY B.title ASC;
  `
  // Optimize query by adding an index on (book_id, score) in Review table. 
  // Also by Joining the Review table after the 
  // GROUP BY clause that uses the AVG() and COUNT() functions,
  // we can avoid using the AVG() and COUNT() functions in the WHERE clause. 

  , (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json([]);
    } else {
      res.json(data);
    }
  }); 
}


// Route 11: GET /search_authors
const search_authors = async function (req, res) {
  const authorName = req.query.author_name ?? '';
  const fanCountLow = req.query.fan_count_low ?? 0;
  const fanCountHigh = req.query.fan_cout_high ?? 709826;
  const genre = req.query.genre ?? '';
  const avgRateLow = req.query.avg_rate_low ?? 0;
  const avgRateHigh = req.query.avg_rate_high ?? 5;
  const country = req.query.country ?? '';

  connection.query(`
  WITH author_genres AS (
  SELECT A.author_id, GROUP_CONCAT(DISTINCT G.name SEPARATOR ', ') AS genres
  FROM Author A JOIN Write_In WI ON A.author_id = WI.author_id
  JOIN Genre G ON WI.genre_id = G.genre_id
  GROUP BY A.author_id
  )
  SELECT DISTINCT A.author_id, A.name AS author_name, A.fan_count, A.average_rate, A.country, AG.genres
  FROM Author A JOIN author_genres AG ON A.author_id = AG.author_id
  WHERE A.name LIKE '%${authorName}%' 
  AND A.fan_count >= ${fanCountLow} AND A.fan_count <= ${fanCountHigh}
  AND A.average_rate >= ${avgRateLow} AND A.average_rate <= ${avgRateHigh}
  AND AG.genres LIKE '%${genre}%'
  AND A.country LIKE '%${country}%'
  ORDER BY A.name ASC;`, 
  (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json([]);
    } else {
      res.json(data);
    }
  }); 
};


//Route 12 (complex): GET /popular_authors
//get popular authors and their most rated book 
const get_popular_authors = async function (req, res) {
  const page = req.query.page ?? 1;
  const pageSize = req.query.page_size ?? 10;

  connection.query(
    `
    WITH book_num_rating AS (
      SELECT b.book_id, b.title, COUNT(DISTINCT r.user_id) AS num_ratings
      FROM Book b JOIN Review r ON b.book_id = r.book_id
      GROUP BY b.book_id, b.title
  )
  SELECT a.author_id, a.name AS name, a.rating_count,a.average_rate, b1.book_id, b1.title AS title, b1.num_ratings, GROUP_CONCAT(g.name SEPARATOR ', ') AS genres
  FROM Author a JOIN Author_Of ao ON a.author_id = ao.author_id
      JOIN book_num_rating b1 ON ao.book_id = b1.book_id
      JOIN Belong_To bt on ao.book_id = bt.book_id
      JOIN Genre g on bt.genre_id = g.genre_id
  WHERE b1.num_ratings = (
      SELECT MAX(b2.num_ratings)
      FROM Author_Of ao2 JOIN book_num_rating b2 ON ao2.book_id = b2.book_id
      WHERE ao2.author_id = a.author_id
      )
  GROUP BY b1.book_id
  ORDER BY a.rating_count DESC, a.average_rate DESC
  LIMIT ${pageSize} OFFSET ${(page-1)*pageSize};
  `,
    (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.json({});
      } else {
        res.json(data);
      }
    }
  );
};

//Route 13 (complex): GET /popular_genres
//get popular authors and their most rated book 
const get_popular_genres = async function (req, res) {
  connection.query(
    `
    WITH
    TOP5Genre AS (
    SELECT genre_id, COUNT(book_id) AS num_books
    FROM Belong_To
    GROUP BY genre_id
    ORDER BY COUNT(book_id) DESC
    LIMIT 5),
    top_books AS (
    SELECT
        Belong_To.genre_id, Book.book_id, Author.author_id, ROUND(AVG(Review.score),2) AS average_score, COUNT(Review.user_id) AS num_rating,
        ROW_NUMBER() OVER (PARTITION BY Belong_To.genre_id ORDER BY COUNT(Review.user_id) DESC) AS rank_
    FROM Book
    INNER JOIN Author_Of ON Book.book_id = Author_Of.book_id
    INNER JOIN Author ON Author_Of.author_id = Author.author_id
    INNER JOIN Review ON Book.book_id = Review.book_id
    INNER JOIN Belong_To ON Book.book_id = Belong_To.book_id
    INNER JOIN TOP5Genre ON  Belong_To.genre_id = TOP5Genre.genre_id
    GROUP BY Belong_To.genre_id, Book.book_id, Author.author_id
    ORDER BY TOP5Genre.num_books DESC)
    SELECT UPPER(G.name) AS genre, Book.book_id, Book.title, Author.name AS author_name, Author.author_id, top_books.num_rating, top_books.average_score
    FROM top_books
    INNER JOIN Book ON top_books.book_id = Book.book_id
    INNER JOIN Author ON top_books.author_id = Author.author_id
    INNER JOIN Genre G ON top_books.genre_id = G.genre_id
    WHERE top_books.rank_ <= 10;
   `,
    (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.json({});
      } else {
        res.json(data);
      }
    }
  );
};


module.exports = {
  owner,
  random,
  authors,
  popular_books, 
  search_books,
  search_authors,
  book_from_id,
  author_from_id,
  book_genres, 
  author_genres,
  get_book_authors,
  get_popular_authors,
  get_popular_genres,
}