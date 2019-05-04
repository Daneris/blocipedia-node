const userQueries = require("../db/queries.users.js");
const passport = require("passport");
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const stripe = require("stripe")(process.env.STRIPE_KEY);
const User = require("../db/models").User;

module.exports = {

  signUp(req,res,next){
    res.render("users/signup");


  },
  create(req, res, next){
//#1
    let newUser = {
      email: req.body.email,
      password: req.body.password,
      passwordConfirmation: req.body.passwordConfirmation
    };
    const msg = {
      to: req.body.email,
      from: 'test@example.com',
      subject: 'Sending with SendGrid is Fun',
      text: 'and easy to do anywhere, even with Node.js',
      html: '<strong>and easy to do anywhere, even with Node.js</strong>',
    };

    userQueries.createUser(newUser, (err, user) => {
      if(err){
        console.log(err)
        req.flash("error", err);
        res.redirect("/users/signup");

      } else {
        passport.authenticate("local")(req, res, () => {
          req.flash("notice", "You've successfully signed in!");
          res.redirect("/");
        })
        sgMail.send(msg);
      }
    });
  },

  signInForm(req, res, next){
    res.render("users/signin");
  },
  signIn(req, res, next){
    passport.authenticate("local")(req, res, function () {
      if(!req.user){
        req.flash("notice", "Sign in failed. Please try again.")
        res.redirect("/users/signin");
      } else {
        req.flash("notice", "You've successfully signed in!");
        res.redirect("/");
      }
    })
  },

  signOut(req, res, next){
    req.logout();
    req.flash("notice", "You've successfully signed out!");
    res.redirect("/");
  },

  upgradeAccount(req,res,next){
    res.render("users/upgradeAccount");
  },

  charge(req,res,next){

    console.log(req.body);
    const amount = 500;

    stripe.customers.create({
      email: req.body.stripeEmail,
      source: req.body.stripeToken
      })

        .then((customer) => {
          stripe.charges.create({
            amount,
            description:"Premium Account create private wikis",
            currency: "usd",
            customer: customer.id
          })
            .then((charge) =>{
              res.render("users/success")

            })

            .catch((err)=>{
              console.log(err);
            })

          })
          userQueries.getUser(req.params.id,(err,result) =>{
            console.log(req.params.id)
            User.update({role: 1}, {
              where: {
                id: req.params.id
              }

            }).then(() =>{
              console.log("done")
            })

          })


        }




}
