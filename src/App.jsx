import { useState } from "react";
import "./App.css";
import { searchMaterials, explainMaterial } from "./api";
import MaterialsTable from "./components/MaterialsTable";
import ChatPanel from "./components/ChatPanel";

function App() {
  const [chemsys, setChemsys] = useState("");
  const [formula, setFormula] = useState("");
  const [materials, setMaterials] = useState([]);
  const [selected, setSelected] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [chatLoading, setChatLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    setError("");
    setSelected(null);
    setChatMessages([]);
    setSearchLoading(true);
    try {
      const res = await searchMaterials({ chemsys: chemsys || null, formula: formula || null });
      setMaterials(res.data || []);
    } catch (err) {
      setError(err.message || "Search failed");
    } finally {
      setSearchLoading(false);
    }
  };

  const loadInitialExplanation = async (material) => {
    setChatLoading(true);
    try {
      const res = await explainMaterial(material, null);
      setChatMessages([
        {
          role: "assistant",
          content: res.answer,
        },
      ]);
    } catch (err) {
      setChatMessages([
        {
          role: "assistant",
          content: "Error loading explanation: " + (err.message || "unknown error"),
        },
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  const handleSelectMaterial = (m) => {
    setSelected(m);
    setChatMessages([]);
    loadInitialExplanation(m);
  };

  const handleAsk = async (question) => {
    if (!selected) return;
    const newMessages = [
      ...chatMessages,
      { role: "user", content: question },
    ];
    setChatMessages(newMessages);
    setChatLoading(true);
    try {
      const res = await explainMaterial(selected, question);
      setChatMessages([
        ...newMessages,
        { role: "assistant", content: res.answer },
      ]);
    } catch (err) {
      setChatMessages([
        ...newMessages,
        { role: "assistant", content: "Error: " + (err.message || "unknown error") },
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <div className="app">
      <header>
        <h1>Materials Explainer</h1>
        <p>Search Materials Project data and explore it with an AI assistant.</p>
      </header>

      <section className="search-section">
        <div className="inputs-row">
          <div>
            <label>Chemical system (e.g. Li-Fe-O)</label>
            <input
              value={chemsys}
              onChange={(e) => setChemsys(e.target.value)}
              placeholder="Li-Fe-O"
            />
          </div>
          <div>
            <label>Formula (e.g. LiFePO4)</label>
            <input
              value={formula}
              onChange={(e) => setFormula(e.target.value)}
              placeholder="LiFePO4"
            />
          </div>
          <button onClick={handleSearch} disabled={searchLoading}>
            {searchLoading ? "Searching…" : "Search"}
          </button>
        </div>
        {error && <p className="error">{error}</p>}
      </section>

      <main className="main-layout">
        <div className="left-pane">
          <h2>Results</h2>
          <MaterialsTable materials={materials} onSelect={handleSelectMaterial} />
        </div>
        <div className="right-pane">
          <h2>AI Materials Chat</h2>
          <ChatPanel
            material={selected}
            messages={chatMessages}
            onAsk={handleAsk}
            loading={chatLoading}
          />
        </div>
      </main>
    </div>
  );
}

export default App;

