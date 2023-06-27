// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require("dotenv").config();

// ℹ️ Connects to the database
require("./db");

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require("express");
const mongoose = require('mongoose')
const cookieParser = require("cookie-parser");
const session = require('express-session');
const MongoStore = require('connect-mongo');
const path = require("path");

mongoose
  .connect(process.env.MONGODB_URI)
  .then(x => console.log(`Connected the Database: "${x.connections[0].name}"`))
  .catch(err => console.error('Error connecting to mongo', err));



// Handles the handlebars
// https://www.npmjs.com/package/hbs
const hbs = require('hbs');

const app = express();

// ℹ️ This function is getting exported from the config folder. It runs most pieces of middleware
require("./config")(app);

// default value for title local
const capitalize = require("./utils/capitalize");
const projectName = "project";

app.locals.appTitle = `${capitalize(projectName)}`;

 
app.set('views', __dirname + '/views');
app.set('view engine', 'hbs');

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));


app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.set('trust proxy', 1);
 
  app.use(
    session({
      secret: "canBeAnything",
      resave: true,
      saveUninitialized: false,
      cookie: {
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 60000
      },
      store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI
 
      })
    })
  );


app.use((req, res, next)=>{
  res.locals.user = req.session.currentUser || null;

  let aAdmin = false;
  if(req.session.currentUser && req.session.currentUser.admin) aAdmin = true;
  res.locals.aAdmin = aAdmin;
  next();
})

// 👇 Start handling routes here
const indexRoutes = require("./routes/user.routes");
app.use("/", indexRoutes);


// app.get("/", (req,res)=>{
//     res.render("index");
// })

const accountRoutes = require("./routes/account.routes");
app.use("/", accountRoutes);

const clanRoutes = require("./routes/clan.routes");
app.use("/", clanRoutes);

const userRoutes = require("./routes/user.routes");
app.use("/", userRoutes);

// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require("./error-handling")(app);

module.exports = app;
