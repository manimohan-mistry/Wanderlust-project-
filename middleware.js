const Listing = require("./models/listing");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema } = require("./schema.js");
const { reviewSchema } = require("./schema.js");
const Review = require("./models/review.js");


// validate listings check
module.exports.validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((er) => er.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

// validate review check 
module.exports.validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((er) => er.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }

};

// check user logged in or not 
module.exports.isLoggedIn = (req, res, next) => {
    // console.log(req.path, "...", req.originalUrl);
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be logged in to create a listings");
        return res.redirect("/login");
    }
    next();
};

// it basically use for user req.session.originalUrl for user authentication
module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;

    }
    next();
};

// check who is owner of this and check the can only edit and delete the listings
module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing.owner._id.equals(res.locals.currentUser._id)) {
        req.flash("error", "you don't have permission to edit");
        return res.redirect(`/listings/${id}`);
    }
    next();
};

module.exports.isReviewOther = async (req, res, next) => {
    let { id, reviewId } = req.params;
    let review = await Review.findById(reviewId);
    if (!review.auther._id.equals(res.locals.currentUser._id)) {
        req.flash("error", "You are not the review owner");
        return res.redirect(`/listings/${id}`);
    }
    next();
};