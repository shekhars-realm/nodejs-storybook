const express = require('express')
const mongoose = require('mongoose')
const dotenv = require("dotenv")
const connectDB = require('./config/db')
const morgan = require('morgan')
const exphbs = require('express-handlebars')
const path = require('path')
const passport = require('passport')
const session = require('express-session')
const MongoStore = require("connect-mongo")(session);
  
dotenv.config({path: './config/config.env'})


//passport config
require('./config/passport')(passport)

connectDB()

//init
const app = express()

//body parser
app.use(express.urlencoded({extended: false}))
app.use(express.json())

//logging
if(process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

//handleber helpers
const {formatDate, truncate, stripTags, editIcon} = require('./helpers/hbs')


//handlebars
app.engine('.hbs', exphbs({helpers: {
  formatDate,
  truncate,
  stripTags, 
  editIcon
}, defaultLayout: 'main', extname: '.hbs'}))
app.set('view engine', '.hbs')

//session middleware
app.use(
  session({
    secret: "keyboard cat", 
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({mongooseConnection: mongoose.connection})
  })
);

//passport middleware
app.use(passport.initialize())
app.use(passport.session())

//set global variable
app.use(function(req, res, next) {
  res.locals.user = req.user || null
  next()
})

// static folder
app.use(express.static(path.join(__dirname, 'public')))

//routes
app.use('/', require('./routes/index'))
app.use("/auth", require("./routes/auth"));
app.use("/stories", require('./routes/stories'))

const PORT = process.env.PORT || 5000

app.listen(PORT, console.log('server running in :', PORT, process.env.NODE_ENV))

