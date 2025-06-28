// backend/server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js"

dotenv.config();

console.log("JWT_SECRET is:", process.env.JWT_SECRET);

const app = express();
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());

app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

// Import your routes here (coming soon)

const PORT = process.env.PORT || 5000;

// Start Server after DB connects
connectDB()

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
