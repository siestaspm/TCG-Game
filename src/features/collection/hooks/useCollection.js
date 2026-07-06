// src/features/collection/hooks/useCollection.js
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../auth/hooks/useAuth';

export function useCollection(setId) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['collection', setId ?? 'all', user?.id],
    enabled: !!user,
    queryFn: async () => {
      let cardsQuery = supabase
        .from('cards')
        .select('id, set_id, card_code, name, rarity, image_url, art_variant')
        .order('card_code', { ascending: true });

      if (setId) cardsQuery = cardsQuery.eq('set_id', setId);

      const { data: cards, error: cardsError } = await cardsQuery;
      if (cardsError) throw cardsError;

      const { data: owned, error: ownedError } = await supabase
        .from('user_collections')
        .select('card_id, quantity')
        .eq('user_id', user.id)
        .in('card_id', cards.map((c) => c.id));
      if (ownedError) throw ownedError;

      console.log(owned)
      console.log(ownedError)

      const ownedMap = new Map(owned.map((o) => [o.card_id, o.quantity]));
      const merged = cards.map((card) => ({
        ...card,
        quantity: ownedMap.get(card.id) ?? 0,
      }));

      if (setId) return merged; // flat list for a single set

      // No setId: group by set_id for a sectioned view
      const bySet = new Map();
      for (const card of merged) {
        if (!bySet.has(card.set_id)) bySet.set(card.set_id, []);
        bySet.get(card.set_id).push(card);
      }
      return Array.from(bySet.entries()).map(([setId, cards]) => ({
        setId,
        cards,
      }));
    },
  });
}