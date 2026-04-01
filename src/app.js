import express from 'express';
import morgon from 'morgan';
import authRouter from './routes/auth.routes';


const app = express();
 

app.use(express.json());
app.use(morgon("dev"));


app.use("/api/auth",authRouter);

export default app;