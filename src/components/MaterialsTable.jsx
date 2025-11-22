// src/components/MaterialsTable.jsx
export default function MaterialsTable({ materials, onSelect }) {
  if (!materials || materials.length === 0) {
    return <p>No results yet. Try searching a system like "Li-Fe-O".</p>;
  }

  return (
    <table className="materials-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Formula</th>
          <th>Chem. system</th>
          <th>Band gap (eV)</th>
          <th>Density (g/cm³)</th>
          <th>Stable?</th>
        </tr>
      </thead>
      <tbody>
        {materials.map((m) => (
          <tr
            key={m.material_id}
            onClick={() => onSelect(m)}
            className="clickable-row"
          >
            <td>{m.material_id}</td>
            <td>{m.formula_pretty}</td>
            <td>{m.chemsys}</td>
            <td>{m.band_gap ?? "–"}</td>
            <td>{m.density ? m.density.toFixed(2) : "–"}</td>
            <td>{m.is_stable ? "Yes" : "No"}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

