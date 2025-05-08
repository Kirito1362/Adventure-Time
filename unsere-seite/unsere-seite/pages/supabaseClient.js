import React, { useEffect } from 'react';

// Importiere Supabase
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hbxfwqacszovbjqulqnh.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhieGZ3cWFjc3pvdmJqcXVscW5oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY1ODAyMzksImV4cCI6MjA2MjE1NjIzOX0.qT9iYElciOS5w-aRJhik5fmCBtSVOUH0p0Drg8R9u7Y';
const supabase = createClient(supabaseUrl, supabaseKey);

const SupabaseClient = () => {
  useEffect(() => {
    // Deine Supabase-Logik hier
    const getData = async () => {
      const { data, error } = await supabase.from('your-table').select('*');
      if (error) {
        console.error(error);
      } else {
        console.log(data);
      }
    };

    getData();
  }, []);

  return (
    <div>
      <h1>Supabase Client</h1>
      <p>Hier kannst du mit Supabase arbeiten!</p>
    </div>
  );
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
