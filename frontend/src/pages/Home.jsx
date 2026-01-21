import { useState } from "react";

export default function Home() {
  const [text, setText] = useState("");
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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Lỗi server");
      }

      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fakePercent = result
    ? Math.round(result.fake_probability * 100)
    : 0;

  const realPercent = result
    ? Math.round(result.real_probability * 100)
    : 0;

  return (
    <div className="min-h-screen bg-slate-100 px-6 py-10">
      <div className="max-w-5xl mx-auto space-y-8">

        {/* INPUT */}
        <div className="bg-white p-8 rounded-2xl shadow">
          <h2 className="text-xl font-bold mb-4">🔍 Tra cứu tin tức</h2>

          <textarea
            rows="6"
            className="w-full border rounded-xl p-4"
            placeholder="Nhập nội dung bài báo..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />

          {error && (
            <p className="text-red-600 mt-2 font-semibold">{error}</p>
          )}

          <div className="text-right mt-4">
            <button
              onClick={predict}
              disabled={loading}
              className="bg-indigo-600 text-white px-6 py-2 rounded-xl"
            >
              {loading ? "Đang phân tích..." : "Dự đoán"}
            </button>
          </div>
        </div>

        {/* RESULT */}
        {result && (
          <div className="bg-yellow-50 p-8 rounded-2xl shadow space-y-6">
            <h2
              className={`text-3xl font-extrabold text-center ${
                result.label === "FAKE"
                  ? "text-red-600"
                  : "text-green-600"
              }`}
            >
              {result.label === "FAKE" ? "FAKE NEWS" : "REAL NEWS"}
            </h2>

            {/* Fake */}
            <div>
              <div className="flex justify-between font-bold text-red-600">
                <span>Fake</span>
                <span>{fakePercent}%</span>
              </div>
              <div className="h-3 bg-red-200 rounded-full">
                <div
                  className="h-3 bg-red-500 rounded-full"
                  style={{ width: `${fakePercent}%` }}
                />
              </div>
            </div>

            {/* Real */}
            <div>
              <div className="flex justify-between font-bold text-green-600">
                <span>Real</span>
                <span>{realPercent}%</span>
              </div>
              <div className="h-3 bg-green-200 rounded-full">
                <div
                  className="h-3 bg-green-500 rounded-full"
                  style={{ width: `${realPercent}%` }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
