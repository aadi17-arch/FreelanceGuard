import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center px-4">
      <div className="max-w-4xl text-center space-y-8">
        <h1 className="text-6xl md:text-7xl font-extrabold tracking-tighter bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">
          FreelanceGuard
        </h1>
        <p className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
          The ultimate platform for secure freelance collaboration, powered by next-gen trust management.
        </p>
        <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
          <Link
            to="/register"
            className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl transition-all shadow-xl shadow-blue-500/20 w-full md:w-auto"
          >
            Start Protecting Now
          </Link>
          <Link
            to="/login"
            className="px-8 py-4 bg-gray-900 hover:bg-gray-800 text-white font-bold rounded-2xl border border-gray-800 transition-all w-full md:w-auto"
          >
            Sign In
          </Link>
        </div>
      </div>
      <footer className="mt-20 text-gray-600 text-sm">
        &copy; 2026 FreelanceGuard. All rights reserved.
      </footer>
    </div>
  );
}
