
import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

export default function Home() {
  const [view, setView] = useState("home");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState("");

  const addEvent = () => {
    if (!newEvent) return;
    setEvents([...events, { date: selectedDate, text: newEvent }]);
    setNewEvent("");
  };

  return (
    <main style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
      <h1>Unsere gemeinsame Seite 💑</h1>
      <div style={{ marginBottom: "1rem" }}>
        <button onClick={() => setView("kalender")}>📅 Kalender</button>{" "}
        <button onClick={() => setView("galerie")}>🖼️ Galerie</button>{" "}
        <button onClick={() => setView("notizen")}>📝 Notizen</button>
      </div>

      {view === "home" && (
        <p>
          Willkommen! Nutzt das Menü oben, um Termine, Fotos oder Notizen zu
          teilen.
        </p>
      )}

      {view === "kalender" && (
        <div>
          <h2>📅 Kalender</h2>
          <Calendar onChange={setSelectedDate} value={selectedDate}  tileContent={({ date, view }) =>
    view === "month" &&
    events.some(e => e.date.toDateString() === date.toDateString()) ? (
      <div style={{ 
        height: "6px", 
        width: "6px", 
        margin: "0 auto", 
        marginTop: "2px",
        borderRadius: "50%", 
        background: "red" 
      }}></div>
    ) : null
  } />
          <p style={{ marginTop: "1rem" }}>
            Ausgewählt: <strong>{selectedDate.toDateString()}</strong>
          </p>
          <input
            type="text"
            placeholder="Terminbeschreibung"
            value={newEvent}
            onChange={(e) => setNewEvent(e.target.value)}
            style={{ marginTop: "0.5rem", marginRight: "0.5rem" }}
          />

          <button onClick={addEvent}>➕ Termin hinzufügen</button>

          <ul style={{ marginTop: "1rem" }}>
            {events
              .filter(
                (e) => e.date.toDateString() === selectedDate.toDateString()
              )
              .map((e, i) => (
                <li key={i}>📌 {e.text}</li>
              ))}
          </ul>
        </div>
      )}

      {view === "galerie" && (
        <div>
          <h2>🖼️ Galerie</h2>
          <p>Hier könnt ihr Fotos hochladen und gemeinsam ansehen.</p>
        </div>
      )}

      {view === "notizen" && (
        <div>
          <h2>📝 Notizen</h2>
          <p>Hier könnt ihr wichtige Gedanken und Erinnerungen festhalten.</p>
        </div>
      )}
    </main>
  );
}
