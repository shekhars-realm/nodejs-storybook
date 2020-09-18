const express = require('express')
const router = express.Router()
const {ensureAuth, ensureGuest} = require('../middleware/auth')

//login/landing pagerouter.get()

router.get('/', ensureGuest, (req, res) => {
    res.render('login', {
        layout: 'login'
    })
})


router.get('/dashboard', ensureAuth, (req, res) => {
    res.render('dashboard')
})


router.get("/profile", ensureAuth, (req, res) => {
  res.render("dashboard");
});

module.exports = router