import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

export default function CreateProject() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await axios.post(
        "http://localhost:5001/api/projects/create",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create project");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full bg-gray-900 rounded-3xl border border-gray-800 p-8 shadow-2xl">
        <div className="mb-10">
          <Link to="/dashboard" className="text-blue-500 text-sm font-medium hover:text-blue-400 flex items-center gap-1 mb-4">
             Back to Dashboard
          </Link>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Post a New Project</h1>
          <p className="text-gray-400 mt-2">Describe what you need, and start receiving bids from top freelancers.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/50 text-red-500 rounded-xl text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">Project Title</label>
            <input
              type="text"
              name="title"
              required
              className="w-full px-5 py-4 bg-gray-800 border border-gray-700 text-white rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              placeholder="e.g. Build a modern E-commerce website"
              value={formData.title}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">Description</label>
            <textarea
              name="description"
              required
              rows={6}
              className="w-full px-5 py-4 bg-gray-800 border border-gray-700 text-white rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
              placeholder="Provide a detailed description of your requirements, expected outcomes, and any specific technologies needed."
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 px-6 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl transition-all shadow-xl shadow-blue-500/20 active:scale-95 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? "Posting Project..." : "Launch Project"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
