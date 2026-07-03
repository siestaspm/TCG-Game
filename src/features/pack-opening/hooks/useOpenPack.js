// src/features/pack-opening/hooks/useOpenPack.js
import { useMutation } from '@tanstack/react-query';
import { supabase } from '../../../lib/supabase';

async function openPack(setId) {
  const { data, error } = await supabase.functions.invoke("open-pack", {
    body: { set_id: setId },
  });

  if (error) {

    console.log(error)
    // This is the important part
    if (error.context) {
      const body = await error.context.json();
          console.log(body); // <-- This will tell you the real error

    }

    throw error;
  }

  return data;
}

export function useOpenPack() {
  return useMutation({
    mutationFn: openPack,
  });
}