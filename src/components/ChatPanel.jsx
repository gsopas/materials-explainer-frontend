// src/components/ChatPanel.jsx
import { useState } from "react";

export default function ChatPanel({ material, messages, onAsk, loading }) {
  const [input, setInput] = useState("");

  if (!material) {
    return <p>Select a material from the table to see the explainer chat.</p>;
  }

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    onAsk(trimmed);
    setInput("");
  };

  return (
    <div className="chat-panel">
      <div className="material-summary">
        <h2>{material.formula_pretty}</h2>
        <p>{material.chemsys}</p>
        <p>Band gap: {material.band_gap ?? "n/a"} eV</p>
        <p>Density: {material.density ?? "n/a"} g/cm³</p>
        <p>Stable: {material.is_stable ? "Yes" : "No"}</p>
      </div>

      <div className="chat-window">
        {messages.length === 0 && (
          <p className="hint">
            The AI will give an initial explanation when you first select the
            material. Then you can ask follow-up questions here.
          </p>
        )}
        {messages.map((m, idx) => (
          <div key={idx} className={`chat-message ${m.role}`}>
            <strong>{m.role === "user" ? "You" : "AI"}</strong>
            <p>{m.content}</p>
          </div>
        ))}
        {loading && <p className="loading">Thinking…</p>}
      </div>

      <div className="chat-input-row">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about this material (e.g. 'Is this a good insulator?')"
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button onClick={handleSend} disabled={loading}>
          Send
        </button>
      </div>
    </div>
  );
}

