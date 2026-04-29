# 🏛️ FreelanceGuard | Institutional Escrow Network

**"Get paid securely for every freelance project."**

FreelanceGuard is a high-fidelity, banking-grade escrow and milestone management platform designed to eliminate payment uncertainty for freelancers and clients. Built with a focus on trust, security, and premium user experience.

---

## ⚡ Core Philosophy
FreelanceGuard moves beyond the "Technical Protocol" speak of early blockchain/escrow tools and delivers an **Institutional Modernist** interface. We prioritize:
- **Clarity over Complexity**: Simple, human-friendly language (Sentence Case).
- **Security by Design**: Multi-layer Zod validation and tokenized session management.
- **Visual Excellence**: A premium, zinc-based aesthetic optimized for high-conversion and trust.

---

## 🚀 Technology Stack

### Frontend (The "Skin" & "Interaction")
- **React 19**: Leveraging the latest in performance and concurrency.
- **Vite 8**: Next-generation development environment.
- **Tailwind CSS 4**: Modern, utility-first styling with zero-runtime overhead.
- **Zod**: Strict, schema-based validation for all data entry points.
- **Lucide Icons**: Clean, consistent institutional iconography.

### Backend (The "Brain" & "Vault")
- **Node.js & Express**: High-performance API architecture.
- **Prisma ORM**: Type-safe database interactions.
- **JWT**: Secure, encrypted session handling.

---

## 🛠️ Key Features (Current Implementation)

### 1. Public Marketing Hub
- **Benefit-Driven Hero**: Focused on user outcomes rather than technical specs.
- **Institutional FAQ**: Handling trust, dispute, and payment concerns for professional users.
- **Milestone Logic**: Clear 3-step visualization of the escrow protocol.

### 2. Authentication Portal (Auth Hub)
- **High-Fidelity Forms**: Clean, Sentence-Case interface for Login and Registration.
- **Real-Time Validation**: Instant feedback via Zod schemas.
- **Role-Based Onboarding**: Tactile selection for Freelancers and Clients.
- **Security Toggles**: Integrated password visibility and persistent session controls.

### 3. Operational Dashboard
- **Modular Sidebar**: Organized into Work, Finances, and Security sectors.
- **Vault Management**: Institutional ledger view for locked capital and released funds.
- **Dispute Resolution**: High-trust interface for contract conflict management.

---

## 📁 Project Structure

```text
freelanceguard/
├── client/                 # Frontend (React + Vite)
│   ├── src/
│   │   ├── components/     # Reusable UI & Layouts
│   │   ├── context/        # Auth & State Management
│   │   ├── pages/          # Auth, Public, & Dashboard Pages
│   │   └── utils/          # Validation & Helpers
└── server/                 # Backend (Node + Express + Prisma)
    ├── controllers/        # Business Logic
    ├── prisma/             # Database Schema
    └── routes/             # API Endpoints
```

---

## 🚦 Getting Started

### 1. Clone the Network
```bash
git clone https://github.com/your-username/freelanceguard.git
cd freelanceguard
```

### 2. Synchronize Nodes
**Backend:**
```bash
cd server
npm install
npx prisma generate
npm run dev
```

**Frontend:**
```bash
cd client
npm install
npm run dev
```

---

## 📼 Project Log
All UI/UX refinements and logic hardening are documented in the **`LOG.md`** file, serving as the master audit trail for the project's evolution.

**Status**: *Alpha - Auth Hub & Marketing Hub Operational.* 🏛️💼🥂
