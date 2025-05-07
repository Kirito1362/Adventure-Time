import { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

// Firebase importieren
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, addDoc, deleteDoc, doc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";

// Firebase Konfiguration
const firebaseConfig = {
  apiKey: "AIzaSyCN-yv1cM-tyYBjToFrxDmLSxYT83W5dCE",
  authDomain: "gemeinsamewebsite.firebaseapp.com",
  projectId: "gemeinsamewebsite",
  storageBucket: "gemeinsamewebsite.firebasestorage.app",
  messagingSenderId: "691979739465",
  appId: "1:691979739465:web:6d4baae77ac3423269ba98",
  measurementId: "G-9M7ZSZ4JL4"
};

// Firebase initialisieren
const app = initializeApp(firebaseConfig);
const db = getFirestore(app); // Firestore initialisieren
const storage = getStorage(app); // Firebase Storage initialisieren

export default function Home() {
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [view, setView] = useState("home");
  const [newEvent, setNewEvent] = useState("");
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    // Events aus Firestore laden
    const loadEvents = async () => {
      const eventsCollection = collection(db, "events");
      const eventSnapshot = await getDocs(eventsCollection);
      const eventList = eventSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: new Date(doc.data().date.seconds * 1000), // Firebase Timestamps in Date umwandeln
      }));
      setEvents(eventList);
    };

    loadEvents();
  }, []);

  useEffect(() => {
    // Bilder aus Firebase Storage laden
    const loadImages = async () => {
      const imagesRef = ref(storage, "images");
      const allImages = await getDownloadURL(imagesRef);
      setImages([allImages]); // Alle Bilder URLs hinzufügen
    };

    loadImages();
  }, []);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const storageRef = ref(storage, `images/${file.name}`);
      uploadBytes(storageRef, file).then(() => {
        getDownloadURL(storageRef).then((url) => {
          setImages((prevImages) => [...prevImages, url]);
        });
      });
    }
  };

  const handleAddEvent = async (date) => {
    if (newEvent.trim() === "") {
      return; // Verhindert das Hinzufügen eines leeren Termins
    }
    const newEventObj = { text: newEvent, date: new Date(date) };
    await addDoc(collection(db, "events"), {
      text: newEventObj.text,
      date: newEventObj.date,
    });
    setEvents((prevEvents) => [...prevEvents, newEventObj]);
    setNewEvent(""); // Leert das Eingabefeld nach dem Hinzufügen
  };

  const handleDeleteEvent = async (eventToDelete) => {
    const eventRef = doc(db, "events", eventToDelete.id);
    await deleteDoc(eventRef);
    setEvents(events.filter((event) => event.id !== eventToDelete.id));
  };

  const handleDeleteImage = (index) => {
    const imageUrl = images[index];
    const storageRef = ref(storage, imageUrl); // Referenz zum Bild in Firebase Storage
    deleteObject(storageRef).then(() => {
      setImages(images.filter((_, i) => i !== index)); // Entfernt das Bild aus der Galerie
    }).catch((error) => {
      console.error("Fehler beim Löschen des Bildes:", error);
    });
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
              view === "month" && events.some((e) => e.date.toDateString() === date.toDateString()) ? (
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
              .filter((e) => e.date.toDateString() === selectedDate.toDateString())
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
