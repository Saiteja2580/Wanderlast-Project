//printing env varibles

if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

//console.log(process.env.SECRET);

//requiring all necessary packages
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const listingsRouter = require("./routes/listings.js");
const reviewsRouter = require("./routes/reviews.js");
const userRouter = require("./routes/user.js");
const MongoStore = require("connect-mongo");
//defining url of database mongo
//const url = "mongodb://127.0.0.1:27017/wonderlast";
const db_url = process.env.ATLAS_DB_URL;
async function main() {
  await mongoose.connect(db_url);
}
//conecting to database
main()
  .then((res) => console.log("Connected to Wonderlast"))
  .catch((err) => console.log(err));
//checking whther server working well or not
app.listen(8080, () => {
  console.log(`Sever is listening to port 8080`);
});

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "public")));

const store = MongoStore.create({
  mongoUrl: db_url,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600,
});

store.on("error", () => {
  console.log("Error in mongo session store", err);
});

//session options
const sessionOptions = {
  store,
  secret: process.env.SECRET,
  resave: true,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

app.use(session(sessionOptions));
app.use(flash());

//using passport
//1.telling app that i am using passport for authentication
app.use(passport.initialize());
//2.telling app that passsport use session to handle w=request from various tabs in single browser
app.use(passport.session());
//initializing local strategy and sending user details to authenticate
passport.use(new LocalStrategy(User.authenticate()));
//when session is started by user it stores info about session which is serializing user
passport.serializeUser(User.serializeUser());
//when session is closed unstoring user information
passport.deserializeUser(User.deserializeUser());

//middleware for flash messages
app.use((req, res, next) => {
  res.locals.sucMsg = req.flash("success");
  res.locals.delMsg = req.flash("error");
  res.locals.user = req.user;
  next();
});

//writing an api to recieve get request from home route or definign home route
// app.get("/demoUser", async (req, res) => {
//   let fakeUser = new User({
//     email: "ab@gmail.com",
//     username: "ab",
//   });
//   let newUser = await User.register(fakeUser, "helloworld");
//   console.log(newUser);
//   res.send(newUser);
// });

app.get("/", (req, res) => {
  res.redirect("/listings");
});

//using exprwss eouter to serve listings
app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/", userRouter);

//when request comes from new route which doesnt exist
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});
//error handling middleware

app.use((err, req, res, next) => {
  let { status = 500, message = "Some error occured" } = err;
  res.status(status).render("error.ejs", { err });
  //res.status(status).send(message);
});
