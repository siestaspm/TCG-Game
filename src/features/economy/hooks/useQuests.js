// src/features/economy/hooks/useQuests.js
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../auth/hooks/useAuth';

function toISODate(date) {
  return date.toISOString().slice(0, 10);
}

function todayISO() {
  return toISODate(new Date());
}

// Mirrors quest_period_start() in the SQL migration - Monday as the start
// of the ISO week. Keep these in sync if that function ever changes.
function mondayOfThisWeekISO() {
  const now = new Date();
  const day = now.getDay(); // 0 (Sun) .. 6 (Sat)
  const diffToMonday = day === 0 ? 6 : day - 1;
  const monday = new Date(now);
  monday.setDate(now.getDate() - diffToMonday);
  return toISODate(monday);
}

function periodStartFor(questType) {
  return questType === 'daily' ? todayISO() : mondayOfThisWeekISO();
}

async function fetchQuests(userId) {
  const { data: definitions, error: defError } = await supabase
    .from('quest_definitions')
    .select('id, type, title, description, requirement_type, requirement_target, credit_reward')
    .eq('active', true);

  if (defError) throw defError;
  if (!definitions?.length) return [];

  // period_start >= this week's Monday covers both today's daily bucket
  // and this week's weekly bucket in a single round trip.
  const { data: progressRows, error: progressError } = await supabase
    .from('user_quest_progress')
    .select('quest_id, period_start, progress, completed_at')
    .eq('user_id', userId)
    .gte('period_start', mondayOfThisWeekISO());

  if (progressError) throw progressError;

  return definitions.map((quest) => {
    const period = periodStartFor(quest.type);
    const progressRow = progressRows?.find(
      (row) => row.quest_id === quest.id && row.period_start === period,
    );

    return {
      ...quest,
      progress: progressRow?.progress ?? 0,
      completed: Boolean(progressRow?.completed_at),
    };
  });
}

export function useQuests() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['quests', user?.id],
    queryFn: () => fetchQuests(user.id),
    enabled: !!user,
    staleTime: 1000 * 30,
  });
}