import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function UserHistory() {
  const [history, setHistory] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const res = await fetch("http://localhost:5000/api/predict/history", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      
      if (!res.ok) {
        throw new Error("Không thể tải lịch sử");
      }
      
      const data = await res.json();
      setHistory(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Thống kê
  const fakeCount = history.filter(
    (h) => h.result === "FAKE" || h.result === 1 || h.result?.label === "FAKE"
  ).length;

  const realCount = history.length - fakeCount;

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

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="bg-[#f0ebe2] p-6 rounded-2xl shadow-[12px_12px_24px_#cdc4b8,_-12px_-12px_24px_#fffff0]">
            <h2 className="text-2xl md:text-3xl font-bold text-[#5c4b3a] flex items-center gap-2 mb-2">
              <span>🔎</span>
              Lịch sử tra cứu
            </h2>
            <div className="h-0.5 w-20 bg-[#cdc4b8] rounded-full"></div>
            <p className="text-[#7e6b58] text-sm mt-3">
              Danh sách các lần kiểm tra tin tức
            </p>
          </div>
        </motion.div>

        {/* Statistics Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8"
        >
          <div className="bg-[#f0ebe2] rounded-2xl shadow-[12px_12px_24px_#cdc4b8,_-12px_-12px_24px_#fffff0] p-6 text-center">
            <p className="text-[#7e6b58] text-sm mb-2 flex items-center justify-center gap-1">
              <span>📊</span> Tổng lịch sử
            </p>
            <h3 className="text-3xl font-bold text-[#5c4b3a]">
              {history.length}
            </h3>
          </div>

          <div className="bg-[#f0ebe2] rounded-2xl shadow-[12px_12px_24px_#cdc4b8,_-12px_-12px_24px_#fffff0] p-6 text-center">
            <p className="text-[#7e6b58] text-sm mb-2 flex items-center justify-center gap-1">
              <span>✅</span> Tin thật
            </p>
            <h3 className="text-3xl font-bold text-[#5c8b6e]">
              {realCount}
            </h3>
          </div>

          <div className="bg-[#f0ebe2] rounded-2xl shadow-[12px_12px_24px_#cdc4b8,_-12px_-12px_24px_#fffff0] p-6 text-center">
            <p className="text-[#7e6b58] text-sm mb-2 flex items-center justify-center gap-1">
              <span>⚠️</span> Tin giả
            </p>
            <h3 className="text-3xl font-bold text-[#b85c4a]">
              {fakeCount}
            </h3>
          </div>
        </motion.div>

        {/* Loading State */}
        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-[#f0ebe2] rounded-2xl shadow-[20px_20px_40px_#cdc4b8,_-20px_-20px_40px_#fffff0] p-12 text-center"
            >
              <div className="inline-block">
                <div className="w-12 h-12 bg-[#f0ebe2] rounded-2xl shadow-[inset_5px_5px_10px_#cdc4b8,_inset_-5px_-5px_10px_#fffff0] flex items-center justify-center">
                  <svg className="animate-spin h-6 w-6 text-[#5c4b3a]" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                </div>
              </div>
              <p className="mt-4 text-[#7e6b58]">Đang tải lịch sử...</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error State */}
        <AnimatePresence>
          {error && !loading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="bg-[#f0ebe2] rounded-2xl shadow-[20px_20px_40px_#cdc4b8,_-20px_-20px_40px_#fffff0] p-8 text-center"
            >
              <div className="inline-block p-3 bg-[#f0ebe2] rounded-xl shadow-[inset_5px_5px_10px_#cdc4b8,_inset_-5px_-5px_10px_#fffff0] mb-3">
                <span className="text-3xl">⚠️</span>
              </div>
              <p className="text-[#b85c4a] font-medium mb-4">{error}</p>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={fetchHistory}
                className="px-6 py-2 bg-[#f0ebe2] text-[#5c4b3a] rounded-xl shadow-[6px_6px_12px_#cdc4b8,_-6px_-6px_12px_#fffff0] hover:shadow-[inset_6px_6px_12px_#cdc4b8,_inset_-6px_-6px_12px_#fffff0] transition-all duration-200 font-medium"
              >
                🔄 Thử lại
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* History Table */}
        {!loading && !error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-[#f0ebe2] rounded-2xl shadow-[20px_20px_40px_#cdc4b8,_-20px_-20px_40px_#fffff0] overflow-hidden"
          >
            {history.length === 0 ? (
              <div className="p-12 text-center">
                <div className="inline-block p-4 bg-[#f0ebe2] rounded-2xl shadow-[inset_6px_6px_12px_#cdc4b8,_inset_-6px_-6px_12px_#fffff0] mb-4">
                  <span className="text-5xl">📭</span>
                </div>
                <h3 className="text-xl font-bold text-[#5c4b3a] mb-2">Chưa có lịch sử tra cứu</h3>
                <p className="text-[#7e6b58]">
                  Hãy quay lại trang chủ và thử phân tích một bài viết!
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-[#e0d8ce]">
                    <tr className="text-[#7e6b58] text-sm">
                      <th className="py-4 px-4 text-left w-16">#</th>
                      <th className="py-4 px-4 text-left w-40">Thời gian</th>
                      <th className="py-4 px-4 text-left">Nội dung</th>
                      <th className="py-4 px-4 text-left w-28">Kết quả</th>
                      <th className="py-4 px-4 text-left w-20">Xem</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((item, index) => {
                      const isFake = item.result === "FAKE" || item.result === 1 || item.result?.label === "FAKE";
                      return (
                        <motion.tr
                          key={item._id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.03 }}
                          className="border-b border-[#e0d8ce] hover:bg-[#e8e0d4] transition-colors duration-150"
                        >
                          <td className="py-3 px-4 text-[#5c4b3a] text-sm">{index + 1}</td>
                          <td className="py-3 px-4 text-[#7e6b58] text-sm">
                            {formatTime(item.createdAt)}
                          </td>
                          <td className="py-3 px-4">
                            <p className="text-[#5c4b3a] text-sm truncate max-w-md">
                              {item.text}
                            </p>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`inline-block px-3 py-1 rounded-lg text-xs font-semibold ${
                              isFake
                                ? "bg-[#b85c4a]/10 text-[#b85c4a]"
                                : "bg-[#5c8b6e]/10 text-[#5c8b6e]"
                            }`}>
                              {isFake ? "FAKE" : "REAL"}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <button
                              onClick={() => setSelected(item)}
                              className="text-[#5c4b3a] hover:text-[#7e6b58] transition-colors text-sm font-medium underline decoration-dotted"
                            >
                              Xem
                            </button>
                          </td>
                        </motion.tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        )}

        {/* Modal */}
        <AnimatePresence>
          {selected && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              onClick={() => setSelected(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-[#f0ebe2] rounded-2xl shadow-[20px_20px_40px_#cdc4b8,_-20px_-20px_40px_#fffff0] max-w-2xl w-full max-h-[80vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-[#5c4b3a] flex items-center gap-2">
                      <span>📄</span>
                      Nội dung đã kiểm tra
                    </h3>
                    <button
                      onClick={() => setSelected(null)}
                      className="w-8 h-8 bg-[#f0ebe2] rounded-lg shadow-[3px_3px_6px_#cdc4b8,_-3px_-3px_6px_#fffff0] hover:shadow-[inset_3px_3px_6px_#cdc4b8,_inset_-3px_-3px_6px_#fffff0] transition-all duration-200 text-[#7e6b58]"
                    >
                      ✕
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-[#f0ebe2] rounded-xl p-4 shadow-[inset_5px_5px_10px_#cdc4b8,_inset_-5px_-5px_10px_#fffff0]">
                      <p className="text-[#5c4b3a] text-sm leading-relaxed whitespace-pre-wrap">
                        {selected.text}
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between pt-2">
                      <div>
                        <p className="text-[#7e6b58] text-sm mb-1">Kết quả phân tích:</p>
                        <span className={`inline-block px-4 py-2 rounded-xl text-sm font-semibold ${
                          (selected.result === "FAKE" || selected.result === 1 || selected.result?.label === "FAKE")
                            ? "bg-[#b85c4a]/10 text-[#b85c4a]"
                            : "bg-[#5c8b6e]/10 text-[#5c8b6e]"
                        }`}>
                          {(selected.result === "FAKE" || selected.result === 1 || selected.result?.label === "FAKE") ? "FAKE - Tin giả" : "REAL - Tin thật"}
                        </span>
                      </div>
                      
                      <p className="text-[#7e6b58] text-xs">
                        {new Date(selected.createdAt).toLocaleString("vi-VN")}
                      </p>
                    </div>

                    {selected.probability && (
                      <div className="mt-2">
                        <div className="flex justify-between text-xs mb-1 text-[#7e6b58]">
                          <span>Độ tin cậy giả</span>
                          <span>{Math.round((selected.probability.fake || selected.probability || 0) * 100)}%</span>
                        </div>
                        <div className="h-1.5 bg-[#e0d8ce] rounded-full shadow-[inset_1px_1px_2px_#cdc4b8]">
                          <div 
                            className="h-full bg-[#b85c4a] rounded-full transition-all duration-500"
                            style={{ width: `${Math.round((selected.probability.fake || selected.probability || 0) * 100)}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}