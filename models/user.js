const { required } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passport = require("passport-local-mongoose");

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  //no need to specify username and password cause passport local mongoose adds default
});

userSchema.plugin(passport);

module.exports = mongoose.model("User", userSchema);
