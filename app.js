import express from 'express';
import cors from 'cors';
import path from 'path';
import "dotenv/config";
import authRouter from './routes/auth.js';
import userRouter from './routes/users.js';
import { fileURLToPath } from 'url';
import helmet from 'helmet';
import categoryRouter from './routes/categories.js';

//^ Fix for __dirname not being defined in ES6 modules
const __dirname = path.dirname(fileURLToPath(import.meta.url));


const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/courses/covers", express.static(path.join(__dirname, "courses", "covers")));

app.use('/auth', authRouter);
app.use('/users', userRouter);
app.use('/categories', categoryRouter);

export default app;
export { __dirname };

//! Test