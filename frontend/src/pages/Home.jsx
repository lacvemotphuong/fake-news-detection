import { useState } from "react";

export default function Home() {
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const predict = async () => {
    if (!text.trim()) return;

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("http://localhost:5000/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      setResult(data);
    } catch {
      alert("Không kết nối được backend");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 px-6 py-10">
      <div className="max-w-6xl mx-auto space-y-10">

        {/* HEADER */}
        <div className="rounded-3xl p-10 bg-white/70 backdrop-blur shadow-sm flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-extrabold text-slate-800">
              Fake News Detection
            </h1>
            <p className="mt-3 text-slate-600 max-w-xl">
              Hệ thống phân tích và đánh giá độ tin cậy của tin tức bằng trí tuệ nhân tạo
            </p>
          </div>
          <div className="hidden md:block text-7xl opacity-40">🤖</div>
        </div>

        {/* MAIN */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* INPUT */}
          <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm p-8 space-y-6">
            <h2 className="text-xl font-semibold text-slate-700 flex items-center gap-2">
              🔍 Tra cứu tin tức
            </h2>

            <textarea
              rows="9"
              className="w-full rounded-2xl border border-slate-300 p-5
              focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              placeholder="Nhập hoặc dán nội dung bài báo cần kiểm tra..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />

            <div className="flex justify-end">
              <button
                onClick={predict}
                disabled={loading}
                className={`px-8 py-3 rounded-2xl font-semibold transition-all duration-200
                ${
                  loading
                    ? "bg-slate-400 cursor-not-allowed text-white"
                    : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-md"
                }`}
              >
                {loading ? "Đang phân tích..." : "Dự đoán"}
              </button>
            </div>
          </div>

          {/* RESULT */}
          <div className="bg-white rounded-3xl shadow-sm p-8 space-y-6">
            <h2 className="text-xl font-semibold text-slate-700 flex items-center gap-2">
              📊 Kết quả
            </h2>

            {!result && (
              <div className="text-slate-400 text-sm text-center py-16 border-2 border-dashed rounded-2xl">
                Chưa có dữ liệu phân tích
              </div>
            )}

            {result && (
              <div
                className={`rounded-2xl p-6 text-center space-y-4
                ${
                  result.result === "FAKE"
                    ? "bg-red-50 border border-red-200"
                    : "bg-green-50 border border-green-200"
                }`}
              >
                <span
                  className={`inline-block px-4 py-1 rounded-full text-sm font-semibold
                  ${
                    result.result === "FAKE"
                      ? "bg-red-100 text-red-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {result.result}
                </span>

                <h3
                  className={`text-4xl font-extrabold
                  ${
                    result.result === "FAKE"
                      ? "text-red-600"
                      : "text-green-600"
                  }`}
                >
                  {result.result === "FAKE" ? "FAKE NEWS" : "REAL NEWS"}
                </h3>

                {result.probability !== undefined && (
                  <div className="space-y-2">
                    <p className="text-slate-600 text-sm">
                      Độ tin cậy:{" "}
                      <span className="font-semibold">
                        {Math.round(result.probability * 100)}%
                      </span>
                    </p>

                    {/* Progress bar */}
                    <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                      <div
                        className={`h-full transition-all duration-700
                        ${
                          result.result === "FAKE"
                            ? "bg-red-500"
                            : "bg-green-500"
                        }`}
                        style={{
                          width: `${Math.round(result.probability * 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* FOOTER */}
        <div className="text-center text-sm text-slate-400 pt-6">
          © 2026 Fake News Detection – AI Dashboard
        </div>
      </div>
    </div>
  );
}
