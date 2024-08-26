const Listing = require("../models/listing");
const axios = require("axios");
// const

module.exports.index = async (req, res) => {
  let listingData = await Listing.find({});
  res.render("./listings/index.ejs", { listingData });
};

module.exports.new = (req, res) => {
  console.log(req.user);
  res.render("./listings/new.ejs");
};

module.exports.show = async (req, res) => {
  let { id } = req.params;
  let list = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");
  if (!list) {
    req.flash("Failure", "Listing you requested does not Found !");
    res.redirect("/listings");
  } else {
    // console.log(list);
    res.render("./listings/show.ejs", { list });
  }
};

module.exports.createList = async (req, res, next) => {
  let url = req.file.path;
  let filename = req.file.filename;
  let coord = await axios.get(
    `https://api.openweathermap.org/geo/1.0/direct?q=${req.body.listing.location}&appid=${process.env.GEOCODE_API_KEY}`
  );
  console.log(coord);
  // let { lan, lat } = coord.data;

  const newList = new Listing(req.body.listing);
  newList.owner = req.user._id;
  newList.image = { url, filename };
  newList.geometry = {
    type: "Point",
    coordinates: [coord.data[0].lon, coord.data[0].lat],
  };
  console.log(newList);
  await newList.save();
  //console.log(url, filename);
  req.flash("success", "New Listing Created Successfully");
  res.redirect("/listings");
};

module.exports.edit = async (req, res) => {
  let { id } = req.params;
  let list = await Listing.findById(id);
  if (!list) {
    req.flash("error", "Listing you requested does not Found !");
    res.redirect("/listings");
  } else {
    let originalUrl = list.image.url;
    originalUrl = originalUrl.replace("/upload", "/upload/h_100,w_150");
    res.render("./listings/edit.ejs", { list, originalUrl });
  }
};

module.exports.editList = async (req, res, next) => {
  let { id } = req.params;
  // console.log(req.body.listing);
  if (!req.body.listing) {
    next(new ExpressError(400, "Send Valid data"));
  }

  let list = req.body.listing;
  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    list.image = { url, filename };
  }

  //console.log(list);
  //console.log(list);
  await Listing.findByIdAndUpdate(id, { ...list }, { returnDocument: "after" });
  req.flash("success", "Listing edited Succesfully");
  res.redirect(`/listings/${id}`);
};

module.exports.delete = async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing Deleted Successfully");
  res.redirect("/listings");
};
