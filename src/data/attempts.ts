// data/attempts.ts
import { supabase } from "@/lib/supabase";

export async function submitAttempt(opts: {
  userId: string;
  levelId: string;
  patternId: string;
  tileIds: string[];
  isCorrect: boolean;
  scoreDelta: number; // give points for correct attempts
  feedbackKey?: string; // e.g. "agr_3rd_s"
}) {
  if (!supabase) {
    console.warn('Supabase client not configured. Attempt not recorded.');
    return { ok: false, reason: 'supabase-disabled' } as const;
  }
  const { error } = await supabase.from("attempts").insert({
    user_id: opts.userId,
    level_id: opts.levelId,
    pattern_id: opts.patternId,
    tiles: opts.tileIds,
    is_correct: opts.isCorrect,
    score_delta: opts.scoreDelta,
    feedback_key: opts.feedbackKey ?? null,
  });
  if (error) throw error;

  // Progress upsert
  // If not exists, create with best_score = scoreDelta
  // If exists, bump best_score when improved, bump streak when correct
  const { data: prog, error: readErr } = await supabase
    .from("progress")
    .select("best_score, streak")
    .eq("user_id", opts.userId)
    .eq("level_id", opts.levelId)
    .single();

  if (readErr && readErr.code !== "PGRST116") throw readErr; // 116 = no rows

  const nextBest = Math.max(prog?.best_score ?? 0, opts.scoreDelta);
  const nextStreak = opts.isCorrect ? (prog?.streak ?? 0) + 1 : 0;

  const { error: upsertErr } = await supabase.from("progress").upsert({
    user_id: opts.userId,
    level_id: opts.levelId,
    best_score: nextBest,
    streak: nextStreak,
    status: "in_progress",
  });
  if (upsertErr) throw upsertErr;

  return { ok: true };
}
