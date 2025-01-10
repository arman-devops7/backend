import { configDotenv } from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js";
configDotenv({ path: "./.env" }); //load in the first file

const port = process.env.PORT || 8000;

connectDB()
  .then(() => {
    app.listen(port || 8000, () => {
      console.log(`Server is running at ${port}`);
    })
  })
  .catch((error) => {
    console.log("Mongo db connection failed!!", error);
  })