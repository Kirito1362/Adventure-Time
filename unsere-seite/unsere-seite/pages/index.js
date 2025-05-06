
import { useState } from "react";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';

const [selectedDate, setSelectedDate] = useState(new Date());
const [events, setEvents] = useState([]);
const [newEvent, setNewEvent] = useState("");

{view === "kalender" && (
  <div>
    <h2>📅 Kalender</h2>
    <Calendar onChange={setSelectedDate} value={selectedDate} />
    <p className="mt-4">Ausgewählt: {selectedDate.toDateString()}</p>
    <input
      placeholder="Terminbeschreibung"
      value={newEvent}
      onChange={(e) => setNewEvent(e.target.value)}
    />
    <button
      onClick={() => {
        if (!newEvent) return;
        setEvents([...events, { date: selectedDate, text: newEvent }]);
        setNewEvent("");
      }}
    >
      ➕ Termin hinzufügen
    </button>

    <ul style={{ marginTop: "1rem" }}>
      {events
        .filter(e => e.date.toDateString() === selectedDate.toDateString())
        .map((e, i) => (
          <li key={i}>📌 {e.text}</li>
        ))}
    </ul>
  </div>
)}

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
