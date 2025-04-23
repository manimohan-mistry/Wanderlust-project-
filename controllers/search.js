const Listing = require("../models/listing.js");

module.exports.search = async (req, res, next) => {
    try {
        let userSearch = req.query.location;
        // console.log(userSearch)
        if (!userSearch) {
            req.flash("error", "the data was not found");
            return res.redirect("/listings");
        }
        let listings = await Listing.find({ location: { $regex: userSearch, $options: "i" } });

        if (listings.length === 0) {
            req.flash("error", "No listings found for this location");
            return res.redirect("/listings");
        }

        res.render("search/search.ejs", { listings });
    } catch (err) {
        next(err);
    }
};