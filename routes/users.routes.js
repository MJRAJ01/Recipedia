const express = require("express");
const app = express();
const router = express.Router();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");

const User = require("../models/user.model");

app.use(express.json());

// @route       POST /users
// @desc        Create a new user, this can only be done by the logged in user.
// @operationID createUser
// @access      Public
router.post("/", (req, res) => {
    //console.log(req);
    console.log(req.body);

    const user = new User(req.body);
    console.log(user);
    User.create(req.body)
        .then((result) => {
            console.log(result);
            res.status(201).json({
                message: "Handling POST requests to /users",
                createdUser: result,
            });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({
                error: err,
            });
        });
});

// @route       POST users/addrecipe/:id
// @desc        Adds the new recipe from the body to the userID provided
// @operationID createUser
// @access      Public
router.post("/addrecipe/:id", (req, res) => {
    const myrecipe = new Recipe(req.body);

    User.findByIdAndUpdate(
        { _id: new mongoose.Types.ObjectId(req.params.id) },
        { $push: { recipes: myrecipe } }
    )
        .then((result) => {
            console.log(result);
            res.status(201).json({
                message: "Handling POST requests to /users/addrecipes/:id",
                createdRecipe: result,
            });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({
                error: err,
            });
        });
    /*
    let myUser = User.findOne({ _id: req.params.id }).recipes.push(myrecipe);
    myUser.save(done); */
    /*
    user.save()
        .then((result) => {
            console.log(result);
            res.status(201).json({
                message: "Handling POST requests to /users/addrecipes/:id",
                createdUser: result,
            });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({
                error: err,
            });
        });
        */
});

// @route       GET api/users
// @desc        Get all users
// @access      Public
router.get("/", (req, res) => {
    User.find({})
        .then((users) => res.send(users))
        .catch((err) => res.status(400).send(err));
});

// @route       GET api/users/:id
// @desc        Get user by id
// @access      Public
router.get("/:id", (req, res) => {
    User.findOne({ _id: req.params.id })
        .then((user) => {
            res.send(user);
        })
        .catch((err) => res.status(401).send(err));
});

// @route       PUT api/users/:id
// @desc        Update a user by id
// @access      Public
router.put("/:id", (req, res) => {
    User.findByIdAndUpdate(req.params.id, req.body)
        .then((updatedUser) => res.send(updatedUser))
        .catch((err) => res.status(401).send(err));
});

router.put("/reset/:id", (req, res) => {
    User.findByIdAndUpdate(req.params.id, { recipe: [] })
        .then((updatedUser) => res.send(updatedUser))
        .catch((err) => res.status(401).send(err));
});

// @route       DELETE api/users
// @desc        Delete a user
// @access      Private
router.delete("/:id", (req, res) => {
    var itemId = req.params.id;
    User.findOneAndRemove({ _id: itemId })
        .catch((err) => res.status(404).send(err))
        .then(res.send(`Successfully deleted user ${req.params.id}`));
});

// @route       DELETE api/users/reset
// @desc        Clear all users from DB
// @access      Public
router.delete("/reset", (req, res) => {
    User.deleteMany({}) //TODO HASN'T BEEN TESTED
        .then((resp) =>
            res.send({
                message: `Successfully deleted ${resp.deletedCount} record${
                    resp.deletedCount != 1 ? "s" : ""
                }`,
            })
        )
        .catch((err) => console.log(err));
});

router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res
                .status(401)
                .json({ message: "Invalid email or password" });
        }
        console.log(user);
        console.log(password, user.password);

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res
                .status(401)
                .json({ message: "Invalid email or password" });
        }

        const payload = {
            user: user,
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });
        res.cookie("token", token, { httpOnly: false });
        res.status(200).json({
            success: true,
            message: "Logged in successfully!",
            user: user,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
