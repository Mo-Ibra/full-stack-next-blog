import express, { Express, Request, Response } from 'express';

import authRoutes from './routes/auth/auth.routes';
import categoryRoutes from './routes/category/category.routes';

import cors from 'cors';

import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';

const app: Express = express();

const PORT = 8000;

// Routes
app.get('/', (req: Request, res: Response) => {
    res.send('Works');
});

app.use(cors({ origin: 'http://localhost:3000', credentials: true, }));

app.use(bodyParser.json());
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/category', categoryRoutes);

// Server
app.listen(PORT, (): void => console.log(`Application is works on Port ${PORT}`));