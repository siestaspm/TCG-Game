// src/features/sets/hooks/useSets.js
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../../lib/supabase';

async function fetchSets() {
  const { data, error } = await supabase
    .from('sets')
    .select('id, code, name, release_date, pack_art_url, credit_cost')
    .order('release_date', { ascending: false });

  if (error) throw error;
  return data;
}

// `sets` has no game_code column yet in Supabase, so every row is treated as
// Pokemon until that migration is run - this keeps the query itself
// unchanged (no risk of erroring against the current schema) while still
// letting the UI filter by game today.
function withGameCode(sets) {
  return sets.map((s) => ({ ...s, game_code: s.game_code ?? 'onepiece' }));
}

export function useSets(gameId) {
  return useQuery({
    queryKey: ['sets'],
    queryFn: async () => withGameCode(await fetchSets()),
    select: (sets) => (gameId ? sets.filter((s) => s.game_code === gameId) : sets),
  });
}

async function fetchSet(setId) {
  const { data, error } = await supabase
    .from('sets')
    .select('id, code, name, release_date, pack_art_url, credit_cost')
    .eq('id', setId)
    .single();

  if (error) throw error;
  return data;
}

// Used by PackOpeningScreen to show the pack art/name/price for the chosen
// set before the pack has been opened.
export function useSet(setId) {
  return useQuery({
    queryKey: ['sets', setId],
    queryFn: () => fetchSet(setId),
    enabled: !!setId,
  });
}