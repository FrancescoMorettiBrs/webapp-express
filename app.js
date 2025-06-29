import express from "express";
import router from "./routes/movies.js";
import cors from "cors";
import notFound from "./middlewares/notFound.js";
import errorsHandler from "./middlewares/errorsHandler.js";
import imagePath from "./middlewares/imagePath.js";

const app = express();
const port = process.env.SERVER_PORT;

app.use(
  cors({
    origin: process.env.FE_URL,
  })
);

app.use(express.json());
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.status(200).json({
    data: "Welcome to Movies API",
  });
});

app.use("/movies", imagePath, router);

app.use(notFound);
app.use(errorsHandler);

app.listen(port, () => {
  console.log(`App is listening on port ${port}`);
});
