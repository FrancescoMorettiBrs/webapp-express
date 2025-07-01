import slugify from "slugify";
import connection from "../db.js";

const index = (req, res, next) => {
  const sql = `
    SELECT movies.*, ROUND(AVG(reviews.vote), 2) AS vote_avg
    FROM movies
    LEFT JOIN reviews
    ON movies.id = reviews.movie_id
    GROUP BY movies.id;
    `;
  connection.query(sql, (err, results) => {
    if (err) {
      return next(new Error(err));
    } else {
      const movies = results.map((curMovie) => {
        return {
          ...curMovie,
          image: `${req.imagePath}/${curMovie.image}`,
        };
      });
      res.json({
        data: movies,
      });
    }
  });
};

const show = (req, res, next) => {
  const slug = req.params.slug;
  const movieSql = `
    SELECT movies.*, ROUND(AVG(reviews.vote), 2) AS vote_avg
    FROM movies
    LEFT JOIN reviews
    ON movies.id = reviews.movie_id
    WHERE movies.slug = ?
    GROUP BY movies.id;
    `;

  const reviewsSql = `
    SELECT *
    FROM reviews
    WHERE reviews.movie_id = ?
    `;

  connection.query(movieSql, [slug], (err, movieResults) => {
    if (err) {
      return next(new Error(err));
    }
    if (movieResults.length === 0) {
      res.status(404).json({
        error: "Movie not found",
      });
    } else {
      const movieData = movieResults[0];
      connection.query(reviewsSql, [movieData.id], (err, reviewsResults) => {
        if (err) {
          return new Error(err);
        }
        res.json({
          data: {
            ...movieData,
            image: movieData.image ? `${req.imagePath}/${movieData.image}` : null,
            reviews: reviewsResults,
          },
        });
      });
    }
  });
};

const storeReviews = (req, res, next) => {
  const { id } = req.params;

  const movieSql = `
  SELECT * FROM movies
  WHERE id = ?
  `;

  connection.query(movieSql, [id], (err, movieResults) => {
    if (movieResults.length === 0) {
      return res.status(404).json({
        error: "Film non trovato",
      });
    }

    const { name, vote, text } = req.body;

    const newReviewSql = `
    INSERT INTO reviews (movie_id, name, vote, text)
    VALUES (?, ?, ?, ?)
    `;

    connection.query(newReviewSql, [id, name, vote, text], (err, results) => {
      if (err) {
        return next(new Error(err));
      }
      return res.status(201).json({
        message: "Review created",
        id: results.insertId,
      });
    });
  });
};

const store = (req, res, next) => {
  const { title, director, genre, abstract } = req.body;

  const slug = slugify(title, {
    lower: true,
    strict: true,
  });

  const sql = `
  INSERT INTO movies (slug, title, director, genre, abstract) 
  VALUES (?, ?, ?, ?, ?)
  `;

  connection.query(sql, [slug, title, director, genre, abstract], (err, results) => {
    if (err) {
      return next(new Error(err));
    }
    return res.status(201).json({
      id: results.insertId,
      slug,
    });
  });
};

const moviesController = {
  index,
  show,
  storeReviews,
  store,
};

export default moviesController;
