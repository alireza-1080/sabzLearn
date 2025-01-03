import express from 'express';
import cors from 'cors';
import path from 'path';
import "dotenv/config";
import authRouter from './routes/auth.js';
import userRouter from './routes/users.js';
import { fileURLToPath } from 'url';
import helmet from 'helmet';
import categoryRouter from './routes/categories.js';
import coursesRouter from './routes/courses.js';
import sessionRouter from './routes/sessions.js';
import commentRouter from './routes/comments.js';
import contactUsRouter from './routes/contactUsRouter.js';
import newsletterRouter from './routes/newsletterRouter.js';
import searchRouter from './routes/searchRouter.js';
import notificationRouter from './routes/notificationRouter.js';
import promotionRouter from './routes/promotionRouter.js';
import articlesRouter from './routes/articlesRouter.js';

//^ Fix for __dirname not being defined in ES6 modules
const __dirname = path.dirname(fileURLToPath(import.meta.url));


const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/courses/covers", express.static(path.join(__dirname, "courses", "covers")));

//^ Error handling middleware for JSON parsing errors
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return res.status(400).json({ error: "Invalid JSON" });
    }
    next();
});

app.use('/auth', authRouter);
app.use('/users', userRouter);
app.use('/categories', categoryRouter);
app.use('/courses', coursesRouter);
app.use('/sessions', sessionRouter);
app.use('/comments', commentRouter);
app.use('/contact-us', contactUsRouter);
app.use('/newsletter', newsletterRouter);
app.use('/search', searchRouter);
app.use('/notification', notificationRouter);
app.use('/promotion', promotionRouter);
app.use('/articles', articlesRouter);

export default app;
export { __dirname };