const express = require("express");
const app = express();
const router = express.Router();
const mongoose = require("mongoose");
const auth = require('../middleware/auth')

const User = require("../models/user.model");
const Recipe = require('../models/recipe.model')

app.use(express.json());

// @route       POST /users
// @desc        Create a new user, this can only be done by the logged in user.
// @operationID createUser
// @access      Public
router.post("/", (req, res) => {
    // const user = new User(req.body);
    // console.log(user);
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

// @route       PUT users/addrecipe/:recipeId
// @desc        Adds a recipe to the user who made request's list
// @operationID createUser
// @access      Private
router.put("/addrecipe/:recipeId", auth, async (req, res) => {
    const recipe = await Recipe.findOne({_id: req.params.recipeId})

    User.findByIdAndUpdate(
        { _id: new mongoose.Types.ObjectId(req.user._id) },
        { $push: { recipes: recipe } }
    )
        .then(user => res.send(user))
        .catch((err) => {
            console.log(err);
            res.status(500).json({
                error: err,
            });
        });
});
// router.put("/addrecipe/:id", (req, res) => {
//     // TODO: Validate this recipe etc
//     const myrecipe = new Recipe(req.body);

//     User.findByIdAndUpdate(
//         { _id: new mongoose.Types.ObjectId(req.params.id) },
//         { $push: { recipes: myrecipe } }
//     )
//         .then((result) => {
//             console.log(result);
//             res.status(201).json({
//                 message: "Handling POST requests to /users/addrecipes/:id",
//                 createdRecipe: result,
//             });
//         })
//         .catch((err) => {
//             console.log(err);
//             res.status(500).json({
//                 error: err,
//             });
//         });
// });

// @route       GET api/users/recipes
// @desc        Get a users recipe list
// @access      Private
router.get("/", auth, (req, res) => {
    User.findOne({_id: new mongoose.Types.ObjectId(req.user._id)})
        .then(user => res.send(user.recipes))
        .catch((err) => res.status(400).send(err));
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

module.exports = router;
