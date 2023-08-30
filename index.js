require('dotenv').config();

const express = require('express');
const cors = require('cors');
const connection = require('./connection');
const userRoute = require('./routes/user');


const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors());


// configuring the routes 
app.use("/user", userRoute);

module.exports = app;
