import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./modules/auth/auth.routes.js";
import projectRoutes from "./modules/projects/project.routes.js";
import bidRoutes from "./modules/projects/bid.routes.js";
import escrowRoutes from "./modules/escrow/escrow.routes.js"
import kycRoutes from "./modules/kyc/kyc.routes.js";
import disputeRoutes from "./modules/dispute/dispute.routes.js";
import milestoneRoutes from "./modules/milestone/milestone.routes.js"
import proposalRoutes from "./modules/proposals/proposal.routes.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5001;

app.use(cors({
  origin: true, // Allow all origins for dev flexibility
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  next();
});


app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/bids", bidRoutes);
app.use("/api/escrow", escrowRoutes);
app.use("/api/kyc", kycRoutes);
app.use("/api/dispute", disputeRoutes);
app.use("/api/milestone", milestoneRoutes);
app.use("/api/proposal", proposalRoutes);


app.get('/', (req, res) => {
  res.send('FreelanceGuard API is running...');
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("GLOBAL ERROR:", err);
  res.status(err.status || 500).json({
    message: err.message || "An unexpected server error occurred",
    error: err.name || "InternalError"
  });
});

const server = app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
}).on('error', (err) => {
  console.error('FATAL: Server failed to start:', err);
});
