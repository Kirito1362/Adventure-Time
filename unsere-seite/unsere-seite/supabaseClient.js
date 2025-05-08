import { createClient } from '@supabase/supabase-js';

// Initialisierung des Supabase-Clients
const supabaseUrl = "https://hbxfwqacszovbjqulqnh.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhieGZ3cWFjc3pvdmJqcXVscW5oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY1ODAyMzksImV4cCI6MjA2MjE1NjIzOX0.qT9iYElciOS5w-aRJhik5fmCBtSVOUH0p0Drg8R9u7Y";

// Nur einmal instanziieren
const supabase = createClient(supabaseUrl, supabaseKey);

// Subscription wird nicht sofort beim Laden erstellt, sondern erst, wenn benötigt.
let eventSubscription = null;

// Funktion zum Aktivieren der Subscription
const subscribeToEvents = () => {
  // Nur abonnieren, wenn noch keine Subscription existiert
  if (!eventSubscription) {
    eventSubscription = supabase
      .from('events')
      .on('INSERT', payload => {
        console.log('Neue Veranstaltung:', payload);
      })
      .on('DELETE', payload => {
        console.log('Gelöschte Veranstaltung:', payload);
      })
      .subscribe();
  }
};

// Funktion zum Entfernen der Subscription
const removeSubscription = () => {
  if (eventSubscription) {
    supabase.removeSubscription(eventSubscription);
    eventSubscription = null; // Subscription zurücksetzen
  }
};

// Exportiere den Supabase-Client und die Funktionen
export { supabase, subscribeToEvents, removeSubscription };
