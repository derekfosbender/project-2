const express = require("express");
const router = express.Router();
const Clan = require("../models/Clan");
const isLoggedIn = require("../utils/isLoggedIn");
const PUBLISHABLE_KEY = process.env.PUBLISHABLE_KEY;

router.get("/clan/new", isLoggedIn, (req, res)=>{
    res.render("clan/new-clan");
});

router.post("/clan/create", isLoggedIn, (req,res)=>{
   Clan.create({
    name: req.body.theName,
    price: req.body.thePrice,
    level: req.body.theLevel,
    league: req.body.theLeague,
    warlog: req.body.theWarlog,
    img: req.body.img,
    user: req.session.currentUser._id
  }).then((response)=>{
    res.redirect("/clan");
  })
})

router.get("/clan", (req,res)=>{
  Clan.find()
  .then((allClans)=>{
      res.render("clan/list-clan", {clan: allClans});
  })

});

router.get("/clan/:id", (req,res)=>{
  const clanID = req.params.id;
  Clan.findById(clanID)
  .then((theClan)=>{
    const aUser = req.session.currentUser && String(theClan.user) === req.session.currentUser._id;
    const aAdmin = req.session.currentUser && req.session.currentUser.aAdmin;

  res.render("clan/details-clan", {clan: theClan, user: aUser, aAdmin: aAdmin})
  })
})

router.post("/clan/delete/:id", (req,res)=>{
  Clan.findById(req.params.id)
  .then((theClan)=>{
    const aUser = String(theClan.user) === req.session.currentUser._id;
    const aAdmin = req.session.currentUser === req.session.currentUser.admin;

    if (!aUser && !aAdmin) {
      req.flash("error", "You are not authorized to delete this account listing");
      return res.redirect(`/clan/${req.params.id}`);
  }
  Clan.findByIdAndRemove(req.params.id)
  .then(()=>{
    req.flash("success", "Clan deleted")
    res.redirect("/clan");
  })
})
})

router.get("/clan/:id/edit", (req,res)=>{
  Clan.findById(req.params.id)
  .then((theClan)=>{
    const aUser = String(theClan.user) === req.session.currentUser._id;
    const aAdmin = req.session.currentUser === req.session.currentUser.admin;

    if(!aUser && !aAdmin) {
      req.flash("error", "You are not allowed to edit this account");
      return res.redirect(`/clan/${req.params.id}`);
    }

    res.render("clan/edit-clan", {theClan: theClan})
  })
})

router.post("/clan/:id/update", (req,res)=>{
  Clan.findByIdAndUpdate(req.params.id,{
    price: req.body.thePrice,
    name: req.body.theName,
    level: req.body.theLevel,
    league: req.body.theLeague,
    warlog: req.body.theWarlog,
    img: req.body.img

  }).then(()=>{
    res.redirect(`/clan/${req.params.id}`)
  })
  
  })

  router.get('/clan/payment/:id', (req,res) => {
    res.render('clan/payment-clan',{
        key:PUBLISHABLE_KEY 
    })
})

router.post('/payment', (req,res) =>{
    return stripe.create({
            amount:70.00,
            description:"Clan",
            currency: 'USD',
            customer: customer.id
        }).then((res)=>{
          res.redirect("/clan");
     })
     .then((charge) =>{
          console.log(charge)
          res.send("success")
      })
      .catch((err) =>{
          res.send(err)
      })
    })

    router.get('/payment', (req,res) => {
      res.redirect("/clan");
    })
module.exports = router;