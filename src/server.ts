import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import patientRoutes from "../routes/patientRoutes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use("/api/patients", patientRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
