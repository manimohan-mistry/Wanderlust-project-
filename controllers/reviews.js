const Listing = require("../models/listing.js");
const Review = require("../models/review.js");

module.exports.createReviews = async (req, res) => {
    // console.log(req.params.id);
    // let listing = await Listing.findById(req.params.id);
    let { id } = req.params;
    let listing = await Listing.findById(id);
    let newReview = new Review(req.body.review);
    newReview.auther = req.user._id;
    console.log(newReview);
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    console.log("new review saved");
    req.flash("success", "New Review Created");
    res.redirect(`/listings/${id}`);

}

module.exports.destroyReviews = async (req, res) => {
    let { id, reviewId } = req.params;

    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    let result = await Review.findByIdAndDelete(reviewId);

    console.log("deleted reviews is: ", result);

    req.flash("success", "Review deleted");
    res.redirect(`/listings/${id}`);
}