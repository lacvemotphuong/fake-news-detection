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
      {/* NAVBAR - MODERN CLAYMORPHISM */}
      <nav className="bg-[#f5f0e8] px-6 md:px-8 py-3 flex justify-between items-center shadow-[0_10px_20px_rgba(0,0,0,0.05),0_6px_6px_rgba(0,0,0,0.05)] border-b border-[#e5ddd2]">
        
        {/* LEFT SECTION */}
        <div className="flex items-center gap-4 md:gap-6">
          
          {/* MENU BUTTON */}
          <button
            onClick={() => setOpen(true)}
            className="w-10 h-10 md:w-11 md:h-11 bg-[#f5f0e8] rounded-xl shadow-[4px_4px_8px_#d9d0c4,_-4px_-4px_8px_#ffffff] hover:shadow-[inset_3px_3px_6px_#d9d0c4,_inset_-3px_-3px_6px_#ffffff] shadow-[4px_4px_8px_#d9d0c4,_-4px_-4px_8px_#ffffff] hover:shadow-[inset_3px_3px_6px_#d9d0c4,_inset_-3px_-3px_6px_#ffffff] transition-all duration-200 text-[#5c4b3a] flex items-center justify-center"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path d="M4 6h16v2H4V6zm0 5h16v2H4v-2zm0 5h16v2H4v-2z"/>
            </svg>
          </button>

          {/* LOGO */}
          <div className="hidden sm:block">
            {/* <h1 className="text-[#5c4b3a] text-xl md:text-2xl font-bold tracking-tight">
              📰 Fake News Detector
            </h1> */}
          </div>
        </div>

        {/* MAIN MENU - DESKTOP */}
        <div className="hidden md:flex gap-3 bg-[#f5f0e8] p-1 rounded-2xl shadow-[inset_2px_2px_5px_#d9d0c4,_inset_-2px_-2px_5px_#ffffff] mr-2">
          <Link 
            to="/" 
            className="px-5 py-2 rounded-xl text-[#5c4b3a] font-medium hover:bg-[#f5f0e8] hover:shadow-[4px_4px_8px_#d9d0c4,_-4px_-4px_8px_#ffffff] transition-all duration-200 flex items-center gap-2"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
              <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
            </svg>
            Trang chủ
          </Link>
          <Link 
            to="/profile" 
            className="px-5 py-2 rounded-xl text-[#5c4b3a] font-medium hover:bg-[#f5f0e8] hover:shadow-[4px_4px_8px_#d9d0c4,_-4px_-4px_8px_#ffffff] transition-all duration-200 flex items-center gap-2"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
              <path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v3h20v-3c0-3.3-6.7-5-10-5z"/>
            </svg>
            Profile
          </Link>
          <Link 
            to="/history" 
            className="px-5 py-2 rounded-xl text-[#5c4b3a] font-medium hover:bg-[#f5f0e8] transition-all duration-200 flex items-center gap-2"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
              <path d="M6 2h9a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zm0 2v13h9V4H6zm11 0h2v6h-2V4zm0 8h2v2h-2v-2z"/>
            </svg>
            Lịch sử
          </Link>
        </div>

        {/* RIGHT SECTION */}
        <div className="flex gap-2 md:gap-3 items-center">

          {!user ? (
            <>
              <Link
                to="/login"
                className="px-5 py-2 rounded-xl bg-[#f5f0e8] text-[#5c4b3a] font-medium transition-all duration-200"
              >
                Đăng nhập
              </Link>
              <Link
                to="/register"
                className="px-5 py-2 rounded-xl bg-[#5c4b3a] text-white font-medium transition-all duration-200"
              >
                Đăng ký
              </Link>
            </>
          ) : (
            <>
              {/* USER INFO */}
              <div className="flex items-center gap-3 bg-[#f5f0e8] px-3 py-1.5 rounded-2xl">
                <div className="w-8 h-8 bg-[#e5ddd2] rounded-xl flex items-center justify-center text-sm font-bold text-[#5c4b3a]">
                  {user.username?.[0]?.toUpperCase() || "U"}
                </div>
                <span className="text-[#5c4b3a] font-medium text-sm hidden sm:block">
                  {user.username || user.name || "User"}
                </span>
              </div>

              <button
                onClick={logout}
                className="px-4 py-2 rounded-xl bg-[#f5f0e8] text-[#5c4b3a] text-sm font-medium transition-all duration-200 flex items-center justify-center"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path d="M10 17l5-4-5-4v8zm9-13H5c-1.1 0-2 .9-2 2v4h2V6h14v12H5v-4H3v4c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2z"/>
                </svg>
              </button>
            </>
          )}

        </div>
      </nav>

      {/* SIDEBAR - MODERN CLAYMORPHISM */}
      <div
        className={`fixed top-0 left-0 h-full w-72 bg-[#f5f0e8] z-50 transform transition-transform duration-300 ease-out shadow-[2px_0_20px_rgba(0,0,0,0.1)] ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        
        {/* SIDEBAR HEADER */}
        <div className="p-6 border-b border-[#e5ddd2]">
          <div className="flex justify-between items-center mb-6">
            <div className="w-12 h-12 bg-[#f5f0e8] rounded-2xl shadow-[4px_4px_8px_#d9d0c4,_-4px_-4px_8px_#ffffff] flex items-center justify-center">
              <span className="text-2xl">📰 </span>
            </div>
            <button 
              onClick={() => setOpen(false)}
              className="w-9 h-9 bg-[#f5f0e8] rounded-xl shadow-[3px_3px_6px_#d9d0c4,_-3px_-3px_6px_#ffffff] hover:shadow-[inset_3px_3px_6px_#d9d0c4,_inset_-3px_-3px_6px_#ffffff] transition-all duration-200 text-[#5c4b3a] flex items-center justify-center"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M18.3 5.71L12 12.01 5.71 5.71 4.29 7.12 10.59 13.41 4.29 19.71 5.71 21.12 12 14.83 18.29 21.12 19.71 19.71 13.41 13.41 19.71 7.12z"/>
              </svg>
            </button>
          </div>
          <h2 className="text-xl font-bold text-[#5c4b3a]">Menu</h2>
          <p className="text-sm text-[#8b7a69] mt-1">Chào mừng bạn trở lại</p>
        </div>

        {/* SIDEBAR MENU */}
        <div className="p-4 space-y-2">
          <Link
            to="/"
            className="flex items-center gap-3 p-3 rounded-xl text-[#5c4b3a] font-medium hover:bg-[#f5f0e8] hover:shadow-[4px_4px_8px_#d9d0c4,_-4px_-4px_8px_#ffffff] transition-all duration-200 group"
            onClick={() => setOpen(false)}
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 group-hover:scale-110 transition-transform">
              <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
            </svg>
            <span>Trang chủ</span>
          </Link>

          <Link
            to="/profile"
            className="flex items-center gap-3 p-3 rounded-xl text-[#5c4b3a] font-medium hover:bg-[#f5f0e8] hover:shadow-[4px_4px_8px_#d9d0c4,_-4px_-4px_8px_#ffffff] transition-all duration-200 group"
            onClick={() => setOpen(false)}
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 group-hover:scale-110 transition-transform">
              <path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v3h20v-3c0-3.3-6.7-5-10-5z"/>
            </svg>
            <span>Profile</span>
          </Link>

          <Link
            to="/history"
            className="flex items-center gap-3 p-3 rounded-xl text-[#5c4b3a] font-medium hover:bg-[#f5f0e8] hover:shadow-[4px_4px_8px_#d9d0c4,_-4px_-4px_8px_#ffffff] transition-all duration-200 group"
            onClick={() => setOpen(false)}
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 group-hover:scale-110 transition-transform">
              <path d="M6 2h9a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zm0 2v13h9V4H6zm11 0h2v6h-2V4zm0 8h2v2h-2v-2z"/>
            </svg>
            <span>Lịch sử</span>
          </Link>
        </div>

        {/* USER SECTION IN SIDEBAR */}
        {user && (
          <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-[#e5ddd2]">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-[#f5f0e8] shadow-[inset_2px_2px_5px_#d9d0c4,_inset_-2px_-2px_5px_#ffffff]">
              <div className="w-10 h-10 bg-[#e5ddd2] rounded-xl shadow-[2px_2px_4px_#d9d0c4,_-2px_-2px_4px_#ffffff] flex items-center justify-center font-bold text-[#5c4b3a]">
                {user.username?.[0]?.toUpperCase() || "U"}
              </div>
              <div className="flex-1">
                <p className="text-[#5c4b3a] font-medium text-sm">{user.username || user.name}</p>
                <p className="text-[#8b7a69] text-xs">Đã đăng nhập</p>
              </div>
              <button
                onClick={logout}
                className="px-3 py-1.5 rounded-lg bg-[#f5f0e8] text-sm text-[#5c4b3a] shadow-[2px_2px_4px_#d9d0c4,_-2px_-2px_4px_#ffffff] hover:shadow-[inset_2px_2px_4px_#d9d0c4,_inset_-2px_-2px_4px_#ffffff] transition-all duration-200 flex items-center justify-center"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                  <path d="M10 17l5-4-5-4v8zm9-13H5c-1.1 0-2 .9-2 2v4h2V6h14v12H5v-4H3v4c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2z"/>
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* BACKDROP */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 animate-fadeIn"
        />
      )}
    </>
  );
}

// Add to your global CSS file
// @keyframes fadeIn {
//   from { opacity: 0; }
//   to { opacity: 1; }
// }
// .animate-fadeIn {
//   animation: fadeIn 0.2s ease-out;
// }