const express = require('express');

const bodyParser = require('body-parser');

const path = require('path');

const PUBLISHABLE_KEY = "pk_test_51NK1nbJGzMz3ziXp30JZOAV6bIPr27wHevAbDaLUj0rLlExzkwgAeLiyWnF5nsr5TL6iylTDit08a0se0a6cXXmk00cl8r3QjT"

const stripe = require('stripe')(SECRET_KEY);

const SECRET_KEY = "sk_test_51NK1nbJGzMz3ziXpJPPcpdrX7ddcLSYOkhCmCCxJ7J7Ios0AY14KUfkx0vHs5JyvjBPB8IxLm7733u4albLCbeka00lugOrwbo"

const app = express()

app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json());

app.set("view engine", "ejs")

const PORT = process.env.PORT || 3000

app.get('/', (req,res) => {
    res.render('Home',{
        key:PUBLISHABLE_KEY 
    })
})

app.post('/payment', (req,res) =>{
    stripe.customers.create({
        email:req.body.stripeEmail,
        source:req.body.stripeToken,
        name:'Derek',
        address:{
            line1:'23 Mountain Valley ',
            postal_code:'49423',
            city:'Grand Rapids',
            state:'Michigan',
            country:'United States'
        }
    })
    .then((customer) =>{
        return stripe.create({
            amount:70,
            description:"Account",
            currency: 'USD',
            customer: customer.id
        })
    })
    .then((charge) =>{
        console.log(charge)
        res.send("success")
    })
    .catch((err) =>{
        res.send(err)
    })
})

app.listen(PORT,()=>{
    console.log(`App is listening on ${PORT}`)
})