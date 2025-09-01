import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";

dotenv.config();
const app = express();

const corsOptions = {
  origin: process.env.CLIENT_URL || "*",
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve frontend build
app.use(express.static(path.join(__dirname, "public")));

// API routes
import authRoute from "./routes/authentication.js";
import notesRoute from "./routes/notes.js";

app.use("/api/auth", authRoute);
app.use("/api/notes", notesRoute);

// All other requests serve index.html
app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
