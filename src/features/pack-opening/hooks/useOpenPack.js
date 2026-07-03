// src/features/pack-opening/hooks/useOpenPack.js
import { useMutation } from '@tanstack/react-query';
import { supabase } from '../../../lib/supabase';

async function openPack(setId) {
  const { data, error } = await supabase.functions.invoke("open-pack", {
    body: { set_id: setId },
  });

  if (error) {
    console.log("Function error:", error);

    // This is the important part
    if (error.context) {
      const body = await error.context.json();
      console.log("Function response:", body);
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