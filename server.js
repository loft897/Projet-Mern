const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const userRoutes = require('./routes/user.routes');
require('dotenv').config({path: "./config/.env"});
require('./config/database');
const {checkUser} = require('./middleware/auth.middleware')

const app = express();



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser);


// jwt
app.get('*', checkUser) // declenchement du checking à chaque requette


// Routes
app.use('/api/user', userRoutes);



// Server 
app.listen(process.env.PORT, () => {
    console.log(`server listerning on port ${process.env.PORT}`)
})  