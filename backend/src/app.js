import express from "express";
import cors from "cors";
const app = express();
import dotenv from "dotenv";
dotenv.config();
import cookieParser from "cookie-parser";

import userRouter from "./routes/userRoutes.js";
import adminRouter from "./routes/adminRoutes.js";

app.use(
  cors({
    origin: "http://localhost:5175",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use("/users", userRouter);
app.use("/admin", adminRouter);

export default app;
