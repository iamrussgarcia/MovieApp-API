const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: [true, "User Id is Required"],
    },
    comment: {
        type: String,
        required: [true, "Comment is Required"],
    }
});

const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Title is Required"],
    },
    director: {
        type: String,
        required: [true, "Director is Required"],
    },
    year: {
        type: Number,
        required: [true, "Year is Required"],
    },
    description: {
        type: String,
        required: [true, "Description is Required"],
    },
    genre: {
        type: String,
        required: [true, "Genre is Required"],
    },
    comments: {
        type: [commentSchema],
        default: [],
    }
});

module.exports = mongoose.model("Movie", movieSchema);
