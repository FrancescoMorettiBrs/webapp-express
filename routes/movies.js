import express from "express";
import moviesController from "../controllers/moviesController.js";

const router = express.Router();

router.get("/", moviesController.index);
router.get("/:slug", moviesController.show)

export default router;
