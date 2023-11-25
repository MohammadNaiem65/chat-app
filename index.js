const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();

// connect to db
mongoose
	.connect(process.env.MONGO_CONNECTION_STRING)
	.then(() => console.log('Connected to DB successfully!'))
	.catch((err) => console.log(err));

// req parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// cookie parser
app.use(cookieParser(process.env.COOKIE_SECRET));

// set view engine
app.set('view engine', 'ejs');

// set static folder
app.use(express.static(path.join(__dirname, 'public')));

// routing setup

// error handler

app.listen(process.env.PORT, () =>
	console.log(`app listening to port ${process.env.PORT}`)
);
