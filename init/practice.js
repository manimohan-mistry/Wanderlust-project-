const review = require("../models/review");
const ExpressError = require("../utils/ExpressError");

userSchema.post("findOneAndDelete", async (data) => {
    if (data) {
        await review.deleteMany(_Id, { $in: listingSchema.review });
    }
})

productSchema.post("findOneAndDelete", async (res) => {
    if (res.length) {
        await Listing.deleteMany(Id, { $lte: 200 });
    }
});


const validateReview = async (req, res, next) => {
    let { error } = userSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((er) => er.message.join(","));
        throw new ExpressError(400, " Bad rquest are not accepted");
    }
    else {
        next();
    }

}

// joi practice

const reviewObject = joi.object({
    review: joi.object({
        rating: joi.number().required().min(10).max(100),
        comment: joi.string().required().min(10),
    }).required(),

});

const validate1 = (req, res, next) => {
    let { err } = req.body;
    if (err) {
        let errmsg = err.details.map((err) => err.message.join(","));
        throw new ExpressError(404, "something went wrong train another way");
    }
    else {
        next();
    }
}

app.delete("/listings/:id/reviews", async (req, res) => {
    let { id, reviewId } = req.params;

    await Listing.findByIdAndUpdate(_id, { $pull: { review: reviewId } });
    let result = await Review.findByIdAndDelete(reviewId);

    console.log(result);
    res.redirect("/");
})