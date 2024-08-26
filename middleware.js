const Listing = require("./models/listing");
const { listingSchema } = require("./schema");
const { reviewSchema } = require("./schema.js");
const Review = require("./models/review.js");

const ExpressError = require("./utils/ExpressError.js");

module.exports.isLoggedIn = (req, res, next) => {
  //console.log(req.user);
  if (!req.isAuthenticated()) {
    //saving redirect url
    req.session.redirectUrl = req.originalUrl;
    //console.log(req.session.redirectUrl);
    req.flash("error", "You must be logged in to perform listing operations");
    return res.redirect("/login");
  }
  next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
    //console.log(res.locals.redirectUrl);
  }
  next();
};

module.exports.isAuthorized = async (req, res, next) => {
  let { id } = req.params;
  let list = await Listing.findById(id);
  if (!req.user._id.equals(list.owner._id)) {
    req.flash("error", "You are not owner of the listing");
    return res.redirect(`/listings/${id}`);
  }
  next();
};

//validating the object req.body
module.exports.validateListing = (req, res, next) => {
  let result = listingSchema.validate(req.body);
  // console.log(result);
  if (result.error) {
    throw new ExpressError(400, result.error);
  } else {
    next();
  }
};

module.exports.validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    // console.log(error);
    throw new ExpressError(400, error);
  } else {
    next();
  }
};

module.exports.isReviewAuthor = async (req, res, next) => {
  let { id, reviewId } = req.params;
  let review = await Review.findById(reviewId);
  //console.log(review);
  if (!res.locals.user._id.equals(review.author)) {
    req.flash("error", "You are not author of the review");
    return res.redirect(`/listings/${id}`);
  }
  next();
};
