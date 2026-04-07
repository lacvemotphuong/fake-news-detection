import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const [text, setText] = useState("");
  const [modelType, setModelType] = useState("both");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const predict = async () => {
    if (text.trim().length < 20) {
      setError("Nội dung quá ngắn (tối thiểu 20 ký tự)");
      return;
    }

    setLoading(true);
    setResult(null);
    setError("");

    try {
      const res = await fetch("http://localhost:5000/api/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: text,
          model_type: modelType,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Server error");
      }

      setResult(data);
    } catch (err) {
      setError(err.message || "Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };

  const fakePercent = result
    ? Math.round((result.fake_probability || 0) * 100)
    : 0;

  const realPercent = result
    ? Math.round((result.real_probability || 0) * 100)
    : 0;

  const clearText = () => {
    setText("");
    setResult(null);
    setError("");
  };

  return (
    <div className="min-h-screen bg-[#f0ebe2] py-8 md:py-12">
      <div className="max-w-4xl mx-auto px-4">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <div className="inline-block bg-[#f0ebe2] p-6 rounded-3xl shadow-[12px_12px_24px_#cdc4b8,_-12px_-12px_24px_#fffff0]">
            <h1 className="text-4xl md:text-5xl font-bold text-[#5c4b3a] mb-2 flex items-center justify-center gap-3">
              {/* <svg viewBox="0 0 24 24" className="w-10 h-10 text-[#5c4b3a]" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 4h16v4H4zm0 6h16v10H4z" />
              </svg> */}
              Fake News Detector
            </h1>
            <div className="h-0.5 w-24 mx-auto bg-[#cdc4b8] rounded-full"></div>
          </div>
          <p className="text-[#7e6b58] text-base md:text-lg mt-4">
            Phân tích độ tin cậy của tin tức - Kiểm tra ngay lập tức!
          </p>
        </motion.div>

        {/* Input Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-[#f0ebe2] rounded-3xl shadow-[20px_20px_40px_#cdc4b8,_-20px_-20px_40px_#fffff0]"
        >
          <div className="p-6 md:p-8">
            
            {/* Header with clear button */}
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl md:text-2xl font-bold text-[#5c4b3a] flex items-center gap-2">
                <svg viewBox="0 0 24 24" className="w-5 h-5 text-[#5c4b3a]" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 4h12l4 4v12H4zM14 6.5L17.5 10H14z" />
                </svg>
                Nội dung cần kiểm tra
              </h2>
              {text && (
                <button
                  onClick={clearText}
                  className="w-8 h-8 bg-[#f0ebe2] rounded-xl shadow-[3px_3px_6px_#cdc4b8,_-3px_-3px_6px_#fffff0] hover:shadow-[inset_3px_3px_6px_#cdc4b8,_inset_-3px_-3px_6px_#fffff0] transition-all duration-200 text-[#7e6b58] flex items-center justify-center"
                >
                  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18.3 5.71l-1.41-1.41L12 9.59 7.11 4.7 5.7 6.11 10.59 11 5.7 15.89l1.41 1.41L12 12.41l4.89 4.89 1.41-1.41L13.41 11z" />
                  </svg>
                </button>
              )}
            </div>

            {/* Textarea */}
            <textarea
              rows="6"
              className="w-full bg-[#f0ebe2] rounded-2xl p-4 shadow-[inset_5px_5px_10px_#cdc4b8,_inset_-5px_-5px_10px_#fffff0] focus:outline-none resize-none text-[#5c4b3a] placeholder-[#9b8a78] border-none"
              placeholder="Dán nội dung tin tức vào đây... (tối thiểu 20 ký tự)"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />

            {/* Controls */}
            <div className="mt-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="font-medium text-[#5c4b3a] text-sm md:text-base flex items-center gap-2">
                  <svg viewBox="0 0 24 24" className="w-4 h-4 text-[#5c4b3a]" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 7h14v10H5zM7 9v6h10V9H7z" />
                  </svg>
                  Chọn mô hình:
                </span>
                <div className="relative">
                  <select
                    value={modelType}
                    onChange={(e) => setModelType(e.target.value)}
                    className="appearance-none bg-[#f0ebe2] rounded-xl px-4 py-2 pr-8 cursor-pointer shadow-[3px_3px_6px_#cdc4b8,_-3px_-3px_6px_#fffff0] focus:outline-none text-[#5c4b3a] text-sm md:text-base"
                  >
                      <option value="both">Cả hai (PhoBERT + TF-IDF)</option>
                      <option value="phobert">PhoBERT</option>
                      <option value="tfidf">TF-IDF</option>
                  </select>
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-[#7e6b58]">
                    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                      <path d="M7 10l5 5 5-5H7z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="text-sm text-[#7e6b58] bg-[#f0ebe2] px-3 py-1.5 rounded-xl shadow-[inset_2px_2px_4px_#cdc4b8,_inset_-2px_-2px_4px_#fffff0] text-center sm:text-left">
                {text.length} / 5000 ký tự
              </div>
            </div>

            {/* Error message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4"
                >
                  <div className="p-3 bg-[#f0ebe2] rounded-xl shadow-[inset_5px_5px_10px_#cdc4b8,_inset_-5px_-5px_10px_#fffff0]">
                    <p className="text-[#b85c4a] text-sm flex items-center gap-2">
                      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2L2 20h20L12 2zm0 5.5c.83 0 1.5.67 1.5 1.5S12.83 10.5 12 10.5 10.5 9.83 10.5 9 11.17 7.5 12 7.5zm1 9.5h-2v-2h2v2zm0-4h-2v-4h2v4z" />
                      </svg> {error}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Button */}
            <div className="mt-6 text-center">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={predict}
                disabled={loading || !text.trim()}
                className={`px-8 py-3 rounded-xl font-semibold transition-all w-full sm:w-auto ${
                  loading || !text.trim()
                    ? "bg-[#e0d8ce] text-[#9b8a78] shadow-[inset_3px_3px_6px_#cdc4b8,_inset_-3px_-3px_6px_#fffff0] cursor-not-allowed"
                    : "bg-[#f0ebe2] text-[#5c4b3a] shadow-[6px_6px_12px_#cdc4b8,_-6px_-6px_12px_#fffff0] hover:shadow-[inset_6px_6px_12px_#cdc4b8,_inset_-6px_-6px_12px_#fffff0]"
                }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Đang phân tích...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                      <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l4.25 4.25 1.49-1.49L15.5 14zm-6 0C8.01 14 6 11.99 6 9.5S8.01 5 10.5 5 15 7.01 15 9.5 12.99 14 10.5 14z" />
                    </svg>
                    Phân tích ngay
                  </span>
                )}
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Result Card */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.5 }}
              className="mt-8"
            >
              <div className="bg-[#f0ebe2] rounded-3xl overflow-hidden">
                <div className="p-6 md:p-8 space-y-6">
                  
                  {/* Result Header */}
                  <div className="text-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                      className="inline-block"
                    >
                      <div className="p-4 bg-[#f0ebe2] rounded-2xl shadow-[6px_6px_12px_#cdc4b8,_-6px_-6px_12px_#fffff0] mb-4">
                        <span className="text-5xl">
                          {result.label === "FAKE" ? (
                            <svg viewBox="0 0 24 24" className="w-12 h-12 text-[#b85c4a]" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                              <path d="M12 2L2 20h20L12 2zm0 16a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm-1-10h2v5h-2V8z" />
                            </svg>
                          ) : (
                            <svg viewBox="0 0 24 24" className="w-12 h-12 text-[#5c8b6e]" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                              <path d="M9 16.17L4.83 12l-1.41 1.41L9 19 21 7l-1.41-1.41z" />
                            </svg>
                          )}
                        </span>
                      </div>
                    </motion.div>
                    
                    <h2 className={`text-4xl md:text-5xl font-extrabold mb-2 ${
                      result.label === "FAKE" ? "text-[#b85c4a]" : "text-[#5c8b6e]"
                    }`}>
                      {result.label === "FAKE" ? "TIN GIẢ" : "TIN THẬT"}
                    </h2>
                    
                    <p className="text-[#7e6b58] text-sm">
                      Phân tích từ mô hình:{" "}
                      <span className="font-semibold text-[#5c4b3a]">
                        {result.used_model?.toUpperCase()}
                      </span>
                    </p>
                  </div>

                  {/* Confidence Bars */}
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm font-semibold mb-2">
                        <span className="text-[#b85c4a] flex items-center gap-2"><svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L2 20h20L12 2zm0 5.5c.83 0 1.5.67 1.5 1.5S12.83 10.5 12 10.5 10.5 9.83 10.5 9 11.17 7.5 12 7.5zm1 9.5h-2v-2h2v2zm0-4h-2v-4h2v4z" /></svg> Tin giả</span>
                        <span className="text-[#b85c4a]">{fakePercent}%</span>
                      </div>
                      <div className="h-3 bg-[#e0d8ce] rounded-full shadow-[inset_2px_2px_4px_#cdc4b8,_inset_-2px_-2px_4px_#fffff0]">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${fakePercent}%` }}
                          transition={{ duration: 0.8, ease: "easeOut" }}
                          className="h-full bg-[#b85c4a] rounded-full"
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-sm font-semibold mb-2">
                        <span className="text-[#5c8b6e] flex items-center gap-2"><svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M9 16.17L4.83 12l-1.41 1.41L9 19 21 7l-1.41-1.41z" /></svg> Tin thật</span>
                        <span className="text-[#5c8b6e]">{realPercent}%</span>
                      </div>
                      <div className="h-3 bg-[#e0d8ce] rounded-full shadow-[inset_2px_2px_4px_#cdc4b8,_inset_-2px_-2px_4px_#fffff0]">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${realPercent}%` }}
                          transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
                          className="h-full bg-[#5c8b6e] rounded-full"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Details Section */}
                  {result.details && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      className="pt-4 border-t border-[#e0d8ce]"
                    >
                      <h3 className="font-semibold text-[#5c4b3a] mb-3 flex items-center gap-2 text-sm">
                        <svg viewBox="0 0 24 24" className="w-4 h-4 text-[#5c4b3a]" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                          <path d="M6 22h12v-2H6v2zm10.93-7.36l-1.1-1.1c.52-.99.82-2.17.82-3.44 0-3.48-2.82-6.3-6.3-6.3S3.15 7.72 3.15 11.2c0 3.48 2.82 6.3 6.3 6.3 1.27 0 2.45-.3 3.44-.82l1.1 1.1 1.41-1.41zM9.45 15.55A4.92 4.92 0 0 1 5.15 11.2 4.92 4.92 0 0 1 9.45 6.9 4.92 4.92 0 0 1 13.75 11.2c0 1.32-.51 2.52-1.41 3.41l-2.89 2.89a.996.996 0 1 1-1.41-1.41l2.89-2.89z" />
                        </svg> Chi tiết phân tích từng mô hình
                      </h3>
                      
                      <div className="grid gap-3 md:grid-cols-2">
                        {result.details?.phobert && (
                          <div className="p-3 bg-[#f0ebe2] rounded-xl shadow-[inset_4px_4px_8px_#cdc4b8,_inset_-4px_-4px_8px_#fffff0]">
                            <div className="flex items-center gap-2 mb-2">
                              <svg viewBox="0 0 24 24" className="w-5 h-5 text-[#5c4b3a]" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 2a10 10 0 0 0-7.07 17.07A9.92 9.92 0 0 0 12 22a9.92 9.92 0 0 0 7.07-2.93A10 10 0 0 0 12 2zm0 2a8 8 0 0 1 8 8c0 1.38-.35 2.68-.96 3.82L12 13V6zm-6.04 8a8 8 0 0 1 12.08 0A7.94 7.94 0 0 1 12 20a7.94 7.94 0 0 1-6.04-4z" />
                              </svg>
                              <h4 className="font-bold text-[#5c4b3a] text-sm">PhoBERT</h4>
                            </div>
                            <p className="text-xs text-[#7e6b58] mb-2">
                              Kết quả:{" "}
                              <span className={`font-semibold ${
                                result.details.phobert.prediction === 1 ? "text-[#b85c4a]" : "text-[#5c8b6e]"
                              }`}>
                                {result.details.phobert.prediction === 1 ? "TIN GIẢ" : "TIN THẬT"}
                              </span>
                            </p>
                            <div>
                              <div className="flex justify-between text-xs mb-1 text-[#7e6b58]">
                                <span>Độ tin cậy giả</span>
                                <span>{Math.round((result.details.phobert.probability_fake || 0) * 100)}%</span>
                              </div>
                              <div className="h-1.5 bg-[#e0d8ce] rounded-full">
                                <div 
                                  className="h-full bg-[#b85c4a] rounded-full"
                                  style={{ width: `${Math.round((result.details.phobert.probability_fake || 0) * 100)}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        )}

                        {result.details?.tfidf && typeof result.details.tfidf === "object" && (
                          <div className="space-y-2">
                            {Object.entries(result.details.tfidf).map(([name, value], idx) => (
                              <motion.div
                                key={name}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.5 + idx * 0.1 }}
                                className="p-3 bg-[#f0ebe2] rounded-xl shadow-[inset_4px_4px_8px_#cdc4b8,_inset_-4px_-4px_8px_#fffff0]"
                              >
                                <div className="flex items-center gap-2 mb-2">
                                  <svg viewBox="0 0 24 24" className="w-5 h-5 text-[#5c4b3a]" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M5 20h3V10H5v10zm6 0h3V4h-3v16zm6 0h3V14h-3v6z" />
                                  </svg>
                                  <h4 className="font-bold text-[#5c4b3a] text-sm">{name.toUpperCase()}</h4>
                                </div>
                                <p className="text-xs text-[#7e6b58] mb-2">
                                  Kết quả:{" "}
                                  <span className={`font-semibold ${
                                    value.prediction === 1 ? "text-[#b85c4a]" : "text-[#5c8b6e]"
                                  }`}>
                                    {value.prediction === 1 ? "TIN GIẢ" : "TIN THẬT"}
                                  </span>
                                </p>
                                {value.probability_fake !== null && (
                                  <div>
                                    <div className="flex justify-between text-xs mb-1 text-[#7e6b58]">
                                      <span>Độ tin cậy giả</span>
                                      <span>{Math.round(value.probability_fake * 100)}%</span>
                                    </div>
                                    <div className="h-1.5 bg-[#e0d8ce] rounded-full">
                                      <div 
                                        className="h-full bg-[#b85c4a] rounded-full"
                                        style={{ width: `${Math.round(value.probability_fake * 100)}%` }}
                                      />
                                    </div>
                                  </div>
                                )}
                              </motion.div>
                            ))}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-8"
        >
          <div className="inline-block px-5 py-2 bg-[#f0ebe2] rounded-xl shadow-[inset_3px_3px_6px_#cdc4b8,_inset_-3px_-3px_6px_#fffff0]">
            <p className="text-[#7e6b58] text-xs">
              Độ chính xác có thể thay đổi tùy theo nội dung
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}