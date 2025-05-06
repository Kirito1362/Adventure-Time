
import { useState } from "react";

export default function Home() {
  const [view, setView] = useState("home");

  return (
    <main style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
      <h1>Unsere gemeinsame Seite 💑</h1>
      <div style={{ marginBottom: "1rem" }}>
        <button onClick={() => setView("kalender")}>📅 Kalender</button>{" "}
        <button onClick={() => setView("galerie")}>🖼️ Galerie</button>{" "}
        <button onClick={() => setView("notizen")}>📝 Notizen</button>
      </div>
      {view === "home" && <p>Willkommen! Nutzt das Menü oben, um Termine, Fotos oder Notizen zu teilen.</p>}
      {view === "kalender" && <p><strong>Kalender:</strong> Hier könnt ihr Termine eintragen.</p>}
      {view === "galerie" && <p><strong>Galerie:</strong> Hier könnt ihr Fotos hochladen und ansehen.</p>}
      {view === "notizen" && <p><strong>Notizen:</strong> Hier könnt ihr Gedanken festhalten.</p>}
    </main>
  );
}
