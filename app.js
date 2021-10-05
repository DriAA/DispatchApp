// Dependencies.
const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const methodOverride = require('method-override');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const bodyParser = require('body-parser');
const { addAbortSignal } = require('stream');
const { rawListeners } = require('process');

// Require Models.
const User = require('./models/user');


// Mongoose Connection
mongoose.connect('mongodb://localhost:27017/CRUDAppv2', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Handle Mongoose connection
const db = mongoose.connection;
db.on("error", console.error.bind(console, " Connection Error:"));
db.once("open", () => {
    console.log("Database connected!")
})

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.set('public', path.join(__dirname, 'public'))
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')))
const sessionConfig = {
    secret: 'thisshouldbeabettersecret!',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}


app.use(session(sessionConfig))
app.use(flash());

app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()));

// Store user in session. 
passport.serializeUser(User.serializeUser());
// Remove user from session.
passport.deserializeUser(User.deserializeUser())

app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

//! Routers
const authRoute = require('./routes/auth')
const applicationRoute = require('./routes/application')

app.use('/auth',authRoute)
app.use('/app', applicationRoute)


// !Routes.
// @ GET / 
// @ Route - Show Landing Page.
app.get('/',(req,res)=>{
    res.render('landing/index')
})

// @ GET /features
// @ Route - Show the Features of the application.
app.get('/features', (req, res) =>{
    res.render('landing/features')
})

// @ GET /pricing
// @ Route - Show the Prices of an application.
app.get('/pricing',(req, res) =>{
    res.render('landing/pricing')
})

// @ GET /about
// @ Route - Display the about page of the company.
app.get('/about', (req, res) =>{
    res.render('landing/about')
})

// @ GET /contact
// @Route - Display the contact information
app.get('/contact',(req,res)=>{
    res.render('landing/contact')
})
//  @ POST /contact
//  @ Route - Display the message that was sent.
app.post('/contact',(req, res)=>{
    req.body.contact.email.length > 1 || req.body.contact.email != ''?
    res.json(req.body.contact):
    res.status(404).json("No information to display.")
})

// Server Start up.
let port = 5000;
app.listen(port, () => {
    console.log(`Server Initialized on port ${port}`)
})