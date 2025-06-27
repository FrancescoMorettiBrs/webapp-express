import connection from "../db.js";

const index = (req, res) => {
  const sql = `
    SELECT movies.*, ROUND(AVG(reviews.vote), 2) AS vote_avg
    FROM movies
    LEFT JOIN reviews
    ON movies.id = reviews.movie_id
    GROUP BY movies.id;
    `;
  connection.query(sql, (err, results) => {
    if (err) {
      console.log(err);
    } else {
      const movies = results.map((curMovie) => {
        return {
          ...curMovie,
          image:`${req.imagePath}/${curMovie.image}`,
        };
      });
      res.json({
        data: movies,
      });
    }
  });
};

const show = (req, res) => {
  const id = req.params.id;
  const movieSql = `
    SELECT movies.*, ROUND(AVG(reviews.vote), 2) AS vote_avg
    FROM movies
    LEFT JOIN reviews
    ON movies.id = reviews.movie_id
    WHERE movies.id = ?
    GROUP BY movies.id;
    `;

  const reviewsSql = `
    SELECT *
    FROM reviews
    WHERE reviews.movie_id = ?
    `;

  connection.query(movieSql, [id], (err, movieResults) => {
    if (err) {
      console.log(err);
      if (movieResults.length === 0) {
        res.status(404).json({
          error: "Movie not found",
        });
      }
    } else {
      connection.query(reviewsSql, [id], (err, reviewsResults) => {
        res.json({
          data: {
            ...movieResults[0],
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
