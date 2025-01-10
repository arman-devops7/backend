import { configDotenv } from "dotenv";
import connectDB from "./db/index.js";
configDotenv({ path: "./.env" }); //load in the first file

connectDB();