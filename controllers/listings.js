const Listing = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req, res) => {
    const allListing = await Listing.find({});
    res.render("listings/index.ejs", { allListing });
}

module.exports.renderNewForm = (req, res) => {
    // console.log(req.user);
    res.render("./listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
        .populate({ path: "reviews", populate: { path: "auther" } })
        .populate("owner");
    if (!Listing) {
        req.flash("error", "Listing may be deleted you cannot access it");
        res.redirect("/listings");
    }
    // console.log(listing);
    res.render("./listings/show.ejs", { listing });
}

module.exports.CreateNewListing = async (req, res, next) => {
    // let listing = req.body.listing;
    // console.log(listing);
    // let result = listingSchema.validate(req.body);
    // console.log(result);
    // if(!result.err){
    //     throw new ExpressError(404, result.err);
    // }
    // if (!req.body.listing) {
    //     throw new ExpressError(404, "send valid data for listings");
    // }

    // use here for geocoding concept location tracking
    let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1,
    })
        .send()

    let url = req.file.path;
    let filename = req.file.filename;
    // console.log(url, "...", filename)
    // console.log(req.user);
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { url, filename };

    newListing.geometry = response.body.features[0].geometry;

    let savedListing = await newListing.save();
    console.log(savedListing);
    req.flash("success", "New Listing Created");
    res.redirect("/listings");
}

module.exports.rendereditListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!Listing) {
        req.flash("error", "Listing doesn't exists ");
        res.redirect("/listings");
    }

    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", ("/upload/w_250"));
    // req.flash("error", "you mush be logged in to edit listings");
    res.render("./listings/edit.ejs", { listing, originalImageUrl });
}

module.exports.updateListingPatch = async (req, res) => {
    // if (!req.body.listing) {
    //     throw new ExpressError(404, "Send valid data for listing");
    // }
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    if (typeof req.file != "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename };
        await listing.save();
    }

    req.flash("success", "Listing Updated successfully!");
    res.redirect(`/listings/${id}`);
}

module.exports.deleteListing = async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing deleted!");
    res.redirect("/listings");
}