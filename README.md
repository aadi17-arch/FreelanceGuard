# FreelanceGuard

FreelanceGuard is a robust, fullstack freelance management platform designed to secure project agreements and automate milestone-based payments. Built with React (Vite), Express.js, and Prisma, it features a comprehensive escrow-like system with integrated dispute resolution and real-time project tracking.

A robust fullstack monorepo for managing freelance projects and payments.

## Tech Stack
-   **Client**: Vite, React, Tailwind CSS, Axios, React Router DOM, Recharts.
-   **Server**: Node.js, Express, Prisma, @prisma/client, bcryptjs, jsonwebtoken, cors, dotenv, nodemailer, multer.
-   **Database**: Managed via Prisma (PostgreSQL/MySQL/etc.).

## Setup Instructions

### Prerequisites
-   Node.js (v16+)
-   npm or yarn
-   A PostgreSQL or MySQL database (for Prisma)

### Installation
1.  Clone the repository.
2.  Install server dependencies:
    ```bash
    cd server
    npm install
    ```
3.  Install client dependencies:
    ```bash
    cd client
    npm install
    ```

### Configuration
1.  Create a `.env` file in the `server/` directory:
    ```env
    DATABASE_URL="your_database_url"
    JWT_SECRET="your_jwt_secret"
    PORT=5000
    ```

### Running the Application
1.  Start the server:
    ```bash
    cd server
    npm run dev
    ```
2.  Start the client:
    ```bash
    cd client
    npm run dev
    ```
