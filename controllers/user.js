const bcrypt = require("bcrypt");
const User = require("../models/user.js");
const auth = require("../auth.js");

module.exports.registerUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).send({ message: "Email and password are required" });
        }
        if (!email.includes("@")) {
            return res.status(400).send({ message: "Invalid email" });
        }
        if (password.length < 8) {
            return res.status(400).send({ message: "Password must be at least 8 characters" });
        }

        const existing = await User.findOne({ email });
        if (existing) {
            return res.status(409).send({ message: "Email already registered" });
        }

        const newUser = new User({
            email,
            password: bcrypt.hashSync(password, 10),
        });
        await newUser.save();

        return res.status(201).send({ message: "Registered Successfully" });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: "Internal Server Error" });
    }
};

module.exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).send({ message: "Email and password are required" });
        }
        if (!email.includes("@")) {
            return res.status(400).send({ message: "Invalid email" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).send({ message: "No email found" });
        }

        if (!bcrypt.compareSync(password, user.password)) {
            return res.status(401).send({ message: "Email and password do not match" });
        }

        return res.status(200).send({ access: auth.createAccessToken(user) });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: "Internal Server Error" });
    }
};
