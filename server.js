const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");
const cookieParser = require("cookie-parser");
const path = require("path");
const getBaseUrl = require("./middleware/getBaseUrl");
const bodyParser = require("body-parser");

const app = express();

dotenv.config();

app.use(
    session({
        secret: process.env.EXPRESS_SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
    })
);
app.use((req, res, next) => {
    // res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    next();
});
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(passport.initialize());
app.use(passport.session());

mongoose
    .connect(process.env.MONGO_ACCESS, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        //useCreateIndex: true,
        //useFindAndModify: false
    })
    .then(() => {
        console.log("Successfully connected to Mongo DB");
    })
    .catch((err) => {
        console.log(`Database error: ${err}`);
    });

// https://medium.com/@prashantramnyc/how-to-implement-google-authentication-in-node-js-using-passport-js-9873f244b55e

mongoose.set("returnOriginal", false);
//use built in body parser
app.use(express.json());
app.use(cookieParser());

//allow cross origin resource sharing
app.use(cors({
    origin: getBaseUrl(),
    credentials: true,
  }));

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", `${getBaseUrl()}`); // update to match the domain you will make the request from
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
});

// auth stuff
const authRoutes = require("./routes/auth.routes");
const usersRoutes = require("./routes/users.routes");
const recipeRoutes = require("./routes/recipe.routes");

app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/recipe", recipeRoutes);

// Set port and listen
const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Server listening on port ${port}`));

//Serve static assets if in production
if (process.env.NODE_ENV === "production") {
    app.use(express.static("client/build"));
    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
    });
}