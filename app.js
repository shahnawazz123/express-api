import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import userRoutes from './routes/userRoutes.js';

dotenv.config();
const app = express();
const port = process.env.PORT;
const host = process.env.HOST;

app.use(cors()); // CORS policy for front-end
app.use(express.json()); // JSON
app.use('/api/user', userRoutes); // Load Routers with correct base path

app.listen(port, host, () => {
    console.log(`Server running at http://${host}:${port}/`);
});
