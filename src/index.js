import express from 'express'
import dotenv from 'dotenv'
dotenv.config()
import connectDB from './utils/db.js'
import AppError from './utils/appError.js'
import errorHandlerMiddleware from './middleware/errorHandlerMiddleware.js'
import authRouter from './routes/authRoute.js'


const app = express();

app.use(express.json());

//route-middlewares
app.use("/api/v1/auth", authRouter);

app.all("*", (req, _, next) => {
    throw new AppError(`Can't find ${req.originalUrl} on this server`, 404)
});

app.use(errorHandlerMiddleware)


//server initialization
const port = process.env.PORT || 3001;
const start = async () => {
    try {
        await connectDB();
        app.listen(port, () => {
            console.log(`server running on port ${port}`);
        })
    } catch (error) {
        console.log(error);
        process.exit(1); //unsuccessful exit
    }
}

start()