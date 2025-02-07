const express = require('express');
const app = express();

// Connect to MongoDB
const mongoose =  require('mongoose');
const path = require('path');
const morgan = require('morgan');

let imagePath = path.join(__dirname, 'public','images')
let profileImageimagePath = path.join(__dirname, 'public','profile')
app.use(express.json());
app.use(morgan("dev"));
app.use('/public/images', express.static(imagePath));
app.use('/public/profile', express.static(profileImageimagePath));

require('dotenv').config();
const port = process.env.PORT ;

app.use(morgan('dev'));
app.use(express.json());

const usersRoutes = require('./routes/index.routes');
app.use('/api/users', usersRoutes)

app.listen(port, async () => {
    mongoose.connect(process.env.MONGODB_URL)
    .then(() => console.log('DB connected successfully.'))
    .catch(err => console.error('Failed to connect to DB', err));
    console.log(`Server Started at : http://localhost:${port}`);
})