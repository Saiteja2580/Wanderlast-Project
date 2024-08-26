const mongoose = require("mongoose");
const Listing = require("../models/listing.js");
let sampleListings = require("./data");

// const url = "mongodb://127.0.0.1:27017/wonderlast";
const db_url =
  "mongodb+srv://Saiteja2580:zP2xguI9T1w7moLR@cluster0.taddp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
async function main() {
  await mongoose.connect(db_url);
}
main()
  .then(() => console.log("Connection Success"))
  .catch((err) => console.log(err));

// //initializing datavase
// const initDB = async () => {
//   await Listing.deleteMany({});
//   sampleListings = sampleListings.map((obj) => ({
//     ...obj,
//     owner: "66c8b678ad48becc1d9567db",
//   }));
//   await Listing.insertMany(sampleListings);
//   console.log("Data Initialized");
// };
// initDB();
