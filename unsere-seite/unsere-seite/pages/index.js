import { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

export default function Home() {
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [view, setView] = useState("home");
  const [newEvent, setNewEvent] = useState("");

  // Lädt Events aus localStorage und überprüft auf Fehler
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const savedEvents = localStorage.getItem("termine");
        if (savedEvents) {
          const parsedEvents = JSON.parse(savedEvents);
          // Stelle sicher, dass date als Date-Objekt gespeichert wird
          const eventsWithDate = parsedEvents.map((event) => ({
            ...event,
            date: new Date(event.date),
          }));
          setEvents(eventsWithDate);
        }
      } catch (error) {
        console.error("Fehler beim Laden der Termine aus localStorage:", error);
      }
    }
  }, []);

  // Speichert Events in localStorage mit Fehlerbehandlung
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        // Stelle sicher, dass date immer ein Date-Objekt ist
        const eventsToSave = events.map((event) => ({
          ...event,
          date: event.date.toISOString(), // Speichern als ISO-String
        }));
        localStorage.setItem("termine", JSON.stringify(eventsToSave));
      } catch (error) {
        console.error("Fehler beim Speichern der Termine in localStorage:", error);
      }
    }
  }, [events]);

  // Fügt einen neuen Termin hinzu
  const handleAddEvent = (date) => {
    if (newEvent.trim() === "") {
      return; // Verhindert das Hinzufügen eines leeren Termins
    }
    const newEventObj = { date: new Date(date), text: newEvent };
    setEvents((prevEvents) => [...prevEvents, newEventObj]);
    setNewEvent(""); // Leert das Eingabefeld nach dem Hinzufügen
  };

  // Löscht einen Termin
  const handleDeleteEvent = (eventToDelete) => {
    const updatedEvents = events.filter(
      (event) => event !== eventToDelete
    );
    setEvents(updatedEvents); // Aktualisiert den State
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
          <Calendar
            onChange={setSelectedDate}
            value={selectedDate}
            tileContent={({ date, view }) =>
              view === "month" &&
              events.some((e) => e.date.toDateString() === date.toDateString()) ? (
                <div
                  style={{
                    height: "6px",
                    width: "6px",
                    margin: "0 auto",
                    marginTop: "2px",
                    borderRadius: "50%",
                    background: "red",
                  }}
                ></div>
              ) : null
            }
          />
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

          <button onClick={() => handleAddEvent(selectedDate)}>
            ➕ Termin hinzufügen
          </button>

          <ul style={{ marginTop: "1rem" }}>
            {events
              .filter(
                (e) => e.date.toDateString() === selectedDate.toDateString()
              )
              .map((e, i) => (
                <li key={i}>
                  📌 {e.text}
                  <button
                    onClick={() => handleDeleteEvent(e)}
                    style={{
                      marginLeft: "10px",
                      color: "red",
                      background: "transparent",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    ❌
                  </button>
                </li>
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
