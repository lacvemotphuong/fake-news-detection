import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function UserHistory() {

  const [history, setHistory] = useState([]);
  const [selected, setSelected] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5000/api/predict/history", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    })
      .then((res) => res.json())
      .then((data) => setHistory(data));
  }, []);

  // Thống kê
  const fakeCount = history.filter(
    (h) => h.result === "FAKE" || h.result === 1
  ).length;

  const realCount = history.length - fakeCount;

  return (
    <div className="max-w-6xl mx-auto mt-8">

      {/* Back */}
      <button
        onClick={() => navigate("/")}
        className="mb-4 text-blue-600 border border-blue-500 px-4 py-1 rounded-lg"
      >
        ← Quay lại
      </button>

      {/* Header */}
      <div className="bg-white rounded-xl shadow p-6 mb-4 border-l-4 border-blue-500">

        <h2 className="text-2xl font-bold text-blue-600">
          🔎 Lịch sử tra cứu
        </h2>

        <p className="text-gray-500 text-sm">
          Danh sách các lần kiểm tra tin tức
        </p>

      </div>

    {/* Statistics */}
    <div className="grid grid-cols-3 gap-6 mb-8">

    <div className="bg-white border rounded-xl p-6 shadow-sm">
        <p className="text-gray-500 text-sm mb-2">
        Tổng lịch sử tra cứu
        </p>
        <h3 className="text-3xl font-bold text-gray-800">
        {history.length}
        </h3>
    </div>

    <div className="bg-white border rounded-xl p-6 shadow-sm">
        <p className="text-gray-500 text-sm mb-2">
        Tin thật (Real)
        </p>
        <h3 className="text-3xl font-bold text-green-600">
        {realCount}
        </h3>
    </div>

    <div className="bg-white border rounded-xl p-6 shadow-sm">
        <p className="text-gray-500 text-sm mb-2">
        Tin giả (Fake)
        </p>
        <h3 className="text-3xl font-bold text-red-600">
        {fakeCount}
        </h3>
    </div>

    </div>


      {/* Table */}
      <div className="bg-white rounded-xl shadow p-6">

        <table className="w-full text-left">

          <thead className="border-b text-gray-600">
            <tr>
              <th className="py-3">#</th>
              <th>Thời gian</th>
              <th>Nội dung</th>
              <th>Kết quả</th>
              <th>Xem</th>
            </tr>
          </thead>

          <tbody>

            {history.map((item, index) => {

              const isFake =
                item.result === "FAKE" || item.result === 1;

              return (
                <tr
                  key={item._id}
                  className="border-b hover:bg-gray-50"
                >

                  <td className="py-3">{index + 1}</td>

                  <td>
                    {new Date(item.createdAt).toLocaleString("vi-VN")}
                  </td>

                  <td className="max-w-md truncate">
                    {item.text}
                  </td>

                  <td>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        isFake
                          ? "bg-red-100 text-red-600"
                          : "bg-green-100 text-green-600"
                      }`}
                    >
                      {isFake ? "Fake" : "Real"}
                    </span>
                  </td>

                  <td>
                    <button
                      onClick={() => setSelected(item)}
                      className="text-blue-600 underline"
                    >
                      Xem
                    </button>
                  </td>

                </tr>
              );
            })}

          </tbody>

        </table>

      </div>


      {/* Modal */}
      {selected && (

        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">

          <div className="bg-white p-6 rounded-xl max-w-2xl shadow-lg">

            <h3 className="text-xl font-bold mb-3">
              Nội dung đã kiểm tra
            </h3>

            <p className="text-gray-700 mb-4">
              {selected.text}
            </p>

            <p className="font-semibold mb-4">
              Kết quả:{" "}
              {selected.result === "FAKE" || selected.result === 1
                ? "Fake"
                : "Real"}
            </p>

            <button
              onClick={() => setSelected(null)}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Đóng
            </button>

          </div>

        </div>

      )}

    </div>
  );
}