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
import supportRoutes from "./modules/support/support.routes.js"
import chatRoutes from "./modules/chat/chat.routes.js";


dotenv.config();

const app = express();
const port = process.env.PORT || 5001;

app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/bids", bidRoutes);
app.use("/api/escrow", escrowRoutes);
app.use("/api/kyc", kycRoutes);
app.use("/api/dispute", disputeRoutes);
app.use("/api/milestone", milestoneRoutes);
app.use("/api/proposal", proposalRoutes);
app.use("/api/support", supportRoutes);
app.use("/api/chat", chatRoutes);

app.get('/', (req, res) => {
  res.send('FreelanceGuard API is running...');
});

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    message: "An unexpected server error occurred"
  });
});

const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
