const mongoose = require("mongoose");
const Movie = require("../models/movie.js");

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

// Only allow these fields from the body (never accept _id or comments directly)
const pickMovieFields = (body) => {
    const fields = {};
    ["title", "director", "year", "description", "genre"].forEach((key) => {
        if (body[key] !== undefined) fields[key] = body[key];
    });
    return fields;
};

module.exports.addMovie = async (req, res) => {
    try {
        const newMovie = new Movie(pickMovieFields(req.body));
        const savedMovie = await newMovie.save();
        return res.status(201).send(savedMovie);
    } catch (err) {
        if (err.name === "ValidationError") {
            return res.status(400).send({ message: err.message });
        }
        console.error(err);
        return res.status(500).send({ message: "Internal Server Error" });
    }
};

module.exports.getMovies = async (req, res) => {
    try {
        const movies = await Movie.find({});
        return res.status(200).send({ movies });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: "Internal Server Error" });
    }
};

module.exports.getMovieById = async (req, res) => {
    try {
        if (!isValidId(req.params.movieId)) {
            return res.status(400).send({ message: "Invalid movie id" });
        }
        const movie = await Movie.findById(req.params.movieId);
        if (!movie) {
            return res.status(404).send({ message: "Movie not found" });
        }
        return res.status(200).send(movie);
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: "Internal Server Error" });
    }
};

module.exports.updateMovie = async (req, res) => {
    try {
        if (!isValidId(req.params.movieId)) {
            return res.status(400).send({ message: "Invalid movie id" });
        }
        const updatedMovie = await Movie.findByIdAndUpdate(
            req.params.movieId,
            pickMovieFields(req.body),
            { new: true, runValidators: true }
        );
        if (!updatedMovie) {
            return res.status(404).send({ message: "Movie not found" });
        }
        return res.status(200).send({
            message: "Movie updated successfully",
            updatedMovie,
        });
    } catch (err) {
        if (err.name === "ValidationError") {
            return res.status(400).send({ message: err.message });
        }
        console.error(err);
        return res.status(500).send({ message: "Internal Server Error" });
    }
};

module.exports.deleteMovie = async (req, res) => {
    try {
        if (!isValidId(req.params.movieId)) {
            return res.status(400).send({ message: "Invalid movie id" });
        }
        const deleted = await Movie.findByIdAndDelete(req.params.movieId);
        if (!deleted) {
            return res.status(404).send({ message: "Movie not found" });
        }
        return res.status(200).send({ message: "Movie deleted successfully" });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: "Internal Server Error" });
    }
};

module.exports.addMovieComment = async (req, res) => {
    try {
        if (!isValidId(req.params.movieId)) {
            return res.status(400).send({ message: "Invalid movie id" });
        }
        const { comment } = req.body;
        if (!comment) {
            return res.status(400).send({ message: "Comment is required" });
        }

        const movie = await Movie.findById(req.params.movieId);
        if (!movie) {
            return res.status(404).send({ message: "Movie not found" });
        }

        movie.comments.push({ userId: req.user.id, comment });
        const updatedMovie = await movie.save();

        return res.status(200).send({
            message: "comment added successfully",
            updatedMovie,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: "Internal Server Error" });
    }
};

module.exports.getMovieComments = async (req, res) => {
    try {
        if (!isValidId(req.params.movieId)) {
            return res.status(400).send({ message: "Invalid movie id" });
        }
        const movie = await Movie.findById(req.params.movieId);
        if (!movie) {
            return res.status(404).send({ message: "Movie not found" });
        }
        return res.status(200).send({ comments: movie.comments });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: "Internal Server Error" });
    }
};
