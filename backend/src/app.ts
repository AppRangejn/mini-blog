import cors from 'cors';
import express from 'express';
import { errorHandler } from './middlewares/error.mw';
import router from './routes';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api', router);
app.use(errorHandler);

export default app;
