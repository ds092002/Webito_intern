import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import cors from 'cors';
import { fileURLToPath } from 'url';

dotenv.config();

const app = express();

// Path setup for EJS
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// EJS setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Routes
import paymentRouter from './routes/payment.routes.js';
app.use('/', paymentRouter)

const port = process.env.PORT;
app.listen(port , () => {
    console.log(`Server is running on port http://localhost:${port}`);
});