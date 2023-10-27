// components/Poll.js
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_API_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

export default function Poll() {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState([]);
  const [votes, setVotes] = useState([]);

  useEffect(() => {
    async function fetchPoll() {
      try {
        // Replace 'polls' with your actual table name in Supabase
        const { data, error } = await supabase.from('polls').select();
        if (data) {
          const pollData = data[0];
          setQuestion(pollData.question);
          setOptions(pollData.options);
          setVotes(pollData.votes);
        } else {
          console.error(error);
        }
      } catch (error) {
        console.error(error);
      }
    }

    fetchPoll();

    // Set up a real-time listener using WebSocket
    const subscription = supabase
      .from('polls')
      .on('*', (payload) => {
        // When data changes, fetch the updated poll
        fetchPoll();
      })
      .subscribe();

    return () => {
      // Unsubscribe from the real-time listener when the component unmounts
      subscription.unsubscribe();
    };
  }, []);

  const handleVote = async (index) => {
    const newVotes = [...votes];
    newVotes[index] += 1;

    try {
      // Replace 'polls' with your actual table name in Supabase
      const { data, error } = await supabase
        .from('polls')
        .update({ votes: newVotes })
        .eq('id', 1);

      if (data) {
        // Poll updated successfully
      } else {
        console.error(error);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h2>{question}</h2>
      <ul>
        {options.map((option, index) => (
          <li key={index}>
            {option} - {votes[index]} votes
            <button onClick={() => handleVote(index)}>Vote</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
