import { createClient } from '@supabase/supabase-js';

// Deine Supabase-URL und API-Schlüssel
const supabaseUrl = 'https://hbxfwqacszovbjqulqnh.supabase.co'; // Ersetze dies mit deinem Supabase-URL
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhieGZ3cWFjc3pvdmJqcXVscW5oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY1ODAyMzksImV4cCI6MjA2MjE1NjIzOX0.qT9iYElciOS5w-aRJhik5fmCBtSVOUH0p0Drg8R9u7Y'; // Dein öffentlicher API-Schlüssel von Supabase

// Supabase-Client initialisieren
const supabase = createClient(supabaseUrl, supabaseKey);

// Exportiere den Supabase-Client
export default supabase;
