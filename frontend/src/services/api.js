
const API_URL = "http://localhost:5000/api"; 

export const api = { 

  async getProfile() {
    const res = await fetch(`${API_URL}/user/profile`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    });

    if (!res.ok) throw new Error("Không lấy được profile");

    return res.json();
  },

  async getHistory() {
    const res = await fetch(`${API_URL}/predict/history`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    });

    if (!res.ok) throw new Error("Không lấy được lịch sử");

    return res.json();
  },

  async updateProfile(data) {
    const res = await fetch(`${API_URL}/user/update`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify(data)
    });

    if (!res.ok) throw new Error("Cập nhật thất bại");

    return res.json();
  },

  async changePassword(data) {
    const res = await fetch(`${API_URL}/user/change-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify(data)
    });

    if (!res.ok) throw new Error("Đổi mật khẩu thất bại");

    return res.json();
  }

};