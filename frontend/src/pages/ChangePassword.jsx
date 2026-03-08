import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";

export default function ChangePassword() {

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      alert("Mật khẩu xác nhận không đúng");
      return;
    }

    try {

      await api.changePassword({
        oldPassword,
        newPassword
      });

      alert("Đổi mật khẩu thành công");
      navigate("/profile");

    } catch (err) {
      alert("Đổi mật khẩu thất bại");
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white shadow rounded-xl p-6">

      <h2 className="text-xl font-bold mb-5 text-blue-600">
        Đổi mật khẩu
      </h2>

      <form onSubmit={handleSubmit}>

        <div className="mb-4">
          <label className="block mb-1">Mật khẩu cũ</label>
          <input
            type="password"
            className="w-full border p-2 rounded"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1">Mật khẩu mới</label>
          <input
            type="password"
            className="w-full border p-2 rounded"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1">Xác nhận mật khẩu</label>
          <input
            type="password"
            className="w-full border p-2 rounded"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        <div className="flex gap-3">

          <button
            type="submit"
            className="bg-blue-600 text-white px-5 py-2 rounded"
          >
            Đổi mật khẩu
          </button>

          <button
            type="button"
            onClick={() => navigate("/profile")}
            className="border px-5 py-2 rounded"
          >
            Hủy
          </button>

        </div>

      </form>

    </div>
  );
}