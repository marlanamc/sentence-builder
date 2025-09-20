// Simple, readable validators for classroom play
export type Validation = { correct: boolean; feedback: string };

export type ValidatorContext = {
  levelId?: string;
  patternId?: string;
};

const SUBJECTS = ["i", "you", "we", "they", "he", "she", "it"];
const QUESTION_WORDS = ["what", "where", "when", "why", "who", "which", "how"];
const BE_FORMS = ["am", "is", "are"];
const PAST_VERBS = new Set(["played", "watched", "went"]);

function requireSentence(tokens: string[], message = "Build a sentence using the tiles."): Validation | null {
  const text = tokens.join(" ").trim();
  if (!text) return { correct: false, feedback: message };
  return null;
}

function writingTip(text: string, mode: "statement" | "question" = "statement"): string | null {
  const trimmed = text.trim();
  if (!trimmed) return null;

  const capitalized = /^[A-Z]/.test(trimmed);
  const punctuation = mode === "question" ? /\?$/.test(trimmed) : /[.!]$/.test(trimmed);

  const tips: string[] = [];
  if (!capitalized) tips.push("start with a capital letter");
  if (!punctuation) tips.push(mode === "question" ? "end with a question mark" : "end with a period");

  if (!tips.length) return null;
  return tips
    .map(tip => `${tip.charAt(0).toUpperCase()}${tip.slice(1)}.`)
    .join(' ');
}

export function validatePresentSimpleAffirmative(tokens: string[]): Validation {
  const guard = requireSentence(tokens);
  if (guard) return guard;

  const text = tokens.join(" ").trim();
  const words = tokens.map(t => t.toLowerCase());
  const hasSubject = words.some(w => SUBJECTS.includes(w));
  const hasVerb = words.some(w => /[a-z]+/.test(w) && !SUBJECTS.includes(w) && w !== "the" && w !== "a");

  if (!hasSubject || !hasVerb) {
    return { correct: false, feedback: "Add a subject and a verb. Example: She eats pizza." };
  }

  const tip = writingTip(text, "statement");
  if (tip) return { correct: true, feedback: `Good sentence. ${tip}` };
  return { correct: true, feedback: "Good sentence!" };
}

export function validatePresentSimpleNegative(tokens: string[]): Validation {
  const guard = requireSentence(tokens);
  if (guard) return guard;

  const text = tokens.join(" ").trim();
  const words = tokens.map(w => w.toLowerCase());
  const hasSubject = words.some(w => SUBJECTS.includes(w));
  const hasAux = words.includes("do") || words.includes("does");
  const hasNot = words.includes("not");

  if (!hasSubject || !hasAux || !hasNot) {
    return { correct: false, feedback: "Use do or does with not. Example: He does not eat." };
  }

  const tip = writingTip(text, "statement");
  if (tip) return { correct: true, feedback: `Nice work. ${tip}` };
  return { correct: true, feedback: "Nice work!" };
}

export function validatePresentSimpleYesNoQuestion(tokens: string[]): Validation {
  const guard = requireSentence(tokens, "Build a question using the tiles.");
  if (guard) return guard;

  const text = tokens.join(" ").trim();
  const words = tokens.map(w => w.toLowerCase());
  const helper = words[0];

  if (helper !== "do" && helper !== "does") {
    return { correct: false, feedback: "Start the question with do or does." };
  }
  if (tokens.length < 3) {
    return { correct: false, feedback: "Add a subject and a base verb after do or does." };
  }

  const subject = words[1];
  if (!SUBJECTS.includes(subject)) {
    return { correct: false, feedback: "Use a subject after do or does. Example: Do you play?" };
  }

  const verb = words[2];
  if (helper === "does" && /s$/.test(verb)) {
    return { correct: false, feedback: "After does, use the base verb. Example: Does she play?" };
  }

  const tip = writingTip(text, "question");
  if (tip) return { correct: true, feedback: `Good question. ${tip}` };
  return { correct: true, feedback: "Good question!" };
}

export function validatePresentSimpleWhQuestion(tokens: string[]): Validation {
  const guard = requireSentence(tokens, "Build a WH question using the tiles.");
  if (guard) return guard;

  const text = tokens.join(" ").trim();
  const words = tokens.map(w => w.toLowerCase());

  const wh = words[0];
  if (!QUESTION_WORDS.includes(wh)) {
    return { correct: false, feedback: "Begin with a question word such as what or where." };
  }
  if (tokens.length < 4) {
    return { correct: false, feedback: "After the question word, use do or does, then the subject and base verb." };
  }

  const helper = words[1];
  if (helper !== "do" && helper !== "does") {
    return { correct: false, feedback: "Use do or does after the question word." };
  }

  const subject = words[2];
  if (!SUBJECTS.includes(subject)) {
    return { correct: false, feedback: "Add a subject after do or does. Example: Where does he eat?" };
  }

  const tip = writingTip(text, "question");
  if (tip) return { correct: true, feedback: `Nice question. ${tip}` };
  return { correct: true, feedback: "Nice question!" };
}

