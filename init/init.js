const mongoose = require("mongoose");
const Listing = require("../models/listing.js");
let sampleListings = require("./data");

// const url = "mongodb://127.0.0.1:27017/wonderlast";
const db_url = process.env.ATLAS_DB_URL;
async function main() {
  await mongoose.connect(db_url);
}
main()
  .then((res) => console.log("Connection Success"))
  .catch((err) => console.log(err));

//initializing datavase
const initDB = async () => {
  await Listing.deleteMany({});
  sampleListings = sampleListings.map((obj) => ({
    ...obj,
    owner: "66c8b678ad48becc1d9567db",
  }));
  await Listing.insertMany(sampleListings);
  console.log("Data Initialized");
};
initDB();
