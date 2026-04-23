import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./modules/auth/auth.routes.js";
import projectRoutes from "./modules/projects/project.routes.js";
import bidRoutes from "./modules/projects/bid.routes.js";
import escrowRoutes from "./modules/escrow/escrow.routes.js"

dotenv.config();

const app = express();
const port = process.env.PORT || 5001;

app.use(cors({
  origin: true, // Allow all origins for dev flexibility
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  next();
});


app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/bids", bidRoutes);
app.use("/api/escrow", escrowRoutes);


app.get('/', (req, res) => {
  res.send('FreelanceGuard API is running...');
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
