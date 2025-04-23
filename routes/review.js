const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const { validateReview, isLoggedIn, isReviewOther } = require("../middleware.js");
const listingController = require("../controllers/reviews.js")

// reviews => Post 
router.post("/",
    isLoggedIn,
    validateReview,
    wrapAsync(listingController.createReviews)
);

// Delete reviews routes 
router.delete("/:reviewId",
    isLoggedIn,
    isReviewOther,
    wrapAsync(listingController.destroyReviews)
);

module.exports = router;