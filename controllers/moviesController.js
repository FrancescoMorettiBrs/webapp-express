import connection from "../db.js";

const index = (req, res) => {
  const sql = "SELECT * FROM `movies`";
  connection.query(sql, (err, results) => {
    if (err) {
      console.log(err);
    } else {
      res.json({
        data: results,
      });
    }
  });
};

const show = (req, res) => {
  const id = req.params.id;
  const sql = `
    SELECT *
    FROM movies
    WHERE id = ?
    `;

  connection.query(sql, [id], (err, results) => {
    if (err) {
      console.log(err);
      if (results.length === 0) {
        res.status(404).json({
          error: "Movie not found",
        });
      }
    } else {
      res.json({
        data: results,
      });
    }
  });
};

const moviesController = {
  index,
  show,
};

export default moviesController;
