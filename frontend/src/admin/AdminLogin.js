import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const navigate = useNavigate();

  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (field) => (e) => {
    setCredentials((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");

    if (
      credentials.username === "ghufran16" &&
      credentials.password === "123456"
    ) {
      localStorage.setItem("isAdminAuthenticated", "true");
      navigate("/admin");
    } else {
      setError("Invalid username or password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-slate-900 via-purple-900 to-pink-600">

      {/* BACKGROUND GLOW */}
      <div className="absolute w-96 h-96 bg-pink-500 rounded-full blur-3xl opacity-30 top-10 left-10"></div>
      <div className="absolute w-96 h-96 bg-purple-500 rounded-full blur-3xl opacity-30 bottom-10 right-10"></div>

      {/* CARD */}
      <div className="relative w-full max-w-md bg-white/10 backdrop-blur-2xl border border-white/20 shadow-2xl rounded-3xl p-8">

        {/* TITLE */}
        <h2 className="text-3xl font-extrabold text-white text-center">
          Admin Login 🔐
        </h2>

        <p className="text-center text-white/70 text-sm mt-2 mb-6">
          Access your dashboard securely
        </p>

        {/* ERROR */}
        {error && (
          <div className="mb-4 bg-red-500/20 border border-red-400 text-red-100 text-sm px-3 py-2 rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">

          {/* USERNAME */}
          <div>
            <label className="text-white/80 text-sm">Username</label>
            <input
              type="text"
              value={credentials.username}
              onChange={handleChange("username")}
              placeholder="Enter username"
              className="w-full mt-1 px-4 py-3 rounded-xl bg-white/10 text-white placeholder-white/50 border border-white/20 outline-none focus:ring-2 focus:ring-pink-400"
            />
          </div>

          {/* PASSWORD */}
          <div>
            <label className="text-white/80 text-sm">Password</label>
            <input
              type="password"
              value={credentials.password}
              onChange={handleChange("password")}
              placeholder="Enter password"
              className="w-full mt-1 px-4 py-3 rounded-xl bg-white/10 text-white placeholder-white/50 border border-white/20 outline-none focus:ring-2 focus:ring-pink-400"
            />
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-500 to-orange-400 text-white font-bold shadow-lg hover:scale-105 transition"
          >
            Login to Dashboard
          </button>

        </form>

      </div>

    </div>
  );
}