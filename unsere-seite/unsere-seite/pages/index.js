import { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { supabase } from "../supabaseClient";

export default function Home() {
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [view, setView] = useState("home");
  const [newEvent, setNewEvent] = useState("");
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

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
  }, []);

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
  }, []);

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

  const handleDeleteImage = async (index) => {
    const url = images[index];
    const pathParts = url.split("/");
    const filename = pathParts[pathParts.length - 1];
    const filePath = `public/${filename}`;

    const { error } = await supabase.storage.from("images").remove([filePath]);
    if (error) {
      console.error("Fehler beim Löschen des Bildes:", error.message);
      return;
    }

    setImages(images.filter((_, i) => i !== index));
  };

  const handleAddEvent = async (date) => {
    if (newEvent.trim() === "") return;

    const newEventObj = { text: newEvent, date: new Date(date).toISOString() };

    const { error } = await supabase.from("events").insert([newEventObj]);
    if (error) {
      console.error("Fehler beim Hinzufügen des Termins:", error.message);
      return;
    }

    setEvents((prev) => [...prev, { ...newEventObj, date: new Date(newEventObj.date) }]);
    setNewEvent("");
  };

  const handleDeleteEvent = async (eventToDelete) => {
    const { error } = await supabase.from("events").delete().eq("id", eventToDelete.id);
    if (error) {
      console.error("Fehler beim Löschen des Termins:", error.message);
      return;
    }

    setEvents(events.filter((e) => e.id !== eventToDelete.id));
  };

  return (
    <main style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
      <h1>Unsere gemeinsame Seite 💑</h1>
      <div style={{ marginBottom: "1rem" }}>
        <button onClick={() => setView("kalender")}>📅 Kalender</button>
        <button onClick={() => setView("galerie")}>🖼️ Galerie</button>
        <button onClick={() => setView("notizen")}>📝 Notizen</button>
      </div>

      {view === "home" && <p>Willkommen! Nutzt das Menü oben, um Termine, Fotos oder Notizen zu teilen.</p>}

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

          {selectedImage && (
            <div
              onClick={() => setSelectedImage(null)}
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                background: "rgba(0,0,0,0.8)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 1000,
              }}
            >
              <img
                src={selectedImage}
                alt="Vorschau"
                style={{
                  maxWidth: "90%",
                  maxHeight: "90%",
                  borderRadius: "10px",
                  boxShadow: "0 0 10px rgba(0,0,0,0.5)",
                }}
                onClick={(e) => e.stopPropagation()}
              />
              <button
                onClick={() => setSelectedImage(null)}
                style={{
                  position: "absolute",
                  top: "20px",
                  right: "30px",
                  fontSize: "2rem",
                  color: "white",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                ❌
              </button>
            </div>
          )}
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
