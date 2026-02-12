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
    origin: ["https://chat-app-gray-seven.vercel.app", "http://localhost:5173"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  })
);


app.use(cookieParser());

app.use('/api/auth', authRoutes)
app.use('/api/messages', messageRoutes)

connectDB()
server.listen(5001,() => {
    console.log("SERVER VERSION 2.0 - READY")
})

