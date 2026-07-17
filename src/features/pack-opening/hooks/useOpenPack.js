// src/features/pack-opening/hooks/useOpenPack.js
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../../lib/supabase';

async function openPack(setId) {
  const { data, error } = await supabase.functions.invoke('open-pack', {
    body: { set_id: setId },
  });

  if (error) {
    // supabase-js only gives us a generic "Edge Function returned a
    // non-2xx status code" here - the real reason (e.g. "Not enough
    // credits to open this pack") is in the response body.
    let message = error.message;
    if (error.context) {
      try {
        const body = await error.context.json();
        if (body?.error) message = body.error;
      } catch {
        // response wasn't JSON - fall back to the generic message
      }
    }
    throw new Error(message);
  }

  return data;
}

export function useOpenPack() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: openPack,
    onSuccess: () => {
      // Opening a pack can change free-pack count, credit balance, quest
      // progress, and the user's collection - refresh all of them so the
      // UI doesn't show stale numbers after a successful open.
      queryClient.invalidateQueries({ queryKey: ['pack-economy'] });
      queryClient.invalidateQueries({ queryKey: ['quests'] });
      queryClient.invalidateQueries({ queryKey: ['collection'] });
    },
  });
}