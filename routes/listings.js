const express = require("express");
const router = express.Router({ mergeParams: true });
const Listing = require("../models/listing.js");
const wrapasync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { isLoggedIn } = require("../middleware.js");
const { isAuthorized } = require("../middleware.js");
const multer = require("multer");
const axios = require("axios");
const { validateListing } = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });
//index and create listing route route
router.route("/").get(wrapasync(listingController.index)).post(
  isLoggedIn,
  //validateListing,
  upload.single("listing[image]"),
  wrapasync(listingController.createList)
);

//rendering form to register newlist
router.get("/new", isLoggedIn, listingController.new);
//show route and update route and delete route
router
  .route("/:id")
  .get(wrapasync(listingController.show))
  .patch(
    // validateListing,
    isAuthorized,
    upload.single("listing[image]"),
    wrapasync(listingController.editList)
  )
  .delete(isLoggedIn, isAuthorized, wrapasync(listingController.delete));

//sending edit form
router.get("/:id/edit", isLoggedIn, wrapasync(listingController.edit));

module.exports = router;
