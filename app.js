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

//logging
if(process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

//handlebars
app.engine('.hbs', exphbs({defaultLayout: 'main', extname: '.hbs'}))
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

// static folder
app.use(express.static(path.join(__dirname, 'public')))

//routes
app.use('/', require('./routes/index'))
app.use("/auth", require("./routes/auth"));

const PORT = process.env.PORT || 5000

app.listen(PORT, console.log('server running in :', PORT, process.env.NODE_ENV))

