import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (!username.trim()) {
      setError("Vui lòng nhập tên");
      return;
    }

    if (username.length < 3) {
      setError("Tên phải có ít nhất 3 ký tự");
      return;
    }

    if (!email.trim()) {
      setError("Vui lòng nhập email");
      return;
    }

    if (!email.includes("@") || !email.includes(".")) {
      setError("Email không hợp lệ");
      return;
    }

    if (password.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }

    if (password !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username.trim(),
          email: email.trim(),
          password
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Đăng ký thất bại");
      }

      // Show success message
      const successMessage = document.createElement("div");
      successMessage.className = "fixed top-4 right-4 bg-[#5c8b6e] text-white px-4 py-2 rounded-lg shadow-lg z-50";
      successMessage.innerText = "✅ Đăng ký thành công! Vui lòng đăng nhập.";
      document.body.appendChild(successMessage);
      setTimeout(() => successMessage.remove(), 3000);

      navigate("/login");
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
                <span className="text-3xl">📝</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-[#5c4b3a]">
                Đăng ký tài khoản
              </h2>
              <div className="h-0.5 w-12 mx-auto bg-[#cdc4b8] rounded-full mt-2"></div>
              <p className="text-[#7e6b58] text-sm mt-3">
                Tạo tài khoản mới để bắt đầu
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
                    <span>⚠️</span> {error}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Form */}
            <form onSubmit={handleRegister} className="space-y-4">
              
              {/* Username Field */}
              <div>
                <label className="block text-[#5c4b3a] font-medium mb-2 text-sm">
                  Tên người dùng
                </label>
                <div className="bg-[#f0ebe2] rounded-xl shadow-[inset_5px_5px_10px_#cdc4b8,_inset_-5px_-5px_10px_#fffff0]">
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="w-full bg-transparent p-3 rounded-xl focus:outline-none text-[#5c4b3a] placeholder-[#9b8a78]"
                    placeholder="Nguyễn Văn A"
                  />
                </div>
                {username && username.length < 3 && (
                  <p className="text-[#b85c4a] text-xs mt-1">
                    Tên phải có ít nhất 3 ký tự
                  </p>
                )}
              </div>

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
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#7e6b58]"
                  >
                    {showPassword ? "👁️" : "👁️‍🗨️"}
                  </button>
                </div>
                {password && password.length < 6 && (
                  <p className="text-[#b85c4a] text-xs mt-1">
                    Mật khẩu phải có ít nhất 6 ký tự
                  </p>
                )}
                {password && password.length >= 6 && (
                  <p className="text-[#5c8b6e] text-xs mt-1 flex items-center gap-1">
                    <span>✓</span> Mật khẩu hợp lệ
                  </p>
                )}
              </div>

              {/* Confirm Password Field */}
              <div>
                <label className="block text-[#5c4b3a] font-medium mb-2 text-sm">
                  Xác nhận mật khẩu
                </label>
                <div className="relative bg-[#f0ebe2] rounded-xl shadow-[inset_5px_5px_10px_#cdc4b8,_inset_-5px_-5px_10px_#fffff0]">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="w-full bg-transparent p-3 rounded-xl focus:outline-none text-[#5c4b3a] placeholder-[#9b8a78] pr-10"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#7e6b58]"
                  >
                    {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
                  </button>
                </div>
                {confirmPassword && password !== confirmPassword && (
                  <p className="text-[#b85c4a] text-xs mt-1">
                    Mật khẩu xác nhận không khớp
                  </p>
                )}
                {confirmPassword && password === confirmPassword && password.length >= 6 && (
                  <p className="text-[#5c8b6e] text-xs mt-1 flex items-center gap-1">
                    <span>✓</span> Mật khẩu xác nhận chính xác
                  </p>
                )}
              </div>

              {/* Register Button */}
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
                    Đang đăng ký...
                  </span>
                ) : (
                  "📝 Đăng ký"
                )}
              </motion.button>
            </form>

            {/* Login Link */}
            <div className="text-center mt-6">
              <p className="text-[#7e6b58] text-sm">
                Đã có tài khoản?{" "}
                <Link
                  to="/login"
                  className="text-[#5c4b3a] font-semibold hover:underline"
                >
                  Đăng nhập ngay
                </Link>
              </p>
            </div>

            {/* Terms */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-4 p-2 bg-[#f0ebe2] rounded-lg shadow-[inset_3px_3px_6px_#cdc4b8,_inset_-3px_-3px_6px_#fffff0]"
            >
              <p className="text-[#7e6b58] text-xs text-center">
                Bằng việc đăng ký, bạn đồng ý với{" "}
                <span className="font-medium">Điều khoản sử dụng</span> và{" "}
                <span className="font-medium">Chính sách bảo mật</span>
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}