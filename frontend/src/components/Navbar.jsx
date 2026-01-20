import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-4 flex justify-between items-center shadow-lg">
      <h1 className="text-white text-2xl font-extrabold">
        📰 Fake News Detection
      </h1>

      <div className="flex gap-6">
        <Link className="text-white font-medium hover:underline" to="/">
          Trang chủ
        </Link>
        <Link className="text-white font-medium hover:underline" to="/user">
          User
        </Link>
      </div>
    </nav>
  );
}
