import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";

export default function EditProfile() {

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    api.getProfile().then((data) => {
      setUsername(data.username);
      setEmail(data.email);
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.updateProfile({
        username,
        email
      });

      alert("Cập nhật thành công");
      navigate("/profile");

    } catch (err) {
      alert("Cập nhật thất bại");
    }

    setLoading(false);
  };

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white shadow rounded-xl p-6">

      <h2 className="text-xl font-bold mb-5 text-blue-600">
        Cập nhật thông tin
      </h2>

      <form onSubmit={handleSubmit}>

        <div className="mb-4">
          <label className="block mb-1">Username</label>
          <input
            className="w-full border p-2 rounded"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1">Email</label>
          <input
            className="w-full border p-2 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="flex gap-3">

          <button
            type="submit"
            className="bg-blue-600 text-white px-5 py-2 rounded"
            disabled={loading}
          >
            {loading ? "Đang lưu..." : "Lưu"}
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