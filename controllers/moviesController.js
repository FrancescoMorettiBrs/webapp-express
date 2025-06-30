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
      return next(new Error(err))
    }
      if (movieResults.length === 0) {
        res.status(404).json({
          error: "Movie not found",
        });
      }
     else {
      const movieData = movieResults[0]
      connection.query(reviewsSql, [movieData.id], (err, reviewsResults) => {
        if (err) {
          return new Error(err)
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

const moviesController = {
  index,
  show,
};

export default moviesController;
