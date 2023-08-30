require('dotenv').config();

const express = require('express');
const cors = require('cors');


const app = express();
app.use(expres.json());
app.use(express.urlencoded({extended:true}));
app.use(cors());

module.exports = app;
