import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  next();
});


app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);

app.get('/', (req, res) => {
  res.send('FreelanceGuard API is running...');
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
