// app.js

import express from "express";
import { dbConnection } from "./database/dbConnection.js";
import jobRouter from "./routes/jobRoutes.js";
import userRouter from "./routes/userRoutes.js";
import applicationRouter from "./routes/applicationRoutes.js";
import { config } from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import dotenv from "dotenv";
import { errorMiddleware } from "./middlewares/error.js";

const app = express();
config({ path: "./config/config.env" });

app.use(
  cors({
    origin: [process.env.FRONTEND_URL],
    method: ["GET", "POST", "DELETE", "PUT"],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/job", jobRouter);
app.use("/api/v1/application", applicationRouter);
dbConnection();

// // Define error middleware directly in app.js
// app.use((err, req, res, next) => {
//   // Set default error status code
//   let statusCode = err.statusCode || 500;

//   // Set default error message
//   let errorMessage = err.message || 'Internal Server Error';

//   // Handle specific CORS errors
//   if (err.name === 'CorsError') {
//     statusCode = 403; // Forbidden
//     errorMessage = 'Cross-Origin Request Blocked';
//   }

//   // Respond with error status code and message
//   res.status(statusCode).json({
//     success: false,
//     message: errorMessage
//   });
// });
app.use(errorMiddleware);

export default app;
