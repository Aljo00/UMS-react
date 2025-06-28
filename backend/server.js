// backend/server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

dotenv.config();

const app = express();
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());

// Import your routes here (coming soon)

const PORT = process.env.PORT || 5000;

// Start Server after DB connects
connectDB()

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
