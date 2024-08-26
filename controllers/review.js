const Review = require("../models/review.js");
const Listing = require("../models/listing.js");

module.exports.createReview = async (req, res) => {
  //console.log(req.body.review);
  let review = req.body.review;
  // console.log(review);
  let { id } = req.params;
  console.log(id);
  let newReview = new Review(review);
  newReview.author = res.locals.user._id;
  console.log(newReview);
  let list = await Listing.findByIdAndUpdate(id, {
    $push: { reviews: newReview },
  });
  await newReview.save();
  req.flash("success", "Review Created Successfully");
  res.redirect(`/listings/${id}`);
};

module.exports.deleteReview = async (req, res) => {
  let { id, reviewId } = req.params;
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "Review deleted Successfully");
  res.redirect(`/listings/${id}`);
};
