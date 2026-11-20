const express = require('express');
const mongoose = require('mongoose');


const userRoutes = require("./routes/user.js");
const movieRoutes = require("./routes/movie.js");
const { errorHandler } = require("./auth.js");

const port = 4000;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect("mongodb+srv://admin:admin1234@b645-garcia.ohpcw9y.mongodb.net/MovieAppAPI");

let db = mongoose.connection;


db.on("error", (err) => {
  console.error("Connection to the db failed:", err);
});

db.once("open", () => {
  console.log("Connected to the database");
});


app.use("/users", userRoutes);
app.use("/movies", movieRoutes);

app.use(errorHandler);

if(require.main === module){
	app.listen(port || 4000, () => {
	    console.log(`API is now online on port ${ port || 4000 }`);
	});
}

module.exports = {app,mongoose};