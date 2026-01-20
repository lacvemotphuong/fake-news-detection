import { useEffect, useState } from "react";

export default function User() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/predict/history")
      .then(res => res.json())
      .then(setHistory);
  }, []);

  return (
    <div className="max-w-3xl mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-4">Lịch sử tra cứu</h2>

      {history.map(item => (
        <div key={item._id} className="border-b py-3">
          <p>{item.text}</p>
          <strong className={item.result === "FAKE" ? "text-red-500" : "text-green-600"}>
            {item.result}
          </strong>
        </div>
      ))}
    </div>
  );
}
