// Script to update all level explanations to be more student-friendly
const fs = require('fs');
const path = require('path');

const levelsPath = path.join(__dirname, '../src/data/comprehensiveLevels45.js');
let content = fs.readFileSync(levelsPath, 'utf8');

// Define explanation updates for key levels
const explanationUpdates = {
  5: '**Be Verbs:**\n• **"am"** with: I\n• **"is"** with: he, she, it\n• **"are"** with: you, we, they\n• Use **adjectives** or **noun phrases** after be',
  6: '**Negative Be:**\n• **"am not"** with: I\n• **"isn\'t"** with: he, she, it\n• **"aren\'t"** with: you, we, they\n• Add **"not"** after be verb',
  7: '**Past Simple:**\n• Use **V2 (past form)** with all subjects\n• **Regular verbs:** add -ed (played, watched)\n• **Irregular verbs:** special forms (went, ate, saw)\n• Add **time markers** (yesterday, last week)',
  8: '**Past Negative:**\n• Use **"didn\'t"** with all subjects\n• Always use **V1 (base form)** after didn\'t\n• Add **time markers** (yesterday, last week)',
  9: '**Time Prepositions:**\n• **"at"** for specific times (at 3pm, at night)\n• **"on"** for days (on Monday, on weekends)\n• **"in"** for periods (in the morning, in 2024)',
  10: '**Frequency Adverbs:**\n• **Always, usually, often** before the verb\n• **Sometimes, rarely, never** before the verb\n• **Every day, once a week** at the end',
  11: '**Frequency Expressions:**\n• **Once, twice, three times** + period\n• **Every day, every week, every month**\n• Place at the **end** of the sentence',
  12: '**Zero Conditional:**\n• **If + present simple, present simple**\n• Used for **general truths** and **facts**\n• **"If"** means "when" or "whenever"',
  13: '**Past Simple:**\n• Use **V2 (past form)** with all subjects\n• **Regular verbs:** add -ed (played, watched)\n• **Irregular verbs:** special forms (went, ate, saw)',
  14: '**Past Negative:**\n• Use **"didn\'t"** with all subjects\n• Always use **V1 (base form)** after didn\'t\n• **"Didn\'t"** = did not',
  15: '**Past Questions:**\n• Start with **"Did"** + subject + V1\n• Use **V1 (base form)** after Did\n• Add **"?"** at the end',
  16: '**Past Continuous:**\n• **"was"** with: I, he, she, it\n• **"were"** with: you, we, they\n• Add **"-ing"** to the verb\n• Use for **ongoing past actions**',
  17: '**Passive Voice:**\n• **"was"** with: I, he, she, it\n• **"were"** with: you, we, they\n• Use **V3 (past participle)**\n• Object becomes the subject',
  18: '**Present Perfect:**\n• **"have"** with: I, you, we, they\n• **"has"** with: he, she, it\n• Use **V3 (past participle)**\n• For **completed actions** with present relevance',
  19: '**Present Perfect Experience:**\n• **"Have/Has + ever"** for life experiences\n• Use **V3 (past participle)**\n• **"Ever"** means "at any time in life"\n• Answer with **"Yes, I have"** or **"No, I haven\'t"**',
  20: '**Present Perfect Recent:**\n• **"just"** = very recently\n• **"already"** = sooner than expected\n• **"recently"** = not long ago\n• Use **V3 (past participle)**',
  21: '**Present Perfect Duration:**\n• **"for"** + period (for 2 years, for a long time)\n• **"since"** + point in time (since 2020, since Monday)\n• Use **V3 (past participle)**',
  22: '**Present Perfect vs Past:**\n• **Finished time** = Past Simple (yesterday, last week)\n• **Unfinished time** = Present Perfect (today, this week)\n• **Time markers** decide which tense to use',
  23: '**Present Perfect Yet/Still:**\n• **"Yet"** = not finished (in questions/negatives)\n• **"Still"** = continuing (in affirmatives)\n• Use **V3 (past participle)**',
  24: '**Present Perfect Mixed:**\n• **Experience:** Have you ever...?\n• **Recent:** I\'ve just...\n• **Duration:** I\'ve lived here for...\n• **Completion:** I haven\'t finished yet',
  25: '**Going To Future:**\n• **"am/is/are going to"** + V1\n• For **plans** and **intentions**\n• **"Going to"** = planning to do something',
  26: '**Will Future:**\n• **"will"** + V1 with all subjects\n• For **predictions** and **decisions**\n• **"Will"** = future certainty',
  27: '**First Conditional:**\n• **If + present simple, will + V1**\n• For **real future possibilities**\n• **"If"** = when this happens',
  28: '**Future Continuous:**\n• **"will be"** + V1-ing\n• For **ongoing future actions**\n• **"Will be doing"** = in progress at future time',
  29: '**Future Perfect:**\n• **"will have"** + V3\n• For **completed future actions**\n• **"Will have done"** = finished by future time',
  30: '**Modal Verbs:**\n• **"can"** = ability (I can swim)\n• **"should"** = advice (You should study)\n• **"must"** = necessity (I must go)\n• Use **V1 (base form)** after modals',
  31: '**Used To Family:**\n• **"used to"** = past habits (I used to smoke)\n• **"be used to"** = accustomed to (I\'m used to it)\n• **"get used to"** = become accustomed (I\'m getting used to it)',
  32: '**Obligation:**\n• **"have to"** = external obligation (I have to work)\n• **"must"** = personal obligation (I must study)\n• **"have to"** changes with tense, **"must"** doesn\'t',
  33: '**Gerunds & Infinitives:**\n• **Gerund (-ing):** enjoy doing, stop doing\n• **Infinitive (to V1):** want to do, need to do\n• Some verbs take both with different meanings',
  34: '**Preferences:**\n• **"prefer"** + gerund or infinitive\n• **"would rather"** + V1\n• **"would prefer"** + infinitive\n• Express what you like better',
  35: '**Permission & Requests:**\n• **"Can I...?"** = informal permission\n• **"Could I...?"** = polite permission\n• **"May I...?"** = formal permission\n• All mean "Is it okay if I...?"',
  36: '**Imperatives:**\n• **V1** for commands (Sit down!)\n• **Don\'t + V1** for negative commands (Don\'t run!)\n• **No subject** needed\n• Use **"!"** for emphasis',
  37: '**Let\'s Suggestions:**\n• **"Let\'s"** = let us (suggestion)\n• **"Let\'s + V1"** (Let\'s go!)\n• **"Let\'s not + V1"** (Let\'s not be late)\n• **"Let\'s"** = "Why don\'t we...?"',
  38: '**Casual Suggestions:**\n• **"How about...?"** + gerund/noun\n• **"What about...?"** + gerund/noun\n• **"Why don\'t we...?"** + V1\n• All mean "What do you think about...?"',
  39: '**Comparatives:**\n• **Short adjectives:** add -er (bigger, faster)\n• **Long adjectives:** more + adjective (more beautiful)\n• **"than"** for comparison (bigger than)\n• **"as...as"** for equality (as big as)',
  40: '**Superlatives:**\n• **Short adjectives:** add -est (biggest, fastest)\n• **Long adjectives:** most + adjective (most beautiful)\n• **"the"** before superlative (the biggest)\n• **"in"** for place (the biggest in the world)',
  41: '**Indefinite Pronouns:**\n• **"someone, anyone, everyone"** = people\n• **"something, anything, everything"** = things\n• **"somewhere, anywhere, everywhere"** = places\n• Use with **singular verbs**',
  42: '**Mixed Comparisons:**\n• **Comparatives:** -er than, more...than\n• **Superlatives:** the -est, the most...\n• **Equality:** as...as\n• **Practice all forms together**',
  43: '**Tag Questions:**\n• **Positive statement + negative tag**\n• **Negative statement + positive tag**\n• **"isn\'t it?"** "don\'t you?" "won\'t they?"\n• **Rising intonation** for real questions',
  44: '**Second Conditional:**\n• **If + past simple, would + V1**\n• For **unreal present/future** situations\n• **"If I were you"** (not "if I was you")\n• **"Would"** = hypothetical result',
  45: '**Third Conditional:**\n• **If + past perfect, would have + V3**\n• For **unreal past** situations\n• **"If I had known"** (past perfect)\n• **"I would have gone"** (would have + V3)',
  46: '**Phrasal Verbs:**\n• **Verb + particle** (look up, turn off)\n• **Separable:** look it up, turn it off\n• **Inseparable:** look after, get over\n• **Learn as complete units**',
  47: '**Reported Speech:**\n• **"He said (that)..."** + reported clause\n• **Backshift tenses:** present → past\n• **"I am tired"** → "He said he was tired"\n• **"That"** is often optional'
};

// Apply updates
Object.entries(explanationUpdates).forEach(([levelId, newExplanation]) => {
  const pattern = new RegExp(`(id:\\s*${levelId},[\\s\\S]*?explanation:\\s*['"\`])([^'"\`]+)(['"\`])`, 'g');
  content = content.replace(pattern, `$1${newExplanation}$3`);
});

// Write updated content
fs.writeFileSync(levelsPath, content, 'utf8');

console.log('✅ Updated all level explanations to be more student-friendly!');
console.log('📝 Key improvements:');
console.log('  • Bullet points for easy scanning');
console.log('  • Bold text for important rules');
console.log('  • Concise, clear language');
console.log('  • Examples in parentheses');
console.log('  • Visual hierarchy with line breaks');
