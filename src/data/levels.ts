// Minimal local levels to run without Supabase
export type Level = {
  id: string;
  title: { en: string };
  pattern_ids: string[];
  tile_filters?: { include_tags?: string[] };
  points: number;
};

const LOCAL_LEVELS: Level[] = [
  {
    id: "L1",
    title: { en: "Present Simple – Affirmative" },
    pattern_ids: ["ps_affirmative"],
    tile_filters: { include_tags: ["subject_basic", "v1_or_3rd", "object_basic"] },
    points: 10,
  },
  {
    id: "L2",
    title: { en: "Present Simple – Negative" },
    pattern_ids: ["ps_negative"],
    tile_filters: { include_tags: ["subject_basic", "do_does", "base_verb", "neg_not", "object_basic"] },
    points: 12,
  },
  {
    id: "L3",
    title: { en: "Present Simple – Yes/No Question" },
    pattern_ids: ["ps_yes_no_question"],
    tile_filters: { include_tags: ["do_does", "subject_basic", "base_verb", "object_basic"] },
    points: 12,
  },
  {
    id: "L4",
    title: { en: "Present Simple – WH Question" },
    pattern_ids: ["ps_wh_question"],
    tile_filters: { include_tags: ["question_words_basic", "do_does", "subject_basic", "base_verb", "object_basic"] },
    points: 14,
  },
  {
    id: "L5",
    title: { en: "Be Verb – Affirmative" },
    pattern_ids: ["be_affirmative"],
    tile_filters: { include_tags: ["subject_basic", "be_present", "complement_basic"] },
    points: 12,
  },
  {
    id: "L6",
    title: { en: "Be Verb – Negative" },
    pattern_ids: ["be_negative"],
    tile_filters: { include_tags: ["subject_basic", "be_present", "neg_not", "complement_basic"] },
    points: 14,
  },
  {
    id: "L7",
    title: { en: "Past Simple – Affirmative" },
    pattern_ids: ["past_affirmative"],
    tile_filters: { include_tags: ["subject_basic", "past_verbs", "object_basic", "time_finished"] },
    points: 14,
  },
  {
    id: "L8",
    title: { en: "Past Simple – Negative" },
    pattern_ids: ["past_negative"],
    tile_filters: { include_tags: ["subject_basic", "did_aux", "neg_not", "base_verb", "object_basic", "time_finished"] },
    points: 16,
  },
  {
    id: "L9",
    title: { en: "Past Simple – Question" },
    pattern_ids: ["past_question"],
    tile_filters: { include_tags: ["did_aux", "subject_basic", "base_verb", "object_basic", "time_finished"] },
    points: 16,
  },
];

export async function listLevels(): Promise<Level[]> {
  return LOCAL_LEVELS;
}
