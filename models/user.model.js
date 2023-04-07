const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const getBaseUrl = require("../middleware/getBaseUrl");

const passport = require("passport");
const Recipe = require("./recipe.model");
const passportLocalMongoose = require("passport-local-mongoose");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const bcrypt = require("bcrypt");
//const findOrCreate = require("mongoose-findorcreate");

const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    googleId: {
        type: String,
        required: false,
    },
    secret: String,
    imgUrl: String,
    phoneNumber: String,
    birthday: String,
    location: String,
    recipes: { type: [Recipe.schema], required: false },
});

UserSchema.pre("save", async function (next) {
    const user = this;
    /*if (!user.isModified("password")) {
        return next();å
    } */
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(user.password, salt);
    user.password = hash;
    next();
});

UserSchema.plugin(passportLocalMongoose);
// UserSchema.plugin(findOrCreate);
module.exports = User = mongoose.model("user", UserSchema);

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: `${getBaseUrl(false)}/auth/google/callback`,
            userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
        },
        async function (accessToken, refreshToken, profile, cb) {
            const newUser = {
                googleId: profile.id,
                username: profile.id,
                email: profile._json.email,
                firstName: profile.name.givenName,
                lastName: profile.name.familyName,
                imgUrl: profile._json.picture,
            };
        }
    )
);

passport.use(User.createStrategy());

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    // User.findById(id, function(err, user) {
    //     done(err, user);
    // });
    User.findOne({ googleID: id })
        .then((user) => {
            done(user);
        })
        .catch((err) => {
            done(err);
        });
});

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: `${getBaseUrl(false)}/auth/google/callback`,
        },
        async function (accessToken, refreshToken, profile, cb) {
            console.log("test");
            const newUser = {
                googleId: profile.id,
                username: profile.id,
                email: profile._json.email,
                firstName: profile.name.givenName,
                lastName: profile.name.familyName,
                imgUrl: profile._json.picture,
            };
            return cb(null, profile);

            // User.findOrCreate({username: profile.id, googleId: profile.id}, newUser, (err, user) => cb(err, user))

            let findUser;
            await User.findOne({ googleId: profile.id }).then(
                (res) => (findUser = res)
            );

            if (!findUser) {
                User.create(newUser)
                    .then((result) => {
                        cb(result);
                    })
                    .catch((err) => {
                        cb(err);
                    });
                // User.create(newUser, (err, user) => cb(err, user))
            } else {
                User.findOneAndUpdate({ googleId: profile.id }, newUser)
                    .then((result) => {
                        cb(result);
                    })
                    .catch((err) => {
                        cb(err);
                    });
                // User.findOneAndUpdate({googleId: profile.id}, newUser, (err, user) => cb(err, user));
            }
        }
    )
);
