import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validate
    if (!email.trim()) {
      setError("Vui lòng nhập email");
      setLoading(false);
      return;
    }

    if (!email.includes("@") || !email.includes(".")) {
      setError("Email không hợp lệ");
      setLoading(false);
      return;
    }

    if (!password) {
      setError("Vui lòng nhập mật khẩu");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Đăng nhập thất bại");
      }

      // Lưu token và user info
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      
      // Trigger storage event for other tabs
      window.dispatchEvent(new StorageEvent("storage", {
        key: "user",
        newValue: JSON.stringify(data.user)
      }));

      // Show success message
      const successMessage = document.createElement("div");
      successMessage.className = "fixed top-4 right-4 bg-[#5c8b6e] text-white px-4 py-2 rounded-lg shadow-lg z-50";
      successMessage.innerText = "Đăng nhập thành công!";
      document.body.appendChild(successMessage);
      setTimeout(() => successMessage.remove(), 2000);

      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f0ebe2] flex items-center justify-center px-4 py-6 md:py-10">
      <div className="w-full max-w-md">
        
        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-[#f0ebe2] rounded-2xl shadow-[20px_20px_40px_#cdc4b8,_-20px_-20px_40px_#fffff0] overflow-hidden"
        >
          <div className="p-6 md:p-8">
            
            {/* Header */}
            <div className="text-center mb-6">
              <div className="inline-block p-3 bg-[#f0ebe2] rounded-xl shadow-[4px_4px_8px_#cdc4b8,_-4px_-4px_8px_#fffff0] mb-3">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-[#5c4b3a]">
                  <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM9 6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9V6zm3 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/>
                </svg>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-[#5c4b3a]">
                Đăng nhập
              </h2>
              <div className="h-0.5 w-12 mx-auto bg-[#cdc4b8] rounded-full mt-2"></div>
              <p className="text-[#7e6b58] text-sm mt-3">
                Chào mừng bạn trở lại
              </p>
            </div>

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-4 p-3 bg-[#f0ebe2] rounded-xl shadow-[inset_5px_5px_10px_#cdc4b8,_inset_-5px_-5px_10px_#fffff0]"
                >
                  <p className="text-[#b85c4a] text-sm flex items-center gap-2">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                      <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>
                    </svg> {error}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-5">
              
              {/* Email Field */}
              <div>
                <label className="block text-[#5c4b3a] font-medium mb-2 text-sm">
                  Email
                </label>
                <div className="bg-[#f0ebe2] rounded-xl shadow-[inset_5px_5px_10px_#cdc4b8,_inset_-5px_-5px_10px_#fffff0]">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full bg-transparent p-3 rounded-xl focus:outline-none text-[#5c4b3a] placeholder-[#9b8a78]"
                    placeholder="example@gmail.com"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-[#5c4b3a] font-medium mb-2 text-sm">
                  Mật khẩu
                </label>
                <div className="relative bg-[#f0ebe2] rounded-xl shadow-[inset_5px_5px_10px_#cdc4b8,_inset_-5px_-5px_10px_#fffff0]">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full bg-transparent p-3 rounded-xl focus:outline-none text-[#5c4b3a] placeholder-[#9b8a78] pr-10"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#7e6b58] hover:text-[#5c4b3a] transition-colors"
                  >
                    {showPassword ? (
                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                        <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                      </svg>
                    ) : (
                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                        <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92 1.11-1.11c1.73-4.39 6-7.5 11-7.5-1.55 0-2.91.43-4.07 1.17L16.17 9.9C15.74 9.32 14.91 9 14 9c-2.76 0-5 2.24-5 5 0 .91.32 1.74.9 2.17l-2.92-2.92C7.13 13.26 7 12.65 7 12c0-2.76 2.24-5 5-5zM2.81 2.81L1.39 4.22l2.27 2.27C2.61 7.08 2 9.3 2 12c0 2.7.67 5.17 1.84 7.38l1.11-1.11c-1.03-1.89-1.64-4.07-1.64-6.27 0-2.2.61-4.38 1.64-6.27L2.81 2.81zM12 17c-2.76 0-5-2.24-5-5 0-.65.13-1.26.36-1.83l2.92 2.92c.44.58 1.27.9 2.17.9 1.66 0 3-1.34 3-3 0-.91-.32-1.74-.9-2.17l2.92 2.92C16.87 10.74 17 11.35 17 12c0 2.76-2.24 5-5 5z"/>
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Forgot Password Link */}
              <div className="text-right">
                <button
                  type="button"
                  onClick={() => alert("Chức năng đang phát triển")}
                  className="text-[#7e6b58] text-xs hover:text-[#5c4b3a] transition-colors"
                >
                  Quên mật khẩu?
                </button>
              </div>

              {/* Login Button */}
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={loading}
                className={`w-full py-3 rounded-xl font-semibold transition-all mt-4 ${
                  loading
                    ? "bg-[#e0d8ce] text-[#9b8a78] shadow-[inset_3px_3px_6px_#cdc4b8,_inset_-3px_-3px_6px_#fffff0] cursor-not-allowed"
                    : "bg-[#f0ebe2] text-[#5c4b3a] shadow-[6px_6px_12px_#cdc4b8,_-6px_-6px_12px_#fffff0] hover:shadow-[inset_6px_6px_12px_#cdc4b8,_inset_-6px_-6px_12px_#fffff0]"
                }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Đang đăng nhập...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                      <path d="M12.65 10C11.83 7.67 9.61 6 7 6c-3.31 0-6 2.69-6 6s2.69 6 6 6c2.61 0 4.83-1.67 5.65-4H17v4h4v-4h2v-4H12.65zM7 14c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/>
                    </svg>
                    Đăng nhập
                  </span>
                )}
              </motion.button>
            </form>


            {/* Register Link */}
            <div className="text-center mt-6">
              <p className="text-[#7e6b58] text-sm">
                Chưa có tài khoản?{" "}
                <Link
                  to="/register"
                  className="text-[#5c4b3a] font-semibold hover:underline"
                >
                  Đăng ký ngay
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}