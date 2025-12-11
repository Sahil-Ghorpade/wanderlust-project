const User = require("../models/user.js");

//Render SignUP Page
module.exports.renderSignup =  (req, res) => {
    res.render("users/signup.ejs", { page: "signup" });
}

//SignUp
module.exports.signup = async (req, res) => {
    try {
        let {username, email, password} = req.body;
        const newUser = new User({email, username});
        const resgisteredUser = await User.register(newUser, password);
        console.log(resgisteredUser);
        req.login(resgisteredUser, (err) => {
            if (err) { 
                return next(err);
            }
            req.flash("success", "Your account is created");
            res.redirect("/listings");
        })     
    } catch (error) {
        req.flash("error", error.message);
        res.redirect("/signup");
    }
}

//Render LogIn Page
module.exports.renderLogIn = (req, res) => {
    res.render("users/login.ejs", { page: "login" });
}

//LogIn
module.exports.login = (req,res) => {
    req.flash("success", "Welcome back to Wanderlust");
    res.redirect("/listings");
}

//LogOut
module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "You are logged out!");
        res.redirect("/listings");
    });
}