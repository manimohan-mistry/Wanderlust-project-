if (process.env.NODE_ENV != "production") {
    require('dotenv').config();
}
// console.log(process.env.SECRET);

const express = require('express');
const app = express();
const port = 8080;
const path = require('path');
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const MongoStore = require('connect-mongo');
const LocalStrategy = require("passport-local").Strategy;
const User = require("./models/user.js");

// routing require from another file
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userSeach = require("./routes/search.js");
const userRouter = require("./routes/user.js");

// ejs mate for layouts of routings
app.engine('ejs', ejsMate);

app.use(methodOverride('_method'));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// mongoose connection to the mongoDB
const mongoose = require('mongoose');
const { wrap } = require('module');
const wrapAsync = require('./utils/wrapAsync.js');

const dbUrl = process.env.ATLAS_URL;
// console.log(process.env.ATLAS_URL);
main()
    .then((res) => console.log("Connected To DB"))
    .catch((err) => console.log(err));
async function main() {
    await mongoose.connect(dbUrl);
};

const mySecret = process.env.SECRET;
// MongoStore syntax
const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: mySecret,
    },
    touchAfter: 24 * 3600,

});

store.on("error", () => {
    console.log("Error in mongo session Store", error);
});

// express session option syntax
const sessionOption = {
    store: store,
    secret: mySecret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    }
};
// express-session 
app.use(session(sessionOption));

// connect flash after session 
app.use(flash());

// passport authentication
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

// serialized and deserialized => passport-local-mongoose 
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// error handling flash methods
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    // console.log(res.locals.success);
    res.locals.error = req.flash("error");
    // use for navbar user verification
    res.locals.currentUser = req.user;
    // for res of search
    res.locals.userSearch = req.query.location;
    next();
});

// listings use here
app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/search", userSeach);
app.use("/", userRouter);

// error handling for all invalid route
app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page not found!"));
})

// error handling 
app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Some error was occured" } = err;
    res.status(statusCode).render("error.ejs", { message });
});

// lsitening port over here 
app.listen(port, () => {
    console.log("server started at", port);
});