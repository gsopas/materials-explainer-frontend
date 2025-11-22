const API_BASE = import.meta.env.VITE_API_BASE;

export async function searchMaterials({ chemsys, formula, limit = 20 }) {
  const body = { chemsys, formula, limit };
  const res = await fetch(`${API_BASE}/api/materials`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Error fetching materials");
  }
  return res.json();
}

export async function explainMaterial(material, question) {
  const body = {
    raw_data: material,
    question: question || null,
  };
  const res = await fetch(`${API_BASE}/api/explain`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Error from AI explainer");
  }
  return res.json();
}

