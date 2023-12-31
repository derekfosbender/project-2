const express = require("express");
const router = express.Router();
const Account = require("../models/Account");
const isLoggedIn = require("../utils/isLoggedIn");
const PUBLISHABLE_KEY = process.env.PUBLISHABLE_KEY;
const SECRET_KEY = process.env.SECRET_KEY;
const stripe = require('stripe')(SECRET_KEY);


router.get("/account/new", isLoggedIn, (req, res)=>{
    res.render("account/new-account");
});


router.post("/account/create", isLoggedIn, (req,res)=>{
   Account.create({
    description: req.body.accountDescription,
    price: req.body.accountPrice,
    townhall: req.body.accountTownhall,
    gems: req.body.accountGems,
    sceneries: req.body.accountSceneries,
    level: req.body.accountLevel,
    builderhall: req.body.accountBuilderhall,
    skins: req.body.accountSkins,
    max: req.body.accountMax,
    img: req.body.img,
    user: req.session.currentUser._id
  }).then((response)=>{
    res.redirect("/account");
  })
})

router.get("/account", (req,res)=>{
  Account.find()
  .then((allAccounts)=>{
      res.render("account/list-account", {account: allAccounts});
  })

}); 

router.get("/account/:id", (req,res, next)=>{
  const accID = req.params.id;
  Account.findById(accID)
  .then((theAccount)=>{
    const aUser = req.session.currentUser && String(theAccount.user) === req.session.currentUser._id;
    const aAdmin = req.session.currentUser && req.session.currentUser.aAdmin;

  res.render("account/details-account", {account: theAccount, user: aUser, aAdmin: aAdmin})
  })
})
 
router.post("/account/delete/:id", isLoggedIn, (req,res, next)=>{
  Account.findById(req.params.id)
  .then((theAccount)=>{
    const aUser = String(theAccount.user) === req.session.currentUser._id;
    const aAdmin = req.session.currentUser === req.session.currentUser.admin;

    if (!aUser && !aAdmin) {
      req.flash("error", "You are not authorized to delete this account listing");
      return res.redirect(`/account/${req.params.id}`);
  }
  Account.findByIdAndRemove(req.params.id)
  .then(()=>{
    req.flash("success", "Account deleted")
    res.redirect("/account")
  })
})
})

router.get("/account/:id/edit", isLoggedIn, (req,res, next)=>{
  Account.findById(req.params.id)
  .then((theAccount)=>{
    const aUser = String(theAccount.user) === req.session.currentUser._id;
    const aAdmin = req.session.currentUser === req.session.currentUser.admin;

    if(!aUser && !aAdmin) {
      req.flash("error", "You are not allowed to edit this account");
      return res.redirect(`/account/${req.params.id}`);
    }
    res.render("account/edit-account", {theAccount: theAccount})
  })
  .catch((err)=>next(err));
})

router.post("/account/:id/update", isLoggedIn, (req,res, next)=>{
  Account.findByIdAndUpdate(req.params.id,{
    description: req.body.accountDescription,
    price: req.body.accountPrice,
    townhall: req.body.accountTownhall,
    gems: req.body.accountGems,
    sceneries: req.body.accountSceneries,
    level: req.body.accountLevel,
    builderhall: req.body.accountBuilderhall,
    skins: req.body.accountSkins,
    max: req.body.accountMax,
    img: req.body.img,

  }).then(()=>{
    req.flash("success","Account updated");
    res.redirect(`/account/${req.params.id}`);
  })
  
  })

  router.get('/account/payment/:id', (req,res) => {
    res.render('account/payment-account', {
        key: PUBLISHABLE_KEY
    }) 
})

router.post('/payment', (req,res) =>{
    return stripe.create({
            success_url: "https://localhost:3000/",
            amount: 7000,
            description:"Account",
            currency: 'USD',
            customer: customer.id
        })
    .then((charge) =>{
      console.log(charge)
      res.send("success")
  }).then((res)=>{
    res.redirect("/account");
  })
  .catch((err) =>{
      res.send(err)
  })
})

router.get('/payment', (req,res) => {
  res.redirect("/account");
})
module.exports = router;