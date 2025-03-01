import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import cors from "cors";
import { connectToSocket } from "./controllers/socketManager.js";
import userRoutes from "./routes/userRoutes.js";

const app = express();
const server = createServer(app);

// Correcting Socket.io Connection
const io = connectToSocket(server); // Ensure this function is correctly implemented

app.set("port", process.env.PORT || 8000);

// Apply CORS middleware
app.use(cors());

app.use(express.json({ limit: "40kb" }));
app.use(express.urlencoded({ limit: "40kb", extended: true }));

app.use("/api/v1/users", userRoutes);

// MongoDB Connection
const start = async () => {
    try {
        const connectionDb = await mongoose.connect(
            "mongodb+srv://subhanshukumar290:Shubh@zoom.mqf09.mongodb.net/?retryWrites=true&w=majority&appName=Zoom",
            {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            }
        );

        console.log(`MongoDB Connected: ${connectionDb.connection.host}`);

        server.listen(app.get("port"), () => {
            console.log(`Listening on port ${app.get("port")}`);
        });

    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        process.exit(1);
    }
};

start();
