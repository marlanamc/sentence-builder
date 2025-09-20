export type Pattern = {
  id: string;
  name: string;
  formula: string; // e.g., S + V1/3rd + O
  examples: string[];
};

const LOCAL_PATTERNS: Pattern[] = [
  {
    id: "ps_affirmative",
    name: "Present Simple – Affirmative",
    formula: "S + V1/3rd + O",
    examples: ["She eats pizza.", "They play football."],
  },
  {
    id: "ps_negative",
    name: "Present Simple – Negative",
    formula: "S + do/does + not + base V + O",
    examples: ["He does not like coffee.", "I do not watch TV."],
  },
  {
    id: "ps_yes_no_question",
    name: "Present Simple – Yes/No Question",
    formula: "Do/Does + S + base V + O?",
    examples: ["Do you play the guitar?", "Does she eat pizza?"],
  },
  {
    id: "ps_wh_question",
    name: "Present Simple – WH Question",
    formula: "Question word + do/does + S + base V + O?",
    examples: ["What do you play?", "Where does he eat lunch?"],
  },
  {
    id: "be_affirmative",
    name: "Be Verb – Affirmative",
    formula: "S + am/is/are + complement",
    examples: ["I am happy.", "They are ready."],
  },
  {
    id: "be_negative",
    name: "Be Verb – Negative",
    formula: "S + am/is/are + not + complement",
    examples: ["She is not tired.", "We are not ready."],
  },
  {
    id: "past_affirmative",
    name: "Past Simple – Affirmative",
    formula: "S + V2 + O (+ time)",
    examples: ["They played soccer yesterday.", "He went home."],
  },
  {
    id: "past_negative",
    name: "Past Simple – Negative",
    formula: "S + did not + base V + O (+ time)",
    examples: ["I did not play yesterday.", "She did not go home."],
  },
  {
    id: "past_question",
    name: "Past Simple – Question",
    formula: "Did + S + base V + O (+ time)?",
    examples: ["Did you play yesterday?", "Did he watch the game?"],
  },
];

export async function getPatternsByIds(ids: string[]): Promise<Pattern[]> {
  const set = new Set(ids);
  return LOCAL_PATTERNS.filter(p => set.has(p.id));
}
