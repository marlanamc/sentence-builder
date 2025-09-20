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
