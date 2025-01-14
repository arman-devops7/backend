import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

// Derive the equivalent of `__dirname` for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, "../public/temp"); // Define the upload directory
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true }); // Create directory if it doesn't exist
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Generate unique filenames
  },
});

export const upload = multer({ storage });
