import { createClient } from '@supabase/supabase-js';

// Initialisierung des Supabase-Clients
const supabaseUrl = 'https://hbxfwqacszovbjqulqnh.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhieGZ3cWFjc3pvdmJqcXVscW5oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY1ODAyMzksImV4cCI6MjA2MjE1NjIzOX0.qT9iYElciOS5w-aRJhik5fmCBtSVOUH0p0Drg8R9u7Y';

const supabase = createClient(supabaseUrl, supabaseKey);

// Echtzeit-Abonnement für die Tabelle 'events'
const eventSubscription = supabase
  .from('events')
  .on('INSERT', payload => {
    console.log('Neue Veranstaltung:', payload);
  })
  .on('DELETE', payload => {
    console.log('Gelöschte Veranstaltung:', payload);
  })
  .subscribe();

// Aufräumen (wird ausgeführt, wenn die Anwendung oder die Komponente zerstört wird)
export const removeSubscription = () => {
  supabase.removeSubscription(eventSubscription);
};

// Exportiere den Supabase-Client für die Verwendung in anderen Dateien
export { supabase };
