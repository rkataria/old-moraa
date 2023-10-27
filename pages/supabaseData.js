import React, { useEffect, useState } from 'react';
import supabase from '../lib/supabase.js';

async function fetchItems() {
  const { data, error } = await supabase
    .from('courses')
    .select('*');

  if (error) {
    console.error('Error fetching items:', error);
  }

  return data || []; // Return an empty array if data is undefined
}

function SupabaseData() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const itemsData = await fetchItems();
      setItems(itemsData);
    }

    fetchData();
  }, []);

  return (
    <div>
      <h2> Demo: Here goes a list of corporate learning courses, stored within PostgreSQL database tables on Supabase. </h2>
      <ul>
        {items.length > 0 ? (
          items.map((item) => (
            <li key={item.id}>{item.name}</li>
          ))
        ) : (
          <p>No items to display.</p>
        )}
      </ul>
    </div>
  );
}

export default SupabaseData;
