require('dotenv').config();

const express = require('express');
const connectDB = require('./config/db');

const app = express();

connectDB();

//Body-parser provided by express
app.use(express.json({ extended: false }));

//define routes

//define PORT
const PORT = process.env.PORT || 5000;

//define Routes
app.use('/signup', require('./routes/registration'));

app.listen(PORT, () => console.log(`Server started on Port ${PORT}`));
