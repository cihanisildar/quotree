import express from "express";
import bodyParser from "body-parser";
import { envConfig } from "./shared/config/envConfig.ts";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/userRoutes.ts";
import authRoutes from "./routes/authRoutes.ts";
import quoteRoutes from "./routes/quoteRoutes.ts";
import folderRoute from "./routes/folderRoutes.ts";

// Initialize the Express app
const app = express();

// Middleware
app.use(cookieParser()); // Move this before CORS
app.use(bodyParser.json());
app.use(express.json());

// CORS configuration
app.use(
  cors({
    origin: "http://localhost:3000", // Replace with your frontend's origin
    credentials: true, // Allow credentials (cookies) to be sent
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Specify allowed methods
    allowedHeaders: ["Content-Type", "Authorization"], // Specify allowed headers
  })
);

// Define routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/quotes", quoteRoutes);
app.use("/api/folders", folderRoute);

// Error handling middleware (uncomment and implement)
// app.use(errorHandler);

// Start the server
const PORT = envConfig.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
