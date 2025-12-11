const Listing = require("../models/listing.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

//Index Route
module.exports.index = async (req, res) => {
    const allListing = await Listing.find({});
    res.render("listings/index.ejs", {allListing});
};

//New Route
module.exports.new = async (req, res) => {
    res.render("listings/new.ejs");
}

//Add new Route
module.exports.addNew = async (req, res) => {
    let response = await geocodingClient.forwardGeocode({
    query: req.body.Listing.location,
    limit: 1,
    }).send();

    let newListing = new Listing(req.body.Listing);
    newListing.owner = req.user._id;
    newListing.image.url = req.file.path;
    newListing.image.filename = req.file.filename;
    newListing.geometry = response.body.features[0].geometry;
    await newListing.save();
    req.flash("success", "New Listing Created");
    res.redirect("/listings");
}

//Edit Route
module.exports.edit = async (req, res) => {
    const {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing) {
        req.flash("error", "Listing you requested for doesn't exist");
        return res.redirect("/listings");
    } 

    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/h_300,w_250");
    res.render("listings/edit.ejs", {listing, originalImageUrl});
}

//Show Route
module.exports.show = async (req, res) => {
    const {id} = req.params;
    const listing = await Listing.findById(id).populate({path: "reviews", populate: {path: "author",},}).populate("owner");
    if(!listing) {
        req.flash("error", "Listing you requested for doesn't exist");
        return res.redirect("/listings");
    } else {
        res.render("listings/show.ejs", {listing});
    }
}

//Update Route
module.exports.update = async (req, res) => {
    const {id} = req.params;
    const listing = await Listing.findByIdAndUpdate(id, req.body.Listing, {runValidators: true, new: true});
    
    if(typeof req.file !== "undefined") {
        listing.image.url = req.file.path;
        listing.image.filename = req.file.filename;
        await listing.save();
    }
    

    req.flash("success", "Listing Updated!!");
    res.redirect(`/listings/${id}`);
}

//Delete Route
module.exports.delete = async (req, res) => {
    const {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted!!");
    res.redirect("/listings");
}