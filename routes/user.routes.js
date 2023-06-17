const express = require("express");
const router = express.Router();
const User = require ("../models/User");
const bcryptjs = require('bcryptjs');
const isLoggedIn = require("../utils/isLoggedIn");


router.get("/signup", (req, res, next)=>{
    res.render("users/signup");
});

router.post("/signup", (req, res, next)=>{
    const numberOfRounds = 10;
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;

    bcryptjs
    .genSalt(numberOfRounds)
    .then(salt => bcryptjs.hash(password, salt))
    .then(hashedPassword => {

        User.create({username:username,email:email, password: hashedPassword})
        .then(()=>{
            res.redirect("/");
        })
    })
    .catch(error => console.log(error));
});

router.get("/", (req, res)=>{
    res.render("users/login");
});

router.post("/", (req,res,next)=>{
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({ username: username })
    .then(foundUser => {
      if (!foundUser) {
        console.log("user not found");
        res.redirect("/");
        return;
      } else if (bcryptjs.compareSync(password, foundUser.password)) {
        req.session.currentUser = foundUser;
        req.flash("success", "Sucessfully logged in")
        res.redirect('/account');
      } else {
        req.flash("error", "Incorrect password")
        res.redirect("/");
        
      }
    })
    .catch(error => next(error));
});

router.post("/logout", (req, res, next)=>{
    req.session.destroy();
    res.redirect("/");
})
module.exports = router;