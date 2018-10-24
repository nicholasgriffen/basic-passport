require('dotenv').config()

const express = require('express')
const passport = require('passport')
const GitHubStrategy = require('passport-github').Strategy
const cookieSession = require('cookie-session')

const app = express()
const port = process.env.PORT || 3030

app.use(cookieSession({
    secret: process.env.COOKIE_SECRET
}))
app.use(passport.initialize())

passport.use(new GitHubStrategy(
    {
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: process.env.CALLBACK,
        userAgent: process.env.DOMAIN
    },
    function onSuccess(token, refreshToken, profile, done) {
        done(null, { token, profile })
    }
))

app.use(passport.session())

passport.serializeUser((object, done) => {
    done(null, { token: object.token })
})

passport.deserializeUser((object, done) => {
    done(null, object)
})

app.get('/auth/github/callback',
    passport.authenticate('github', {
        successRedirect: '/',
        failureRedirect: '/login'
    })
)

app.get('/', (req, res, next) => {
    console.log(req.user)
    res.status(200).send('HOME')
})

app.get('/login', (req, res, next) => {
    console.log(req)
    res.status(200).send('LOG IN')
})

app.listen(port, () => console.log(`Listening on ${port}`))
