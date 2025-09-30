// data/tiles.ts
// Provide a local fallback so the app works without Supabase
import { supabase } from "@/lib/supabase";

export type TileFeatures = {
  base?: string;
  third?: string;
  singular?: string;
  plural?: string;
  [key: string]: string | undefined;
};

export type Tile = {
  id: string;
  pos: string;            // subject, verb, noun, extra, qword, etc.
  text: { en: string; es?: string };
  features: TileFeatures; // base, v3, past, countability...
  tags: string[];
};

export type TileFilters = {
  include_tags?: string[];
};

const LOCAL_TILES: Tile[] = [
  // Subjects
  { id: "subj_i", pos: "subject", text: { en: "I" }, features: {}, tags: ["subject_basic"] },
  { id: "subj_you", pos: "subject", text: { en: "You" }, features: {}, tags: ["subject_basic"] },
  { id: "subj_he", pos: "subject", text: { en: "He" }, features: {}, tags: ["subject_basic"] },
  { id: "subj_she", pos: "subject", text: { en: "She" }, features: {}, tags: ["subject_basic"] },
  { id: "subj_we", pos: "subject", text: { en: "We" }, features: {}, tags: ["subject_basic"] },
  { id: "subj_they", pos: "subject", text: { en: "They" }, features: {}, tags: ["subject_basic"] },

  // Present simple verbs
  {
    id: "verb_eat",
    pos: "verb",
    text: { en: "eat/eats" },
    features: { base: "eat", third: "eats" },
    tags: ["v1_or_3rd", "base_verb"],
  },
  {
    id: "verb_play",
    pos: "verb",
    text: { en: "play/plays" },
    features: { base: "play", third: "plays" },
    tags: ["v1_or_3rd", "base_verb"],
  },
  {
    id: "verb_like",
    pos: "verb",
    text: { en: "like/likes" },
    features: { base: "like", third: "likes" },
    tags: ["v1_or_3rd", "base_verb"],
  },

  // Past forms
  {
    id: "verb_past_played",
    pos: "verb-past",
    text: { en: "played" },
    features: { base: "play" },
    tags: ["past_verbs"],
  },
  {
    id: "verb_past_watched",
    pos: "verb-past",
    text: { en: "watched" },
    features: { base: "watch" },
    tags: ["past_verbs"],
  },
  {
    id: "verb_past_went",
    pos: "verb-past",
    text: { en: "went" },
    features: { base: "go" },
    tags: ["past_verbs"],
  },

  // Objects
  {
    id: "obj_pizza",
    pos: "object",
    text: { en: "pizza/pizzas" },
    features: { singular: "pizza", plural: "pizzas" },
    tags: ["object_basic"],
  },
  { id: "obj_music", pos: "object", text: { en: "music" }, features: {}, tags: ["object_basic"] },
  { id: "obj_guitar", pos: "object", text: { en: "the guitar" }, features: {}, tags: ["object_basic"] },
  { id: "obj_homework", pos: "object", text: { en: "homework" }, features: {}, tags: ["object_basic"] },
  { id: "obj_movie", pos: "object", text: { en: "the movie" }, features: {}, tags: ["object_basic"] },

  // Complements
  { id: "comp_happy", pos: "complement", text: { en: "happy" }, features: {}, tags: ["complement_basic"] },
  { id: "comp_ready", pos: "complement", text: { en: "ready" }, features: {}, tags: ["complement_basic"] },
  { id: "comp_teacher", pos: "complement", text: { en: "a teacher" }, features: {}, tags: ["complement_basic"] },

  // Helpers and auxiliaries
  { id: "aux_do", pos: "aux", text: { en: "do" }, features: {}, tags: ["do_does"] },
  { id: "aux_does", pos: "aux", text: { en: "does" }, features: {}, tags: ["do_does"] },
  { id: "aux_did", pos: "aux", text: { en: "did" }, features: {}, tags: ["did_aux"] },
  { id: "be_am", pos: "aux", text: { en: "am" }, features: {}, tags: ["be_present"] },
  { id: "be_is", pos: "aux", text: { en: "is" }, features: {}, tags: ["be_present"] },
  { id: "be_are", pos: "aux", text: { en: "are" }, features: {}, tags: ["be_present"] },

  // Negatives and question words
  { id: "neg_not", pos: "neg", text: { en: "not" }, features: {}, tags: ["neg_not"] },
  { id: "q_what", pos: "question-word", text: { en: "What" }, features: {}, tags: ["question_words_basic"] },
  { id: "q_where", pos: "question-word", text: { en: "Where" }, features: {}, tags: ["question_words_basic"] },

  // Time expressions
  { id: "time_yesterday", pos: "time", text: { en: "yesterday" }, features: {}, tags: ["time_finished"] },
  { id: "time_today", pos: "time", text: { en: "today" }, features: {}, tags: ["time_present"] },
  { id: "time_tomorrow", pos: "time", text: { en: "tomorrow" }, features: {}, tags: ["time_future"] },
  { id: "time_now", pos: "time", text: { en: "now" }, features: {}, tags: ["time_present"] },
  { id: "time_always", pos: "time", text: { en: "always" }, features: {}, tags: ["frequency_adverbs"] },
  { id: "time_usually", pos: "time", text: { en: "usually" }, features: {}, tags: ["frequency_adverbs"] },
  { id: "time_sometimes", pos: "time", text: { en: "sometimes" }, features: {}, tags: ["frequency_adverbs"] },
  { id: "time_never", pos: "time", text: { en: "never" }, features: {}, tags: ["frequency_adverbs"] },

  // Time prepositions
  { id: "prep_at", pos: "time-preposition", text: { en: "at" }, features: {}, tags: ["time_prepositions"] },
  { id: "prep_on", pos: "time-preposition", text: { en: "on" }, features: {}, tags: ["time_prepositions"] },
  { id: "prep_in", pos: "time-preposition", text: { en: "in" }, features: {}, tags: ["time_prepositions"] },

  // Frequency expressions
  { id: "freq_once", pos: "frequency", text: { en: "once" }, features: {}, tags: ["frequency_expressions"] },
  { id: "freq_twice", pos: "frequency", text: { en: "twice" }, features: {}, tags: ["frequency_expressions"] },
  { id: "freq_three_times", pos: "frequency", text: { en: "three times" }, features: {}, tags: ["frequency_expressions"] },
  { id: "freq_a_day", pos: "frequency", text: { en: "a day" }, features: {}, tags: ["frequency_expressions"] },
  { id: "freq_a_week", pos: "frequency", text: { en: "a week" }, features: {}, tags: ["frequency_expressions"] },
  { id: "freq_a_month", pos: "frequency", text: { en: "a month" }, features: {}, tags: ["frequency_expressions"] },

  // Duration expressions
  { id: "dur_for", pos: "duration", text: { en: "for" }, features: {}, tags: ["duration_expressions"] },
  { id: "dur_since", pos: "duration", text: { en: "since" }, features: {}, tags: ["duration_expressions"] },
  { id: "dur_2_hours", pos: "duration", text: { en: "2 hours" }, features: {}, tags: ["duration_expressions"] },
  { id: "dur_5_years", pos: "duration", text: { en: "5 years" }, features: {}, tags: ["duration_expressions"] },

  // Experience words
  { id: "exp_ever", pos: "experience", text: { en: "ever" }, features: {}, tags: ["experience_words"] },
  { id: "exp_before", pos: "experience", text: { en: "before" }, features: {}, tags: ["experience_words"] },

  // Recent words
  { id: "rec_just", pos: "recent", text: { en: "just" }, features: {}, tags: ["recent_words"] },
  { id: "rec_recently", pos: "recent", text: { en: "recently" }, features: {}, tags: ["recent_words"] },
  { id: "rec_already", pos: "recent", text: { en: "already" }, features: {}, tags: ["recent_words"] },

  // Completion words
  { id: "comp_yet", pos: "completion", text: { en: "yet" }, features: {}, tags: ["completion_words"] },
  { id: "comp_still", pos: "completion", text: { en: "still" }, features: {}, tags: ["completion_words"] },

  // Going to
  { id: "going_to", pos: "going-to", text: { en: "going to" }, features: {}, tags: ["going_to"] },

  // Will
  { id: "will", pos: "will", text: { en: "will" }, features: {}, tags: ["will"] },

  // Modals
  { id: "modal_can", pos: "modal", text: { en: "can" }, features: {}, tags: ["modals"] },
  { id: "modal_should", pos: "modal", text: { en: "should" }, features: {}, tags: ["modals"] },
  { id: "modal_must", pos: "modal", text: { en: "must" }, features: {}, tags: ["modals"] },
  { id: "modal_could", pos: "modal", text: { en: "could" }, features: {}, tags: ["modals"] },
  { id: "modal_may", pos: "modal", text: { en: "may" }, features: {}, tags: ["modals"] },

  // Obligation words
  { id: "oblig_have_to", pos: "obligation", text: { en: "have to" }, features: {}, tags: ["obligation_words"] },

  // Used to forms
  { id: "used_to", pos: "used-to", text: { en: "used to" }, features: {}, tags: ["used_to_forms"] },
  { id: "be_used_to", pos: "used-to", text: { en: "be used to" }, features: {}, tags: ["used_to_forms"] },
  { id: "get_used_to", pos: "used-to", text: { en: "get used to" }, features: {}, tags: ["used_to_forms"] },

  // Gerunds and infinitives
  { id: "gerund_ing", pos: "gerund", text: { en: "ing" }, features: {}, tags: ["gerunds"] },
  { id: "infinitive_to", pos: "infinitive", text: { en: "to" }, features: {}, tags: ["infinitives"] },

  // Preference words
  { id: "pref_prefer", pos: "preference", text: { en: "prefer" }, features: {}, tags: ["preference_words"] },
  { id: "pref_would_rather", pos: "preference", text: { en: "would rather" }, features: {}, tags: ["preference_words"] },

  // Permission modals
  { id: "perm_can_i", pos: "permission", text: { en: "Can I" }, features: {}, tags: ["permission_modals"] },
  { id: "perm_could_i", pos: "permission", text: { en: "Could I" }, features: {}, tags: ["permission_modals"] },
  { id: "perm_may_i", pos: "permission", text: { en: "May I" }, features: {}, tags: ["permission_modals"] },

  // Let's
  { id: "lets", pos: "lets", text: { en: "Let's" }, features: {}, tags: ["lets"] },

  // Suggestion phrases
  { id: "sugg_how_about", pos: "suggestion", text: { en: "How about" }, features: {}, tags: ["suggestion_phrases"] },
  { id: "sugg_what_about", pos: "suggestion", text: { en: "What about" }, features: {}, tags: ["suggestion_phrases"] },

  // Comparatives
  { id: "comp_er", pos: "comparative", text: { en: "er" }, features: {}, tags: ["comparatives"] },
  { id: "comp_more", pos: "comparative", text: { en: "more" }, features: {}, tags: ["comparatives"] },
  { id: "comp_than", pos: "comparative", text: { en: "than" }, features: {}, tags: ["comparatives"] },

  // Superlatives
  { id: "super_est", pos: "superlative", text: { en: "est" }, features: {}, tags: ["superlatives"] },
  { id: "super_most", pos: "superlative", text: { en: "most" }, features: {}, tags: ["superlatives"] },
  { id: "super_the", pos: "superlative", text: { en: "the" }, features: {}, tags: ["superlatives"] },

  // Indefinite pronouns
  { id: "indef_someone", pos: "indefinite", text: { en: "someone" }, features: {}, tags: ["indefinite_pronouns"] },
  { id: "indef_anyone", pos: "indefinite", text: { en: "anyone" }, features: {}, tags: ["indefinite_pronouns"] },
  { id: "indef_something", pos: "indefinite", text: { en: "something" }, features: {}, tags: ["indefinite_pronouns"] },
  { id: "indef_anything", pos: "indefinite", text: { en: "anything" }, features: {}, tags: ["indefinite_pronouns"] },
  { id: "indef_everyone", pos: "indefinite", text: { en: "everyone" }, features: {}, tags: ["indefinite_pronouns"] },
  { id: "indef_everything", pos: "indefinite", text: { en: "everything" }, features: {}, tags: ["indefinite_pronouns"] },
  { id: "indef_nothing", pos: "indefinite", text: { en: "nothing" }, features: {}, tags: ["indefinite_pronouns"] },

  // Relative pronouns
  { id: "rel_who", pos: "relative", text: { en: "who" }, features: {}, tags: ["relative_pronouns"] },
  { id: "rel_which", pos: "relative", text: { en: "which" }, features: {}, tags: ["relative_pronouns"] },
  { id: "rel_that", pos: "relative", text: { en: "that" }, features: {}, tags: ["relative_pronouns"] },

  // Tag questions
  { id: "tag_dont_you", pos: "tag", text: { en: "don't you" }, features: {}, tags: ["tag_questions"] },
  { id: "tag_do_you", pos: "tag", text: { en: "do you" }, features: {}, tags: ["tag_questions"] },
  { id: "tag_isnt_it", pos: "tag", text: { en: "isn't it" }, features: {}, tags: ["tag_questions"] },
  { id: "tag_is_it", pos: "tag", text: { en: "is it" }, features: {}, tags: ["tag_questions"] },

  // Conditionals
  { id: "cond_if", pos: "conditional", text: { en: "if" }, features: {}, tags: ["conditionals"] },
  { id: "cond_would", pos: "conditional", text: { en: "would" }, features: {}, tags: ["conditionals"] },
  { id: "cond_would_have", pos: "conditional", text: { en: "would have" }, features: {}, tags: ["conditionals"] },

  // Phrasal verbs
  { id: "phrasal_turn_on", pos: "phrasal", text: { en: "turn on" }, features: {}, tags: ["phrasal_verbs"] },
  { id: "phrasal_turn_off", pos: "phrasal", text: { en: "turn off" }, features: {}, tags: ["phrasal_verbs"] },
  { id: "phrasal_look_up", pos: "phrasal", text: { en: "look up" }, features: {}, tags: ["phrasal_verbs"] },
  { id: "phrasal_pick_up", pos: "phrasal", text: { en: "pick up" }, features: {}, tags: ["phrasal_verbs"] },

  // Reporting verbs
  { id: "report_said", pos: "reporting", text: { en: "said" }, features: {}, tags: ["reporting_verbs"] },
  { id: "report_told", pos: "reporting", text: { en: "told" }, features: {}, tags: ["reporting_verbs"] },
  { id: "report_asked", pos: "reporting", text: { en: "asked" }, features: {}, tags: ["reporting_verbs"] },
  { id: "report_explained", pos: "reporting", text: { en: "explained" }, features: {}, tags: ["reporting_verbs"] },

  // Polite phrases
  { id: "polite_do_you_know", pos: "polite", text: { en: "Do you know" }, features: {}, tags: ["polite_phrases"] },
  { id: "polite_can_you_tell", pos: "polite", text: { en: "Can you tell me" }, features: {}, tags: ["polite_phrases"] },
  { id: "polite_i_wonder", pos: "polite", text: { en: "I wonder" }, features: {}, tags: ["polite_phrases"] },
];

type CatalogRow = {
  id: string;
  pos: string;
  text: { en: string; es?: string };
  features: TileFeatures | null;
  tags: string[] | null;
};

export async function fetchCatalog(): Promise<Tile[]> {
  // If env is configured, try Supabase; otherwise return local
  if (
    supabase &&
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    const { data, error } = await supabase.from('catalog').select('*');
    if (!error && data) {
      return (data as CatalogRow[]).map(row => ({
        id: row.id,
        pos: row.pos,
        text: row.text,
        features: row.features ?? {},
        tags: row.tags ?? [],
      }));
    }
  }
  return LOCAL_TILES;
}

export function filterTilesForLevel(all: Tile[], tileFilters?: TileFilters) {
  const includeTags = tileFilters?.include_tags;
  if (!includeTags || includeTags.length === 0) return all;
  const must = new Set(includeTags);
  return all.filter(tile => tile.tags.some(tag => must.has(tag)));
}
