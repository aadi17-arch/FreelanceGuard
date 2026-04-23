# 🎓 FreelanceGuard: Full-Stack Interview Preparation Guide

This guide contains the core technical documentation and concepts used in this project. Study these to explain the "How" and "Why" behind your code during interviews.

---

### ⚛️ Frontend Layer (React + Tailwind)
*   **[React.dev (Beta Docs)](https://react.dev/learn):** Focus on **Hooks** (`useState`, `useEffect`) and the **Context API**.
    *   *Concept to Know:* "Prop Drilling" and how the `AuthContext` solves it by providing global state.
*   **[Tailwind CSS Fundamentals](https://tailwindcss.com/docs/utility-first):** Focus on "Utility-first CSS".
    *   *Concept to Know:* Why use Tailwind? (Consistency, speed, smaller bundle sizes, responsive design).
*   **[Framer Motion](https://www.framer.com/motion/):** Used for cinematic dashboard animations.

### ⚙️ Backend Layer (Node.js + Express)
*   **[Express.js Routing & Middleware](https://expressjs.com/en/guide/routing.html):** 
    *   *Concept to Know:* **Middleware Pattern.** Explain how our `protect` middleware intercepts requests to verify JWT tokens before they reach the controller.
*   **[Node.js Event Loop](https://nodejs.org/en/docs/guides/event-loop-timers-and-nexttick/):**
    *   *Concept to Know:* Why Node? (Single-threaded, non-blocking I/O, perfect for high-concurrency apps like marketplaces).

### 🗄️ Database & Security (Prisma + PostgreSQL + JWT)
*   **[Prisma: Transactions](https://www.prisma.io/docs/concepts/components/prisma-client/transactions):** **CRITICAL STUDY TOPIC.**
    *   *Concept to Know:* **Atomic Operations.** Explain that in the Escrow system, we move money from Client to Freelancer in a single transaction so that if one step fails, the entire operation rolls back (No money is lost).
*   **[JSON Web Tokens (JWT.io)](https://jwt.io/introduction):**
    *   *Concept to Know:* **Stateless Authentication.** Explain that the server doesn't store session data; it trusts the encrypted signature in the token's payload.
*   **[HTTP Status Codes (MDN)](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status):** 
    *   *Concept to Know:* 200 (Success), 201 (Created), 401 (Unauth), 403 (Forbidden), 404 (Not Found), 500 (Server Error).

---

### 🎙️ The "Elevator Pitch" for this Project
> "I built **FreelanceGuard**, a secure freelance marketplace. The core feature is a custom **Escrow Protocol** I developed using **Node.js** and **Prisma**. I implemented **Atomic Database Transactions** to handle financial movements between Clients and Freelancers, ensuring 100% data integrity. The frontend is built with **React** and **Tailwind CSS**, utilizing a **Domain-Driven Architecture** to keep the codebase scalable and clean."

---

### 🚀 Future Skills (Next Targets)
*   **Cloudinary/S3:** For handling file and image uploads.
*   **jsPDF:** For generating downloadable PDF invoices.
*   **Recharts:** For showing financial reporting and data visualization.
