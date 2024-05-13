import express from "express";
import { dbConnection } from "./database/dbConnection.js";
import userRouter from "./routes/userRoutes.js";
import { config } from "dotenv";
import cors from "cors";
import { errorMiddleware } from "./middlewares/error.js";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";

const app = express();
config({ path: "./config/config.env" });

app.use(
  cors({
    origin: [process.env.FRONTEND_URL],
    method: ["GET", "POST", "DELETE", "PUT"],
    credentials: true,
  })
);

// app.use("/", (req, res, next) => {
//   return res.status(200).json({ msg: "Hello from User" });
// });
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);
app.use("/", userRouter);
dbConnection();

app.use(errorMiddleware);
export default app;
