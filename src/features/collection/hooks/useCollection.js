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

      const ownedMap = new Map(owned.map((o) => [o.card_id, o.quantity]));

      // Always return a flat list (each card keeps its set_id) - CollectionScreen
      // groups/filters client-side (by set, by game) as needed. Previously this
      // returned {setId, cards}[] groups when setId was omitted, which
      // CollectionScreen didn't actually handle, silently breaking the "all
      // sets" binder view.
      return cards.map((card) => ({
        ...card,
        quantity: ownedMap.get(card.id) ?? 0,
      }));
    },
  });
}