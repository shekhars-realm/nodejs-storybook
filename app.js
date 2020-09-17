const express = require('express')
const dotenv = require("dotenv")
const connectDb = require('./config/db')
const connectDB = require('./config/db')
const morgan = require('morgan')
const exphbs = require('express-handlebars')
const path = require('path')
  
dotenv.config({path: './config/config.env'})

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

// static folder
app.use(express.static(path.join(__dirname, 'public')))

//routes
app.use('/', require('./routes/index'))

const PORT = process.env.PORT || 5000

app.listen(PORT, console.log('server running in :', PORT, process.env.NODE_ENV))

