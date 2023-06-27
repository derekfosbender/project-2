// const express = require('express');

// const bodyParser = require('body-parser');

// const path = require('path');

// const PUBLISHABLE_KEY = process.env.PUBLISHABLE_KEY;

// const stripe = require('stripe')(SECRET_KEY);

// const SECRET_KEY = process.env.SECRET_KEY;

// const app = express()

// app.use(bodyParser.urlencoded({extended:false}))
// app.use(bodyParser.json());

// app.set("view engine", "hbs")

// const PORT = process.env.PORT || 3000

// app.get('/home', (req,res) => {
//     res.render('home',{
//         key:PUBLISHABLE_KEY 
//     })
// })

// app.post('/payment', (req,res) =>{
//     stripe.customers.create({
//         email:req.body.stripeEmail,
//         source:req.body.stripeToken,
//         name:'Derek',
//         address:{
//             line1:'23 Mountain Valley ',
//             postal_code:'49423',
//             city:'Grand Rapids',
//             state:'Michigan',
//             country:'United States'
//         }
//     })
//     .then((customer) =>{
//         return stripe.create({
//             amount:7000,
//             description:"Account",
//             currency: 'USD',
//             customer: customer.id
//         })
//     })
//     .then((charge) =>{
//         console.log(charge)
//         res.send("success")
//     })
//     .catch((err) =>{
//         res.send(err)
//     })
// })

// app.listen(PORT,()=>{
//     console.log(`App is listening on ${PORT}`)
// })