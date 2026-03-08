import { useState } from "react";

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 px-4 py-10">
      <div className="max-w-4xl mx-auto space-y-8">

        {/* INPUT */}
        <div className="bg-white p-8 rounded-2xl shadow-lg border">
          <h2 className="text-2xl font-bold mb-4">🔍 Kiểm tra tin giả</h2>

          <textarea
            rows="7"
            className="w-full border rounded-xl p-4 focus:ring-2 focus:ring-indigo-500"
            placeholder="Dán nội dung tin tức..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />

          {/* MODEL SELECT */}
          <div className="mt-4 flex items-center gap-4">
            <span className="font-medium">Chọn mô hình:</span>

            <select
              value={modelType}
              onChange={(e) => setModelType(e.target.value)}
              className="border rounded-lg px-3 py-2"
            >
              <option value="both">Cả hai (PhoBERT + TF-IDF)</option>
              <option value="phobert">PhoBERT</option>
              <option value="tfidf">TF-IDF</option>
            </select>
          </div>

          {error && (
            <p className="text-red-600 mt-3 font-medium">{error}</p>
          )}

          <div className="text-right mt-6">
            <button
              onClick={predict}
              disabled={loading || !text.trim()}
              className={`px-6 py-3 rounded-xl text-white font-semibold ${
                loading
                  ? "bg-indigo-400"
                  : "bg-indigo-600 hover:bg-indigo-700"
              }`}
            >
              {loading ? "Đang phân tích..." : "Phân tích"}
            </button>
          </div>
        </div>

        {/* RESULT */}
        {result && (
          <div className="bg-white p-8 rounded-2xl shadow-lg border space-y-6">

            {/* LABEL */}
            <h2
              className={`text-4xl font-extrabold text-center ${
                result.label === "FAKE"
                  ? "text-red-600"
                  : "text-green-600"
              }`}
            >
              {result.label === "FAKE" ? "TIN GIẢ" : "TIN THẬT"}
            </h2>

            {/* MODEL */}
            <p className="text-center text-gray-600">
              Model sử dụng:{" "}
              <b className="text-indigo-600">
                {result.used_model?.toUpperCase()}
              </b>
            </p>

            {/* FAKE BAR */}
            <div>
              <div className="flex justify-between text-red-600 font-bold mb-1">
                <span>Tin giả</span>
                <span>{fakePercent}%</span>
              </div>

              <div className="h-5 bg-red-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-red-600"
                  style={{ width: `${fakePercent}%` }}
                />
              </div>
            </div>

            {/* REAL BAR */}
            <div>
              <div className="flex justify-between text-green-600 font-bold mb-1">
                <span>Tin thật</span>
                <span>{realPercent}%</span>
              </div>

              <div className="h-5 bg-green-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-600"
                  style={{ width: `${realPercent}%` }}
                />
              </div>
            </div>

            {/* DETAILS */}
            {result.details && modelType === "both" && (
              <div className="border-t pt-4 text-sm text-gray-600">
                <p>
                  <b>TF-IDF:</b>{" "}
                  {result.details?.tfidf?.prediction === 1
                    ? "FAKE"
                    : "REAL"}{" "}
                  ({Math.round(
                    (result.details?.tfidf?.probability_fake || 0) *
                      100
                  )}
                  % fake)
                </p>

                <p>
                  <b>PhoBERT:</b>{" "}
                  {result.details?.phobert?.prediction === 1
                    ? "FAKE"
                    : "REAL"}{" "}
                  ({Math.round(
                    (result.details?.phobert?.probability_fake || 0) *
                      100
                  )}
                  % fake)
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}