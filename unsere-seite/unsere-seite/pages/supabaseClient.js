import React, { useEffect } from 'react';

// Importiere Supabase
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://your-project.supabase.co';
const supabaseKey = 'your-anon-key';
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

export default SupabaseClient;
