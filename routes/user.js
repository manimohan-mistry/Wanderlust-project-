const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/users.js");

// signup and create signup
router.route("/signup")
    .get(userController.renderSignup)
    .post(wrapAsync(userController.CreateSignup));

// login and logged in routes
router.route("/login")
    .get(userController.renderLoginForm)
    .post(
        saveRedirectUrl,
        passport.authenticate("local",
            {
                failureRedirect: "/login",
                failureFlash: true
            }),
        userController.loginForm
    );

// user louout =>
router.get("/logout", userController.logOut);

module.exports = router;

