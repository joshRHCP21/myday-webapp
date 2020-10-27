const express = require('express')
const router = express.Router()

const User = require('../models/User')
const passport = require('passport')

router.get('/users/signin', (req, res) => {    
    res.render('users/signin');
});

router.post('/users/signin', passport.authenticate('local', {    
    successRedirect: '/notes', //indicando a donde se redireccionara luego del success
    failureRedirect: '/users/signin',//indicando a donde se redireccionara luego del failure
    failureFlash : true
}));

router.get('/users/signup', (req, res) => {
    res.render('users/signup');
});

router.post('/users/signup', async (req, res) => {
    // console.log(req.body);
    const {username, email, password, confirmPassword} = req.body;
    const errors = [];

    if(username.length == 0)
    {
        errors.push({text : 'Please insert your username'});
    }

    if(email.length == 0)
    {
        errors.push({text : 'Please insert your email'});
    }

    if(password.length == 0)
    {
        errors.push({text : 'Please insert your password'});
    }

    if(confirmPassword.length == 0)
    {
        errors.push({text : 'Please confirm your password'});
    }

    if(password!=confirmPassword)
    {
        errors.push({text : 'Passwords do not match'});
    }

    if(errors.length > 0)
    {
        res.render('users/signup', {errors, username, email, password, confirmPassword});
    } else
    {
        const existsEmail = await User.findOne({email : email});
        if(existsEmail)
        {
            req.flash('error_msg','The email is already registered :(');    
            res.redirect('/users/signup');    
        } else
        {
            const newUser = new User({
                                        user : username, 
                                        email : email,
                                        password : password
                                    });

            newUser.password = await newUser.encryptPassord(password);
            const successRegister = await newUser.save();
            console.log(successRegister);
            req.flash('success_msg','You are registered!');
            res.redirect('/');
        }        
    }
});

router.get('/users/complete-register', (req, res) => {
    res.render('users/completeRegister');
});

module.exports = router;