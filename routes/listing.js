const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { required } = require("joi");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer = require("multer");
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });


router
    .route("/")
    .get(wrapAsync(listingController.index))
    .post(isLoggedIn, upload.single("Listing[image][url]"), validateListing, wrapAsync(listingController.addNew));
    // .post(upload.single("Listing[image][url]"), (req, res) => {res.send(req.file);});

//Create new Route
router.get("/new", isLoggedIn, wrapAsync(listingController.new));

router
    .route("/:id").get(wrapAsync(listingController.show))
    .put(isLoggedIn,isOwner,upload.single("Listing[image][url]"), validateListing, wrapAsync(listingController.update))
    .delete(isLoggedIn,isOwner, wrapAsync(listingController.delete)); 

//Edit Route
router.get("/:id/edit", isLoggedIn,isOwner, wrapAsync(listingController.edit));

module.exports = router;