const express = require("express");
const movieController = require("../controllers/movie.js");
const { verify, verifyAdmin } = require("../auth.js");

const router = express.Router();

// Admin only
router.post("/addMovie", verify, verifyAdmin, movieController.addMovie);
router.patch("/updateMovie/:movieId", verify, verifyAdmin, movieController.updateMovie);
router.delete("/deleteMovie/:movieId", verify, verifyAdmin, movieController.deleteMovie);

// Any user
router.get("/getMovies", movieController.getMovies);
router.get("/getMovie/:movieId", movieController.getMovieById);

// Authenticated users
router.patch("/addComment/:movieId", verify, movieController.addMovieComment);
router.get("/getComments/:movieId", verify, movieController.getMovieComments);

module.exports = router;
