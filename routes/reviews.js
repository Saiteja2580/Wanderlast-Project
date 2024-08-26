const express = require("express");
const router = express.Router({ mergeParams: true });
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const wrapasync = require("../utils/wrapAsync.js");
const { validateReview } = require("../middleware.js");
const { isLoggedIn } = require("../middleware.js");
const { isReviewAuthor } = require("../middleware.js");
const reviewController = require("../controllers/review.js");
//importing the validator to check whethr the data came from the client is containing all fields which are in schema defined in mongoose

//Reviews
// -------------------------------writing apis for reviews for crud using id---------------

router.post(
  "/",
  isLoggedIn,
  validateReview,
  wrapasync(reviewController.createReview)
);

router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  wrapasync(reviewController.deleteReview)
);

module.exports = router;
