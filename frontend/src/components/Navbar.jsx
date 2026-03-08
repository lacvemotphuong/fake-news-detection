import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // fetch profile
  const fetchProfile = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setUser(null);
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/user/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const u = await res.json();
        setUser(u);
        localStorage.setItem("user", JSON.stringify(u));
      } else if (res.status === 401) {
        logout();
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [location.pathname]);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === "user") {
        try {
          setUser(e.newValue ? JSON.parse(e.newValue) : null);
        } catch {
          setUser(null);
        }
      }
    };

    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  return (
    <>
      {/* NAVBAR */}
      <nav className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 flex justify-between items-center shadow-lg">

        {/* LEFT */}
        <div className="flex items-center gap-6">

          {/* MENU BUTTON */}
          <button
            onClick={() => setOpen(true)}
            className="text-white text-2xl"
          >
            ☰
          </button>

          {/* LOGO */}
          <h1 className="text-white text-lg font-bold">
            📰 Fake News
          </h1>

          {/* MENU */}
          <div className="flex gap-5 text-white font-medium">
            <Link to="/" className="hover:underline">
              Trang chủ
            </Link>

            <Link to="/profile" className="hover:underline">
              Profile
            </Link>

            <Link to="/history" className="hover:underline">
              Lịch sử
            </Link>
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex gap-3 items-center">

          {!user ? (
            <>
              <Link
                to="/login"
                className="bg-white text-blue-600 px-4 py-1.5 rounded-md text-sm font-semibold hover:bg-gray-100"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="bg-white text-purple-600 px-4 py-1.5 rounded-md text-sm font-semibold hover:bg-gray-100"
              >
                Register
              </Link>
            </>
          ) : (
            <>
              <span className="text-white font-semibold">
                😎  {user.username || user.name || "User"}
              </span>

              <button
                onClick={logout}
                className="bg-red-500 text-white px-3 py-1.5 rounded-md text-sm hover:bg-red-600"
              >
                Logout
              </button>
            </>
          )}

        </div>
      </nav>

      {/* SIDEBAR */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-50 transform transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >

        {/* HEADER */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="font-bold text-lg">Menu</h2>

          <button onClick={() => setOpen(false)}>
            ✕
          </button>
        </div>

        {/* MENU */}
        <div className="flex flex-col p-4 gap-4 text-gray-700">

          <Link
            to="/"
            className="hover:bg-gray-100 p-2 rounded"
            onClick={() => setOpen(false)}
          >
            🏠 Trang chủ
          </Link>

          <Link
            to="/profile"
            className="hover:bg-gray-100 p-2 rounded"
            onClick={() => setOpen(false)}
          >
            👤 Profile
          </Link>

          <Link
            to="/history"
            className="hover:bg-gray-100 p-2 rounded"
            onClick={() => setOpen(false)}
          >
            📜 Lịch sử
          </Link>

        </div>

        {/* LOGOUT */}
        {user && (
          <div className="absolute bottom-0 w-full p-4 border-t">
            <button
              onClick={logout}
              className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600"
            >
              Đăng xuất
            </button>
          </div>
        )}

      </div>

      {/* BACKDROP */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/40 z-40"
        />
      )}
    </>
  );
}