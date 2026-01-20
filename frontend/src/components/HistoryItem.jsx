export default function HistoryItem({ text, result, time }) {
  return (
    <div className="history-item">
      <p>{text}</p>
      <strong>{result}</strong>
      <small>{new Date(time).toLocaleString()}</small>
    </div>
  );
}
