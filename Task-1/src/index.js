const express = require('express');
const app = express();
import { connectDB } from './config/db.js';

const morgan = require('morgan');

app.use(express.json());
app.use(morgan("dev"));

require('dotenv').config();
const port = process.env.PORT ;

app.use(morgan('dev'));
app.use(express.json());

const usersRoutes = require('./routes/index.routes');
app.use('/api/users', usersRoutes);

connectDB();

app.listen(port, async () => {
    console.log(`Server listening on http://localhost:${port}`);
    
})