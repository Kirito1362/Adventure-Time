import { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

// Dynamischen Import von Supabase, um den Client nur im Browser zu verwenden
import { createClient } from "@supabase/supabase-js";

// Supabase URL und Anon Key
const supabaseUrl = "https://hbxfwqacszovbjqulqnh.supabase.co"; // Ändere es mit deiner Supabase URL
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhieGZ3cWFjc3pvdmJqcXVscW5oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY1ODAyMzksImV4cCI6MjA2MjE1NjIzOX0.qT9iYElciOS5w-aRJhik5fmCBtSVOUH0p0Drg8R9u7Y"; // Deine Supabase Anon Key

export default function Home() {
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [view, setView] = useState("home");
  const [newEvent, setNewEvent] = useState("");
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  const supabase = createClient(supabaseUrl, supabaseKey);

  // Lade Events nur beim Initialisieren der Seite
  useEffect(() => {
    const loadEvents = async () => {
      try {
        const { data, error } = await supabase.from("events").select("*");
        if (error) throw error;
        const eventList = data.map((e) => ({
          ...e,
          date: new Date(e.date),
        }));
        setEvents(eventList);
      } catch (error) {
        console.error("Fehler beim Laden der Events:", error.message);
      }
    };

    loadEvents();
  }, []); // Der leere Array stellt sicher, dass die Events nur beim ersten Laden der Seite geladen werden

  // Lade Bilder nur beim Initialisieren der Seite
  useEffect(() => {
    const loadImages = async () => {
      try {
        const { data, error } = await supabase.storage.from("images").list("public", {
          limit: 100,
          offset: 0,
        });
        if (error) throw error;

        const urls = await Promise.all(
          data.map((file) => {
            const { data: urlData } = supabase.storage.from("images").getPublicUrl(`public/${file.name}`);
            return urlData.publicUrl;
          })
        );

        setImages(urls);
      } catch (error) {
        console.error("Fehler beim Laden der Bilder:", error.message);
      }
    };

    loadImages();
  }, []); // Dieser Effekt wird nur beim ersten Laden der Seite ausgeführt

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const filePath = `public/${file.name}`;

    const { error: uploadError } = await supabase.storage.from("images").upload(filePath, file);
    if (uploadError) {
      console.error("Fehler beim Hochladen:", uploadError.message);
      return;
    }

    const { data: urlData } = supabase.storage.from("images").getPublicUrl(filePath);
    setImages((prev) => [...prev, urlData.publicUrl]);
  };

  const handleAddEvent = async (date) => {
    if (newEvent.trim() === "") return;

    const newEventObj = { text: newEvent, date: new Date(date).toISOString() };

    // Stelle sicher, dass jedes Event eine eindeutige UUID bekommt
    const { error } = await supabase.from("events").insert([newEventObj]);
    if (error) {
      console.error("Fehler beim Hinzufügen des Termins:", error.message);
      return;
    }

    setEvents((prev) => [...prev, { ...newEventObj, date: new Date(newEventObj.date) }]);
    setNewEvent("");
  };

  const handleDeleteEvent = async (eventToDelete) => {
    // Überprüfe, ob die ID des zu löschenden Events korrekt ist
    if (!eventToDelete || !eventToDelete.id) {
      console.error("Fehler: Die ID des Events ist ungültig");
      return;
    }

    // Lösche das Event in Supabase
    const { error } = await supabase.from("events").delete().eq("id", eventToDelete.id);
    if (error) {
      console.error("Fehler beim Löschen des Termins:", error.message);
      return;
    }

    // Entferne das gelöschte Event aus dem State
    setEvents(events.filter((e) => e.id !== eventToDelete.id));
  };

  const handleDeleteImage = async (index) => {
    const imageUrl = images[index];
    const fileName = imageUrl.split("/").pop(); // Extrahiere den Dateinamen

    // Lösche das Bild aus Supabase Storage
    const { error } = await supabase.storage.from("images").remove([`public/${fileName}`]);
    if (error) {
      console.error("Fehler beim Löschen des Bildes:", error.message);
      return;
    }

    // Entferne das Bild aus dem State (visuelle Aktualisierung)
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  return (
    <main style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
      <h1>SCHEIßE HAT DAS LANGE GEDAUERT!!!!1111!!!11!!</h1>
      <div style={{ marginBottom: "1rem" }}>
        <button onClick={() => setView("kalender")}>📅 Kalender</button>
        <button onClick={() => setView("galerie")}>🖼️ Galerie</button>
        <button onClick={() => setView("notizen")}>📝 Notizen</button>
      </div>

      {view === "kalender" && (
        <div>
          <h2>📅 Kalender</h2>
          <Calendar
            onChange={setSelectedDate}
            value={selectedDate}
            tileContent={({ date, view }) =>
              view === "month" && events.some((e) => new Date(e.date).toDateString() === date.toDateString()) ? (
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
          <button onClick={() => handleAddEvent(selectedDate)}>➕ Termin hinzufügen</button>
          <ul style={{ marginTop: "1rem" }}>
            {events
              .filter((e) => new Date(e.date).toDateString() === selectedDate.toDateString())
              .map((e, i) => (
                <li key={e.id}>
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
          <input type="file" accept="image/*" onChange={handleImageUpload} style={{ marginBottom: "1rem" }} />
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
            {images.map((img, index) => (
              <div key={index} style={{ position: "relative" }}>
                <img
                  src={img}
                  alt={`Bild ${index}`}
                  style={{
                    width: "150px",
                    height: "150px",
                    objectFit: "cover",
                    cursor: "pointer",
                  }}
                  onClick={() => setSelectedImage(img)}
                />
                <button
                  onClick={() => handleDeleteImage(index)}
                  style={{
                    position: "absolute",
                    top: 5,
                    right: 5,
                    background: "rgba(255,0,0,0.7)",
                    color: "white",
                    border: "none",
                    borderRadius: "50%",
                    cursor: "pointer",
                  }}
                >
                  ✖
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
