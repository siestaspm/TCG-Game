// src/features/economy/hooks/usePackEconomy.js
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../auth/hooks/useAuth';

// Must match FREE_PACKS_PER_DAY in the open-pack edge function.
const FREE_PACKS_PER_DAY = 2;

async function fetchPackEconomy(userId) {
  const [creditsResult, freeResult] = await Promise.all([
    supabase.from('user_credits').select('balance').eq('user_id', userId).maybeSingle(),
    supabase.rpc('free_packs_remaining', {
      p_user_id: userId,
      p_daily_limit: FREE_PACKS_PER_DAY,
    }),
  ]);

  if (creditsResult.error) throw creditsResult.error;
  if (freeResult.error) throw freeResult.error;

  return {
    // No row yet means the user has never earned/spent a credit - balance is 0.
    creditBalance: creditsResult.data?.balance ?? 0,
    freePacksRemaining: freeResult.data ?? 0,
    freePacksPerDay: FREE_PACKS_PER_DAY,
  };
}

/**
 * Read-only view of "can I open a pack, and what will it cost". Call
 * queryClient.invalidateQueries({ queryKey: ['pack-economy'] }) after any
 * mutation that spends credits or opens a pack (useOpenPack does this
 * automatically on success).
 */
export function usePackEconomy() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['pack-economy', user?.id],
    queryFn: () => fetchPackEconomy(user.id),
    enabled: !!user,
    staleTime: 1000 * 15,
  });
}