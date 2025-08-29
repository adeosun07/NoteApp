import express from "express";
import dotenv from "dotenv";
import cors from "cors";


const app = express();
const corsOptions = {
  origin: 'http://localhost:5173', // Only allow requests from your frontend
};

app.use(cors(corsOptions));
const PORT = process.env.PORT || 4000;
dotenv.config();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

import authRoute from "./routes/authentication.js"

app.use("/api/auth", authRoute)

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});