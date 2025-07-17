import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import connectDB from './config/conectDB.js';
import userRoutes from './routes/user.js';


dotenv.config();
const app = express();
app.use(cors( {origin:"http://localhost:3000",credentials:true}));
app.use(express.json());
app.use(helmet());
app.use(cookieParser());
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || 'localhost';

// auth routes
app.use('/api/auth', userRoutes);

// Fix: Only pass PORT to app.listen
app.listen(PORT, () => {
    connectDB();
    console.log(`Server is running on http://${HOST}:${PORT}`);
});

