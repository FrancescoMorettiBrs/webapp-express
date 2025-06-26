import express from "express";
import connection from "./db.js";
import router from "./routes/movies.js";

const app = express();
const port = process.env.SERVER_PORT;

app.use(express.json());
app.use(express.static("public"));


app.get("/", (req, res) =>{
    res.status(200).json({
        data: "Welcome to Movies API"
    })
})

app.use("/movies", router)

app.listen(port, () => {
  console.log(`App is listening on port ${port}`);
});
