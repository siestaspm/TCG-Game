// src/features/sets/hooks/useSets.js
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../../lib/supabase';

async function fetchSets() {
  const { data, error } = await supabase
    .from('sets')
    .select('id, code, name, release_date, pack_art_url')
    .order('release_date', { ascending: false });

  if (error) throw error;
  return data;
}

export function useSets() {
  return useQuery({
    queryKey: ['sets'],
    queryFn: fetchSets,
  });
}

async function fetchSet(setId) {
  const { data, error } = await supabase
    .from('sets')
    .select('id, code, name, release_date, pack_art_url')
    .eq('id', setId)
    .single();

  if (error) throw error;
  return data;
}

// Used by PackOpeningScreen to show the pack art/name for the chosen set
// before the pack has been opened.
export function useSet(setId) {
  return useQuery({
    queryKey: ['sets', setId],
    queryFn: () => fetchSet(setId),
    enabled: !!setId,
  });
}