import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

const corsOptions = {
  origin: process.env.CORS_ORIGIN,
  credentials: true
}
app.use(cors(corsOptions));
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public")); // to store public assets
app.use(cookieParser()); // to access cookies of user browser in our server
import userRouter from "./routes/user.routes.js";

// routes
// routes decalration
app.use("/api/v1/users", userRouter) //http://localhost:3000/api/v1/users

export { app }