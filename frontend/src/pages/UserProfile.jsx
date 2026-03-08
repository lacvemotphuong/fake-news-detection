import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";

export default function UserProfile({ onViewHistory }) {
  const [user, setUser] = useState(null);
  const [recent, setRecent] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.getProfile()
      .then(setUser)
      .catch(() => console.log("Không tải được profile"));

    api.getHistory()
      .then((data) => setRecent(data.slice(0, 5)))
      .catch(() => console.log("Không tải được history"));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (!user) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-6xl mx-auto mt-8">
      <button
        onClick={() => navigate("/")}
        className="mb-4 text-blue-600 border border-blue-500 px-4 py-1 rounded-lg"
      >
        ← Quay lại
      </button>

      {/* Header */}
      <div className="bg-white rounded-xl shadow p-6 flex justify-between items-center mb-6">

        <div className="flex items-center gap-4">
          <div className="bg-blue-100 p-4 rounded-full text-2xl">👤</div>

          <div>
            <h2 className="text-xl font-bold">{user.username}</h2>
          </div>
        </div>

        <button
          onClick={() => navigate("/edit-profile")}
          className="bg-blue-600 text-white px-5 py-2 rounded-lg"
        >
          Cập nhật thông tin
        </button>

      </div>

      {/* Content */}
      <div className="grid grid-cols-2 gap-6">

        {/* Profile */}
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="font-bold text-blue-600 mb-4">
            Thông tin cá nhân
          </h3>

          <p><b>Họ tên:</b> {user.username}</p>
          <p><b>Email:</b> {user.email}</p>

          <p>
            <b>Ngày tạo:</b>{" "}
            {user.createdAt
              ? new Date(user.createdAt).toLocaleDateString("vi-VN")
              : "Không có dữ liệu"}
          </p>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="font-bold text-blue-600 mb-4">
            Hoạt động gần đây
          </h3>

          {recent.length === 0 && (
            <p className="text-gray-500 text-sm">Chưa có lịch sử</p>
          )}

          {recent.map((item) => (
            <p key={item._id} className="text-gray-600 text-sm mb-2">
              {item.createdAt
                ? new Date(item.createdAt).toLocaleString("vi-VN")
                : ""}
              {" - "}Kiểm tra tin tức
            </p>
          ))}

          <button
            onClick={() => navigate("/history")}
            className="mt-3 border border-blue-500 text-blue-600 px-4 py-1 rounded">
            Xem tất cả lịch sử
          </button>
        </div>

      </div>

      {/* Buttons */}
      <div className="flex gap-4 mt-6">

        <button
          onClick={() => navigate("/change-password")}
          className="border border-blue-500 text-blue-600 px-4 py-2 rounded-lg"
        >
          🔒 Đổi mật khẩu
        </button>

        <button
          onClick={handleLogout}
          className="border border-red-500 text-red-600 px-4 py-2 rounded-lg"
        >
          🚪 Đăng xuất
        </button>

      </div>

    </div>
  );
}