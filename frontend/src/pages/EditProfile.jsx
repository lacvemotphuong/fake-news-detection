import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { api } from "../services/api";

export default function EditProfile() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const data = await api.getProfile();
      setUsername(data.username);
      setEmail(data.email);
    } catch (err) {
      console.error("Không tải được profile", err);
      setError("Không thể tải thông tin người dùng");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validate
    if (!username.trim()) {
      setError("Vui lòng nhập tên người dùng");
      setLoading(false);
      return;
    }

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

    try {
      await api.updateProfile({
        username: username.trim(),
        email: email.trim()
      });

      // Show success message
      const successMessage = document.createElement("div");
      successMessage.className = "fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50";
      successMessage.innerText = "✅ Cập nhật thành công!";
      document.body.appendChild(successMessage);
      setTimeout(() => successMessage.remove(), 3000);

      navigate("/profile");
    } catch (err) {
      setError(err.message || "Cập nhật thất bại, vui lòng thử lại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f0ebe2] py-6 md:py-10 flex items-center justify-center">
      <div className="w-full max-w-xl px-4">
        
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate("/profile")}
          className="mb-4 px-5 py-2 bg-[#f0ebe2] text-[#5c4b3a] rounded-xl shadow-[6px_6px_12px_#cdc4b8,_-6px_-6px_12px_#fffff0] hover:shadow-[inset_6px_6px_12px_#cdc4b8,_inset_-6px_-6px_12px_#fffff0] transition-all duration-200 font-medium flex items-center gap-2 w-fit"
        >
          <span>←</span> Quay lại
        </motion.button>

        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-[#f0ebe2] rounded-2xl shadow-[20px_20px_40px_#cdc4b8,_-20px_-20px_40px_#fffff0] overflow-hidden"
        >
          <div className="p-6 md:p-8">
            
            {/* Header */}
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-[#f0ebe2] rounded-xl shadow-[4px_4px_8px_#cdc4b8,_-4px_-4px_8px_#fffff0] flex items-center justify-center text-xl">
                  ✏️
                </div>
                <h2 className="text-2xl font-bold text-[#5c4b3a]">
                  Cập nhật thông tin
                </h2>
              </div>
              <div className="h-0.5 w-16 bg-[#cdc4b8] rounded-full"></div>
              <p className="text-[#7e6b58] text-sm mt-3">
                Cập nhật thông tin cá nhân của bạn
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mb-4 p-3 bg-[#f0ebe2] rounded-xl shadow-[inset_5px_5px_10px_#cdc4b8,_inset_-5px_-5px_10px_#fffff0]"
              >
                <p className="text-[#b85c4a] text-sm flex items-center gap-2">
                  <span>⚠️</span> {error}
                </p>
              </motion.div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Username Field */}
              <div>
                <label className="block text-[#5c4b3a] font-medium mb-2 text-sm">
                  Tên người dùng
                </label>
                <div className="bg-[#f0ebe2] rounded-xl shadow-[inset_5px_5px_10px_#cdc4b8,_inset_-5px_-5px_10px_#fffff0]">
                  <input
                    type="text"
                    className="w-full bg-transparent p-3 rounded-xl focus:outline-none text-[#5c4b3a] placeholder-[#9b8a78]"
                    placeholder="Nhập tên người dùng"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-[#5c4b3a] font-medium mb-2 text-sm">
                  Địa chỉ email
                </label>
                <div className="bg-[#f0ebe2] rounded-xl shadow-[inset_5px_5px_10px_#cdc4b8,_inset_-5px_-5px_10px_#fffff0]">
                  <input
                    type="email"
                    className="w-full bg-transparent p-3 rounded-xl focus:outline-none text-[#5c4b3a] placeholder-[#9b8a78]"
                    placeholder="example@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={loading}
                  className={`flex-1 px-6 py-2 rounded-xl font-medium transition-all ${
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
                      Đang lưu...
                    </span>
                  ) : (
                    "💾 Lưu thay đổi"
                  )}
                </motion.button>

                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate("/profile")}
                  className="flex-1 px-6 py-2 bg-[#f0ebe2] text-[#7e6b58] rounded-xl shadow-[6px_6px_12px_#cdc4b8,_-6px_-6px_12px_#fffff0] hover:shadow-[inset_6px_6px_12px_#cdc4b8,_inset_-6px_-6px_12px_#fffff0] transition-all duration-200 font-medium"
                >
                  ❌ Hủy
                </motion.button>
              </div>
            </form>

            {/* Info Note */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-6 p-3 bg-[#f0ebe2] rounded-xl shadow-[inset_3px_3px_6px_#cdc4b8,_inset_-3px_-3px_6px_#fffff0]"
            >
              <p className="text-[#7e6b58] text-xs text-center">
                💡 Thông tin sẽ được cập nhật ngay sau khi lưu
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}