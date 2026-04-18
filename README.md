# 🛡️ FreelanceGuard
### *Secure Protocols. Guaranteed Payments. Cinematic Excellence.*

[![Project Status](https://img.shields.io/badge/Status-Operational-00a87e?style=for-the-badge&logo=shield-halved)](https://github.com/aadi17-arch/FreelanceGuard)
[![Tech](https://img.shields.io/badge/Frontend-React_19-494fdf?style=for-the-badge&logo=react)](https://react.dev/)
[![Security](https://img.shields.io/badge/Security-Escrow_Verified-e23b4a?style=for-the-badge&logo=lock)](https://github.com/aadi17-arch/FreelanceGuard)

---

## 💎 The Vision
**FreelanceGuard** is not just a management tool; it's a high-stakes protocol for the modern freelancer. Designed with a **Cinematic Glassmorphism UI**, it provides a stunning, atmospheric experience while ensuring that every contract is backed by a robust, server-side escrow transaction system.

### ✨ Key Features
- **Escrow Guard Protocol**: Funds are locked the moment a bid is accepted, ensuring freelancers are paid for every milestone.
- **Atmospheric Dashboard**: A premium, motion-heavy interface that treats project management as a mission control center.
- **Secure Bid Workflow**: Transparent bidding system with real-time status tracking (Pending → Accepted → In Progress).
- **Prisma-Powered Integrity**: Database transactions ensure that balance updates and contract creation are atomic and fail-safe.

---

## 🛠️ Tech Stack
| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 19, Vite, Framer Motion, Tailwind CSS, Lucide Icons |
| **Backend** | Node.js, Express, Prisma ORM |
| **Database** | PostgreSQL / MySQL (Relational) |
| **Auth** | JWT Secure Session Management |

---

## 🚀 Deployment & Installation

### 1. Prerequisites
- **Node.js** (v18+)
- **PostgreSQL/MySQL** database instance

### 2. Environment Configuration
Create a `.env` in the `server/` directory:
```env
DATABASE_URL="your_database_url"
JWT_SECRET="your_secure_hash"
PORT=5001
```

### 3. Execution
**Launch Mission Control (Server):**
```bash
cd server
npm install
npx prisma generate
npm run dev
```

**Deploy Frontend (Client):**
```bash
cd client
npm install
npm run dev
```

---

## 📸 Preview
![FreelanceGuard Dashboard](/freelanceguard_dashboard_preview.png)
*Behold the atmospheric mission control for your freelance career.*

---

## 🛡️ License & Safety
Distributed under the MIT License. Built with ❤️ for the freelance elite.
