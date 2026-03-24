import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "../services/api";

export default function UserProfile({ onViewHistory }) {
  const [user, setUser] = useState(null);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
    fetchRecentHistory();
  }, []);

  const fetchProfile = async () => {
    try {
      const data = await api.getProfile();
      setUser(data);
    } catch (err) {
      console.log("Không tải được profile", err);
      setError("Không thể tải thông tin cá nhân");
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentHistory = async () => {
    try {
      const data = await api.getHistory();
      setRecent(data.slice(0, 5));
    } catch (err) {
      console.log("Không tải được history", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const formatTime = (isoDate) => {
    if (!isoDate) return "Không xác định";
    const date = new Date(isoDate);
    const now = new Date();
    const diffMs = now - date;
    const diffMin = Math.floor(diffMs / 60000);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    if (diffMin < 1) return "Vừa xong";
    if (diffMin < 60) return `${diffMin} phút trước`;
    if (diffHour < 24) return `${diffHour} giờ trước`;
    if (diffDay < 7) return `${diffDay} ngày trước`;
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f0ebe2] flex items-center justify-center">
        <div className="bg-[#f0ebe2] rounded-2xl shadow-[20px_20px_40px_#cdc4b8,_-20px_-20px_40px_#fffff0] p-8 text-center">
          <div className="inline-block">
            <div className="w-12 h-12 bg-[#f0ebe2] rounded-2xl shadow-[inset_5px_5px_10px_#cdc4b8,_inset_-5px_-5px_10px_#fffff0] flex items-center justify-center">
              <svg className="animate-spin h-6 w-6 text-[#5c4b3a]" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            </div>
          </div>
          <p className="mt-4 text-[#7e6b58]">Đang tải thông tin...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#f0ebe2] flex items-center justify-center">
        <div className="bg-[#f0ebe2] rounded-2xl shadow-[20px_20px_40px_#cdc4b8,_-20px_-20px_40px_#fffff0] p-8 text-center">
          <div className="inline-block p-3 bg-[#f0ebe2] rounded-xl shadow-[inset_5px_5px_10px_#cdc4b8,_inset_-5px_-5px_10px_#fffff0] mb-3">
            <span className="text-3xl">⚠️</span>
          </div>
          <p className="text-[#b85c4a] font-medium mb-4">{error}</p>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={fetchProfile}
            className="px-6 py-2 bg-[#f0ebe2] text-[#5c4b3a] rounded-xl shadow-[6px_6px_12px_#cdc4b8,_-6px_-6px_12px_#fffff0] hover:shadow-[inset_6px_6px_12px_#cdc4b8,_inset_-6px_-6px_12px_#fffff0] transition-all duration-200 font-medium"
          >
            🔄 Thử lại
          </motion.button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f0ebe2] py-6 md:py-10">
      <div className="max-w-6xl mx-auto px-4">
        
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate("/")}
          className="mb-6 px-5 py-2 bg-[#f0ebe2] text-[#5c4b3a] rounded-xl shadow-[6px_6px_12px_#cdc4b8,_-6px_-6px_12px_#fffff0] hover:shadow-[inset_6px_6px_12px_#cdc4b8,_inset_-6px_-6px_12px_#fffff0] transition-all duration-200 font-medium flex items-center gap-2 w-fit"
        >
          <span>←</span> Quay lại
        </motion.button>

        {/* Header Card */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-[#f0ebe2] rounded-2xl shadow-[20px_20px_40px_#cdc4b8,_-20px_-20px_40px_#fffff0] p-6 mb-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-[#f0ebe2] rounded-2xl shadow-[6px_6px_12px_#cdc4b8,_-6px_-6px_12px_#fffff0] flex items-center justify-center text-3xl">
                👤
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-[#5c4b3a]">
                  {user.username}
                </h2>
                <div className="h-0.5 w-12 bg-[#cdc4b8] rounded-full mt-1"></div>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/edit-profile")}
              className="px-5 py-2 bg-[#f0ebe2] text-[#5c4b3a] rounded-xl shadow-[6px_6px_12px_#cdc4b8,_-6px_-6px_12px_#fffff0] hover:shadow-[inset_6px_6px_12px_#cdc4b8,_inset_-6px_-6px_12px_#fffff0] transition-all duration-200 font-medium flex items-center gap-2"
            >
              ✏️ Cập nhật thông tin
            </motion.button>
          </div>
        </motion.div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          
          {/* Profile Info Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-[#f0ebe2] rounded-2xl shadow-[20px_20px_40px_#cdc4b8,_-20px_-20px_40px_#fffff0] p-6"
          >
            <h3 className="text-lg font-bold text-[#5c4b3a] mb-4 flex items-center gap-2">
              <span>📋</span>
              Thông tin cá nhân
            </h3>
            <div className="space-y-3">
              <div className="bg-[#f0ebe2] rounded-xl p-3 shadow-[inset_4px_4px_8px_#cdc4b8,_inset_-4px_-4px_8px_#fffff0]">
                <p className="text-[#7e6b58] text-xs mb-1">Họ tên</p>
                <p className="text-[#5c4b3a] font-medium">{user.username}</p>
              </div>
              <div className="bg-[#f0ebe2] rounded-xl p-3 shadow-[inset_4px_4px_8px_#cdc4b8,_inset_-4px_-4px_8px_#fffff0]">
                <p className="text-[#7e6b58] text-xs mb-1">Email</p>
                <p className="text-[#5c4b3a] font-medium">{user.email}</p>
              </div>
              <div className="bg-[#f0ebe2] rounded-xl p-3 shadow-[inset_4px_4px_8px_#cdc4b8,_inset_-4px_-4px_8px_#fffff0]">
                <p className="text-[#7e6b58] text-xs mb-1">Ngày tham gia</p>
                <p className="text-[#5c4b3a] font-medium">
                  {user.createdAt
                    ? new Date(user.createdAt).toLocaleDateString("vi-VN", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })
                    : "Không có dữ liệu"}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Recent Activity Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-[#f0ebe2] rounded-2xl shadow-[20px_20px_40px_#cdc4b8,_-20px_-20px_40px_#fffff0] p-6"
          >
            <h3 className="text-lg font-bold text-[#5c4b3a] mb-4 flex items-center gap-2">
              <span>🕐</span>
              Hoạt động gần đây
            </h3>
            
            {recent.length === 0 ? (
              <div className="bg-[#f0ebe2] rounded-xl p-4 shadow-[inset_4px_4px_8px_#cdc4b8,_inset_-4px_-4px_8px_#fffff0] text-center">
                <span className="text-3xl">📭</span>
                <p className="text-[#7e6b58] text-sm mt-2">Chưa có lịch sử</p>
              </div>
            ) : (
              <div className="space-y-2">
                {recent.map((item, index) => (
                  <motion.div
                    key={item._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-[#f0ebe2] rounded-xl p-3 shadow-[inset_3px_3px_6px_#cdc4b8,_inset_-3px_-3px_6px_#fffff0]"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm">🔍</span>
                        <p className="text-[#5c4b3a] text-sm">Kiểm tra tin tức</p>
                      </div>
                      <span className="text-[#7e6b58] text-xs">
                        {formatTime(item.createdAt)}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/history")}
              className="mt-4 w-full px-4 py-2 bg-[#f0ebe2] text-[#5c4b3a] rounded-xl shadow-[6px_6px_12px_#cdc4b8,_-6px_-6px_12px_#fffff0] hover:shadow-[inset_6px_6px_12px_#cdc4b8,_inset_-6px_-6px_12px_#fffff0] transition-all duration-200 font-medium flex items-center justify-center gap-2"
            >
              📜 Xem tất cả lịch sử
            </motion.button>
          </motion.div>
        </div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate("/change-password")}
            className="px-6 py-2 bg-[#f0ebe2] text-[#5c4b3a] rounded-xl shadow-[6px_6px_12px_#cdc4b8,_-6px_-6px_12px_#fffff0] hover:shadow-[inset_6px_6px_12px_#cdc4b8,_inset_-6px_-6px_12px_#fffff0] transition-all duration-200 font-medium flex items-center justify-center gap-2"
          >
            🔒 Đổi mật khẩu
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleLogout}
            className="px-6 py-2 bg-[#f0ebe2] text-[#b85c4a] rounded-xl shadow-[6px_6px_12px_#cdc4b8,_-6px_-6px_12px_#fffff0] hover:shadow-[inset_6px_6px_12px_#cdc4b8,_inset_-6px_-6px_12px_#fffff0] transition-all duration-200 font-medium flex items-center justify-center gap-2"
          >
            🚪 Đăng xuất
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}