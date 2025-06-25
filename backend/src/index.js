import express from 'express';
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import { connectDB } from "./lib/db.js";
dotenv.config();

import authRoutes from "./routes/auth.route.js"
import messageRoutes from "./routes/message.route.js";

import { app, server } from "./lib/socket.js";

// Increase payload size limits
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true, limit: "5mb" }));

// CORS middleware (must be before routes)
app.use(
  cors({
    origin: "https://snazzy-tapioca-9426a0.netlify.app",
    credentials: true,
  })
);

app.use(cookieParser());

app.use('/api/auth', authRoutes)
app.use('/api/messages', messageRoutes)

connectDB()
server.listen(5001,() => {
    console.log("server running on port http://localhost:5001")
    
})
