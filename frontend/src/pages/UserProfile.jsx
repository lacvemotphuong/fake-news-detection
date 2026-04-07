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
            <svg viewBox="0 0 24 24" className="w-8 h-8 text-[#f59e0b]" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 20h20L12 2zm0 5.5c.83 0 1.5.67 1.5 1.5S12.83 10.5 12 10.5 10.5 9.83 10.5 9 11.17 7.5 12 7.5zm1 9.5h-2v-2h2v2zm0-4h-2v-4h2v4z" />
            </svg>
          </div>
          <p className="text-[#b85c4a] font-medium mb-4">{error}</p>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={fetchProfile}
            className="px-6 py-2 bg-[#f0ebe2] text-[#5c4b3a] rounded-xl shadow-[6px_6px_12px_#cdc4b8,_-6px_-6px_12px_#fffff0] hover:shadow-[inset_6px_6px_12px_#cdc4b8,_inset_-6px_-6px_12px_#fffff0] transition-all duration-200 font-medium flex items-center gap-2 justify-center"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 .74-.14 1.44-.38 2.08l1.48 1.12C19.79 13.4 20 12.72 20 12c0-4.42-3.58-8-8-8zm-6.38 4.08C4.21 10.6 4 11.28 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3c-3.31 0-6-2.69-6-6 0-.74.14-1.44.38-2.08z" />
            </svg>
            Thử lại
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
          <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
          </svg>
          Quay lại
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
              <div className="w-16 h-16 flex items-center justify-center">
                <div className="w-14 h-14 rounded-full bg-white border border-[#cdc4b8] flex items-center justify-center shadow-[inset_2px_2px_5px_rgba(0,0,0,0.12)]">
                  <svg viewBox="0 0 64 64" className="w-10 h-10 text-[#5c4b3a]" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M32 32c5.523 0 10-4.477 10-10S37.523 12 32 12s-10 4.477-10 10 4.477 10 10 10zm0 6c-8.284 0-15 6.716-15 15v1h30v-1c0-8.284-6.716-15-15-15z" />
                  </svg>
                </div>
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
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1.004 1.004 0 0 0 0-1.42l-2.34-2.34a1.004 1.004 0 0 0-1.42 0L14.13 4.59l3.75 3.75 2.83-2.3z" />
              </svg>
              Cập nhật thông tin
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
              <svg viewBox="0 0 24 24" className="w-5 h-5 text-[#5c4b3a]" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-7V3.5L18.5 9H13z" />
              </svg>
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
              <svg viewBox="0 0 24 24" className="w-5 h-5 text-[#5c4b3a]" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 20c4.41 0 8-3.59 8-8s-3.59-8-8-8-8 3.59-8 8 3.59 8 8 8zm.5-12.5h-1v5.25l4.5 2.67.5-.86-4-2.36V7.5z" />
              </svg>
              Hoạt động gần đây
            </h3>
            
            {recent.length === 0 ? (
              <div className="bg-[#f0ebe2] rounded-xl p-4 shadow-[inset_4px_4px_8px_#cdc4b8,_inset_-4px_-4px_8px_#fffff0] text-center">
                <svg viewBox="0 0 24 24" className="mx-auto mb-2 w-8 h-8 text-[#5c4b3a]" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 8h-8V4H4v16h16V8zm-2 0v10H6V6h8v4h4z" />
                </svg>
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
                        <svg viewBox="0 0 24 24" className="w-4 h-4 text-[#5c4b3a]" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                          <path d="M9.5 3A6.5 6.5 0 1 0 16 9.5 6.5 6.5 0 0 0 9.5 3zm0 11A4.5 4.5 0 1 1 14 9.5 4.5 4.5 0 0 1 9.5 14zm10.71 6.29l-4.08-4.08a8.5 8.5 0 1 0-1.42 1.42l4.08 4.08a1 1 0 1 0 1.42-1.42z" />
                        </svg>
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
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 4H8c-1.1 0-2 .9-2 2v2h2V6h12v12H8v-2H6v2c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2z" />
                <path d="M12 8l-4 4h3v4h2v-4h3z" />
              </svg>
              Xem tất cả lịch sử
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
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M17 8V7a5 5 0 0 0-10 0v1H5v12h14V8h-2zm-8-1a3 3 0 0 1 6 0v1H9V7zm9 11H6V10h12v8z" />
            </svg>
            Đổi mật khẩu
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleLogout}
            className="px-6 py-2 bg-[#f0ebe2] text-[#b85c4a] rounded-xl shadow-[6px_6px_12px_#cdc4b8,_-6px_-6px_12px_#fffff0] hover:shadow-[inset_6px_6px_12px_#cdc4b8,_inset_-6px_-6px_12px_#fffff0] transition-all duration-200 font-medium flex items-center justify-center gap-2"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 13v-2H7V8l-5 4 5 4v-3h9zM20 3H8c-1.1 0-2 .9-2 2v4h2V5h12v14H8v-4H6v4c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z" />
            </svg>
            Đăng xuất
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}