export function validateBeAffirmative(tokens: string[]): Validation {
  const guard = requireSentence(tokens);
  if (guard) return guard;

  const text = tokens.join(" ").trim();
  const words = tokens.map(w => w.toLowerCase());

  if (!SUBJECTS.includes(words[0])) {
    return { correct: false, feedback: "Begin with a subject like I, you, he, she." };
  }
  if (!BE_FORMS.includes(words[1] || "")) {
    return { correct: false, feedback: "Use am, is, or are after the subject." };
  }
  if (tokens.length < 3) {
    return { correct: false, feedback: "Add a complement after the verb. Example: I am happy." };
  }

  const tip = writingTip(text, "statement");
  if (tip) return { correct: true, feedback: `Looks good. ${tip}` };
  return { correct: true, feedback: "Looks good!" };
}

export function validateBeNegative(tokens: string[]): Validation {
  const guard = requireSentence(tokens);
  if (guard) return guard;

  const text = tokens.join(" ").trim();
  const words = tokens.map(w => w.toLowerCase());

  if (!SUBJECTS.includes(words[0])) {
    return { correct: false, feedback: "Begin with a subject like I, you, he, she." };
  }

  const be = words[1];
  if (!BE_FORMS.includes(be || "")) {
    return { correct: false, feedback: "Use am, is, or are after the subject." };
  }

  if (words[2] !== "not") {
    return { correct: false, feedback: "Place not after the be verb. Example: She is not ready." };
  }

  if (tokens.length < 4) {
    return { correct: false, feedback: "Add a complement after not. Example: We are not tired." };
  }

  const tip = writingTip(text, "statement");
  if (tip) return { correct: true, feedback: `Nice work. ${tip}` };
  return { correct: true, feedback: "Nice work!" };
}

export function validatePastAffirmative(tokens: string[]): Validation {
  const guard = requireSentence(tokens);
  if (guard) return guard;

  const text = tokens.join(" ").trim();
  const words = tokens.map(w => w.toLowerCase());

  const hasSubject = words.some(w => SUBJECTS.includes(w));
  const hasPastVerb = words.some(w => PAST_VERBS.has(w) || /ed$/.test(w));

  if (!hasSubject || !hasPastVerb) {
    return { correct: false, feedback: "Use a subject and a past tense verb like played, watched, went." };
  }

  const tip = writingTip(text, "statement");
  if (tip) return { correct: true, feedback: `Good sentence. ${tip}` };
  return { correct: true, feedback: "Good sentence!" };
}

export function validatePastNegative(tokens: string[]): Validation {
  const guard = requireSentence(tokens);
  if (guard) return guard;

  const text = tokens.join(" ").trim();
  const words = tokens.map(w => w.toLowerCase());

  const didIndex = words.indexOf("did");
  const notIndex = words.indexOf("not");

  if (didIndex === -1 || notIndex !== didIndex + 1) {
    return { correct: false, feedback: "Use did not together before the base verb. Example: I did not play." };
  }

  const baseVerb = words[notIndex + 1];
  if (!baseVerb) {
    return { correct: false, feedback: "Add a base verb after did not, such as play or go." };
  }
  if (/ed$/.test(baseVerb) || PAST_VERBS.has(baseVerb)) {
    return { correct: false, feedback: "After did not, use the base form like play or go." };
  }

  const tip = writingTip(text, "statement");
  if (tip) return { correct: true, feedback: `Nice sentence. ${tip}` };
  return { correct: true, feedback: "Nice sentence!" };
}

export function validatePastQuestion(tokens: string[]): Validation {
  const guard = requireSentence(tokens, "Build a question using the tiles.");
  if (guard) return guard;

  const text = tokens.join(" ").trim();
  const words = tokens.map(w => w.toLowerCase());

  if (words[0] !== "did") {
    return { correct: false, feedback: "Start the question with did." };
  }
  if (!SUBJECTS.includes(words[1] || "")) {
    return { correct: false, feedback: "Use a subject right after did. Example: Did you play?" };
  }
  const baseVerb = words[2];
  if (!baseVerb) {
    return { correct: false, feedback: "Add a base verb after the subject, such as play or go." };
  }
  if (/ed$/.test(baseVerb) || PAST_VERBS.has(baseVerb)) {
    return { correct: false, feedback: "After did, use the base verb like play or watch." };
  }

  const tip = writingTip(text, "question");
  if (tip) return { correct: true, feedback: `Nice question. ${tip}` };
  return { correct: true, feedback: "Nice question!" };
}

export function validateByContext(tokens: string[], ctx: ValidatorContext): Validation {
  switch (ctx.patternId) {
    case "ps_negative":
      return validatePresentSimpleNegative(tokens);
    case "ps_yes_no_question":
      return validatePresentSimpleYesNoQuestion(tokens);
    case "ps_wh_question":
      return validatePresentSimpleWhQuestion(tokens);
    case "be_affirmative":
      return validateBeAffirmative(tokens);
    case "be_negative":
      return validateBeNegative(tokens);
    case "past_affirmative":
      return validatePastAffirmative(tokens);
    case "past_negative":
      return validatePastNegative(tokens);
    case "past_question":
      return validatePastQuestion(tokens);
    case "ps_affirmative":
    default:
      return validatePresentSimpleAffirmative(tokens);
  }
}
