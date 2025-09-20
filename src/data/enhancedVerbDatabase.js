// Enhanced Verb Database - Phase 2 Implementation
// Comprehensive verb system with all forms and difficulty levels

export const enhancedVerbDatabase = {
  
  // High-frequency verbs for beginners (Levels 1-8)
  beginner: [
    {
      V1: 'be', V1_3rd: 'is', V1_ing: 'being', V2: 'was/were', V3: 'been',
      type: 'irregular', frequency: 'very_high', difficulty: 'beginner',
      meaning: 'to exist or have a particular quality',
      examples: ['I am happy', 'She is a teacher', 'They were here']
    },
    {
      V1: 'have', V1_3rd: 'has', V1_ing: 'having', V2: 'had', V3: 'had',
      type: 'irregular', frequency: 'very_high', difficulty: 'beginner',
      meaning: 'to possess or own something',
      examples: ['I have a car', 'She has two cats', 'We had dinner']
    },
    {
      V1: 'do', V1_3rd: 'does', V1_ing: 'doing', V2: 'did', V3: 'done',
      type: 'irregular', frequency: 'very_high', difficulty: 'beginner',
      meaning: 'to perform an action or activity',
      examples: ['I do homework', 'She does yoga', 'They did well']
    },
    {
      V1: 'go', V1_3rd: 'goes', V1_ing: 'going', V2: 'went', V3: 'gone',
      type: 'irregular', frequency: 'very_high', difficulty: 'beginner',
      meaning: 'to move from one place to another',
      examples: ['I go to school', 'She goes home', 'We went shopping']
    },
    {
      V1: 'get', V1_3rd: 'gets', V1_ing: 'getting', V2: 'got', V3: 'gotten',
      type: 'irregular', frequency: 'very_high', difficulty: 'beginner',
      meaning: 'to obtain or receive something',
      examples: ['I get up early', 'She gets good grades', 'We got a gift']
    },
    {
      V1: 'make', V1_3rd: 'makes', V1_ing: 'making', V2: 'made', V3: 'made',
      type: 'irregular', frequency: 'very_high', difficulty: 'beginner',
      meaning: 'to create or produce something',
      examples: ['I make coffee', 'She makes dinner', 'They made a cake']
    },
    {
      V1: 'take', V1_3rd: 'takes', V1_ing: 'taking', V2: 'took', V3: 'taken',
      type: 'irregular', frequency: 'very_high', difficulty: 'beginner',
      meaning: 'to get hold of something',
      examples: ['I take the bus', 'She takes photos', 'We took a break']
    },
    {
      V1: 'come', V1_3rd: 'comes', V1_ing: 'coming', V2: 'came', V3: 'come',
      type: 'irregular', frequency: 'very_high', difficulty: 'beginner',
      meaning: 'to move toward the speaker',
      examples: ['I come home', 'She comes early', 'They came yesterday']
    },
    {
      V1: 'see', V1_3rd: 'sees', V1_ing: 'seeing', V2: 'saw', V3: 'seen',
      type: 'irregular', frequency: 'very_high', difficulty: 'beginner',
      meaning: 'to look at with your eyes',
      examples: ['I see you', 'She sees the movie', 'We saw a bird']
    },
    {
      V1: 'know', V1_3rd: 'knows', V1_ing: 'knowing', V2: 'knew', V3: 'known',
      type: 'irregular', frequency: 'very_high', difficulty: 'beginner',
      meaning: 'to have information about something',
      examples: ['I know the answer', 'She knows English', 'We knew him']
    },
    {
      V1: 'want', V1_3rd: 'wants', V1_ing: 'wanting', V2: 'wanted', V3: 'wanted',
      type: 'regular', frequency: 'very_high', difficulty: 'beginner',
      meaning: 'to desire or wish for something',
      examples: ['I want pizza', 'She wants to go', 'They wanted help']
    },
    {
      V1: 'like', V1_3rd: 'likes', V1_ing: 'liking', V2: 'liked', V3: 'liked',
      type: 'regular', frequency: 'very_high', difficulty: 'beginner',
      meaning: 'to enjoy or find pleasant',
      examples: ['I like music', 'She likes cats', 'We liked the movie']
    },
    {
      V1: 'eat', V1_3rd: 'eats', V1_ing: 'eating', V2: 'ate', V3: 'eaten',
      type: 'irregular', frequency: 'high', difficulty: 'beginner',
      meaning: 'to consume food',
      examples: ['I eat breakfast', 'She eats lunch', 'We ate dinner']
    },
    {
      V1: 'drink', V1_3rd: 'drinks', V1_ing: 'drinking', V2: 'drank', V3: 'drunk',
      type: 'irregular', frequency: 'high', difficulty: 'beginner',
      meaning: 'to consume liquid',
      examples: ['I drink water', 'She drinks coffee', 'We drank tea']
    },
    {
      V1: 'sleep', V1_3rd: 'sleeps', V1_ing: 'sleeping', V2: 'slept', V3: 'slept',
      type: 'irregular', frequency: 'high', difficulty: 'beginner',
      meaning: 'to rest with eyes closed',
      examples: ['I sleep well', 'She sleeps late', 'We slept early']
    },
    {
      V1: 'work', V1_3rd: 'works', V1_ing: 'working', V2: 'worked', V3: 'worked',
      type: 'regular', frequency: 'high', difficulty: 'beginner',
      meaning: 'to do a job or task',
      examples: ['I work here', 'She works hard', 'They worked yesterday']
    },
    {
      V1: 'play', V1_3rd: 'plays', V1_ing: 'playing', V2: 'played', V3: 'played',
      type: 'regular', frequency: 'high', difficulty: 'beginner',
      meaning: 'to engage in games or sports',
      examples: ['I play soccer', 'She plays piano', 'We played games']
    },
    {
      V1: 'study', V1_3rd: 'studies', V1_ing: 'studying', V2: 'studied', V3: 'studied',
      type: 'regular', frequency: 'high', difficulty: 'beginner',
      meaning: 'to learn about something',
      examples: ['I study English', 'She studies math', 'We studied hard']
    },
    {
      V1: 'live', V1_3rd: 'lives', V1_ing: 'living', V2: 'lived', V3: 'lived',
      type: 'regular', frequency: 'high', difficulty: 'beginner',
      meaning: 'to have your home in a place',
      examples: ['I live here', 'She lives in Paris', 'They lived in Tokyo']
    },
    {
      V1: 'love', V1_3rd: 'loves', V1_ing: 'loving', V2: 'loved', V3: 'loved',
      type: 'regular', frequency: 'high', difficulty: 'beginner',
      meaning: 'to have strong feelings for someone',
      examples: ['I love you', 'She loves music', 'We loved the show']
    }
  ],

  // Elementary verbs (Levels 9-17)
  elementary: [
    {
      V1: 'think', V1_3rd: 'thinks', V1_ing: 'thinking', V2: 'thought', V3: 'thought',
      type: 'irregular', frequency: 'high', difficulty: 'elementary',
      meaning: 'to use your mind to consider something',
      examples: ['I think so', 'She thinks about it', 'We thought carefully']
    },
    {
      V1: 'feel', V1_3rd: 'feels', V1_ing: 'feeling', V2: 'felt', V3: 'felt',
      type: 'irregular', frequency: 'high', difficulty: 'elementary',
      meaning: 'to experience an emotion',
      examples: ['I feel happy', 'She feels tired', 'We felt excited']
    },
    {
      V1: 'find', V1_3rd: 'finds', V1_ing: 'finding', V2: 'found', V3: 'found',
      type: 'irregular', frequency: 'high', difficulty: 'elementary',
      meaning: 'to discover or locate something',
      examples: ['I find it easy', 'She finds her keys', 'We found the answer']
    },
    {
      V1: 'give', V1_3rd: 'gives', V1_ing: 'giving', V2: 'gave', V3: 'given',
      type: 'irregular', frequency: 'high', difficulty: 'elementary',
      meaning: 'to provide or offer something',
      examples: ['I give help', 'She gives advice', 'We gave presents']
    },
    {
      V1: 'tell', V1_3rd: 'tells', V1_ing: 'telling', V2: 'told', V3: 'told',
      type: 'irregular', frequency: 'high', difficulty: 'elementary',
      meaning: 'to say something to someone',
      examples: ['I tell stories', 'She tells the truth', 'We told him']
    },
    {
      V1: 'say', V1_3rd: 'says', V1_ing: 'saying', V2: 'said', V3: 'said',
      type: 'irregular', frequency: 'high', difficulty: 'elementary',
      meaning: 'to speak words',
      examples: ['I say hello', 'She says yes', 'We said goodbye']
    },
    {
      V1: 'ask', V1_3rd: 'asks', V1_ing: 'asking', V2: 'asked', V3: 'asked',
      type: 'regular', frequency: 'high', difficulty: 'elementary',
      meaning: 'to request information',
      examples: ['I ask questions', 'She asks for help', 'We asked the teacher']
    },
    {
      V1: 'help', V1_3rd: 'helps', V1_ing: 'helping', V2: 'helped', V3: 'helped',
      type: 'regular', frequency: 'high', difficulty: 'elementary',
      meaning: 'to assist someone',
      examples: ['I help you', 'She helps her mom', 'We helped them']
    },
    {
      V1: 'try', V1_3rd: 'tries', V1_ing: 'trying', V2: 'tried', V3: 'tried',
      type: 'regular', frequency: 'high', difficulty: 'elementary',
      meaning: 'to attempt to do something',
      examples: ['I try hard', 'She tries again', 'We tried our best']
    },
    {
      V1: 'use', V1_3rd: 'uses', V1_ing: 'using', V2: 'used', V3: 'used',
      type: 'regular', frequency: 'high', difficulty: 'elementary',
      meaning: 'to employ for a purpose',
      examples: ['I use my phone', 'She uses a computer', 'We used the car']
    },
    {
      V1: 'start', V1_3rd: 'starts', V1_ing: 'starting', V2: 'started', V3: 'started',
      type: 'regular', frequency: 'high', difficulty: 'elementary',
      meaning: 'to begin something',
      examples: ['I start work', 'She starts school', 'We started early']
    },
    {
      V1: 'stop', V1_3rd: 'stops', V1_ing: 'stopping', V2: 'stopped', V3: 'stopped',
      type: 'regular', frequency: 'high', difficulty: 'elementary',
      meaning: 'to cease an activity',
      examples: ['I stop here', 'She stops talking', 'We stopped walking']
    },
    {
      V1: 'finish', V1_3rd: 'finishes', V1_ing: 'finishing', V2: 'finished', V3: 'finished',
      type: 'regular', frequency: 'high', difficulty: 'elementary',
      meaning: 'to complete something',
      examples: ['I finish homework', 'She finishes work', 'We finished dinner']
    },
    {
      V1: 'open', V1_3rd: 'opens', V1_ing: 'opening', V2: 'opened', V3: 'opened',
      type: 'regular', frequency: 'medium', difficulty: 'elementary',
      meaning: 'to make something accessible',
      examples: ['I open the door', 'She opens the book', 'We opened the window']
    },
    {
      V1: 'close', V1_3rd: 'closes', V1_ing: 'closing', V2: 'closed', V3: 'closed',
      type: 'regular', frequency: 'medium', difficulty: 'elementary',
      meaning: 'to shut something',
      examples: ['I close my eyes', 'She closes the store', 'We closed the meeting']
    }
  ],

  // Intermediate verbs (Levels 18-28)
  intermediate: [
    {
      V1: 'understand', V1_3rd: 'understands', V1_ing: 'understanding', V2: 'understood', V3: 'understood',
      type: 'irregular', frequency: 'high', difficulty: 'intermediate',
      meaning: 'to comprehend the meaning',
      examples: ['I understand you', 'She understands math', 'We understood the lesson']
    },
    {
      V1: 'remember', V1_3rd: 'remembers', V1_ing: 'remembering', V2: 'remembered', V3: 'remembered',
      type: 'regular', frequency: 'high', difficulty: 'intermediate',
      meaning: 'to recall from memory',
      examples: ['I remember you', 'She remembers the song', 'We remembered the date']
    },
    {
      V1: 'forget', V1_3rd: 'forgets', V1_ing: 'forgetting', V2: 'forgot', V3: 'forgotten',
      type: 'irregular', frequency: 'high', difficulty: 'intermediate',
      meaning: 'to fail to remember',
      examples: ['I forget names', 'She forgets her keys', 'We forgot the time']
    },
    {
      V1: 'learn', V1_3rd: 'learns', V1_ing: 'learning', V2: 'learned', V3: 'learned',
      type: 'regular', frequency: 'high', difficulty: 'intermediate',
      meaning: 'to acquire knowledge',
      examples: ['I learn English', 'She learns quickly', 'We learned a lot']
    },
    {
      V1: 'teach', V1_3rd: 'teaches', V1_ing: 'teaching', V2: 'taught', V3: 'taught',
      type: 'irregular', frequency: 'medium', difficulty: 'intermediate',
      meaning: 'to instruct someone',
      examples: ['I teach math', 'She teaches children', 'We taught them well']
    },
    {
      V1: 'meet', V1_3rd: 'meets', V1_ing: 'meeting', V2: 'met', V3: 'met',
      type: 'irregular', frequency: 'high', difficulty: 'intermediate',
      meaning: 'to encounter someone',
      examples: ['I meet friends', 'She meets new people', 'We met yesterday']
    },
    {
      V1: 'leave', V1_3rd: 'leaves', V1_ing: 'leaving', V2: 'left', V3: 'left',
      type: 'irregular', frequency: 'high', difficulty: 'intermediate',
      meaning: 'to go away from a place',
      examples: ['I leave home', 'She leaves work', 'We left early']
    },
    {
      V1: 'arrive', V1_3rd: 'arrives', V1_ing: 'arriving', V2: 'arrived', V3: 'arrived',
      type: 'regular', frequency: 'medium', difficulty: 'intermediate',
      meaning: 'to reach a destination',
      examples: ['I arrive on time', 'She arrives late', 'We arrived safely']
    },
    {
      V1: 'travel', V1_3rd: 'travels', V1_ing: 'traveling', V2: 'traveled', V3: 'traveled',
      type: 'regular', frequency: 'medium', difficulty: 'intermediate',
      meaning: 'to go from one place to another',
      examples: ['I travel often', 'She travels for work', 'We traveled to Europe']
    },
    {
      V1: 'visit', V1_3rd: 'visits', V1_ing: 'visiting', V2: 'visited', V3: 'visited',
      type: 'regular', frequency: 'medium', difficulty: 'intermediate',
      meaning: 'to go to see someone or somewhere',
      examples: ['I visit family', 'She visits museums', 'We visited Paris']
    }
  ],

  // Advanced verbs (Levels 29-45)
  advanced: [
    {
      V1: 'achieve', V1_3rd: 'achieves', V1_ing: 'achieving', V2: 'achieved', V3: 'achieved',
      type: 'regular', frequency: 'medium', difficulty: 'advanced',
      meaning: 'to successfully complete something',
      examples: ['I achieve my goals', 'She achieves success', 'We achieved our target']
    },
    {
      V1: 'develop', V1_3rd: 'develops', V1_ing: 'developing', V2: 'developed', V3: 'developed',
      type: 'regular', frequency: 'medium', difficulty: 'advanced',
      meaning: 'to grow or create gradually',
      examples: ['I develop skills', 'She develops software', 'We developed a plan']
    },
    {
      V1: 'improve', V1_3rd: 'improves', V1_ing: 'improving', V2: 'improved', V3: 'improved',
      type: 'regular', frequency: 'medium', difficulty: 'advanced',
      meaning: 'to make or become better',
      examples: ['I improve daily', 'She improves her English', 'We improved the system']
    },
    {
      V1: 'create', V1_3rd: 'creates', V1_ing: 'creating', V2: 'created', V3: 'created',
      type: 'regular', frequency: 'medium', difficulty: 'advanced',
      meaning: 'to bring something into existence',
      examples: ['I create art', 'She creates websites', 'We created a solution']
    },
    {
      V1: 'manage', V1_3rd: 'manages', V1_ing: 'managing', V2: 'managed', V3: 'managed',
      type: 'regular', frequency: 'medium', difficulty: 'advanced',
      meaning: 'to control or organize something',
      examples: ['I manage time', 'She manages a team', 'We managed the project']
    }
  ]
}

// Verb Selection Functions
export class VerbSelector {
  
  // Get verbs by difficulty level
  getVerbsByDifficulty(difficulty) {
    return enhancedVerbDatabase[difficulty] || []
  }
  
  // Get verbs by frequency
  getVerbsByFrequency(frequency) {
    const allVerbs = [
      ...enhancedVerbDatabase.beginner,
      ...enhancedVerbDatabase.elementary,
      ...enhancedVerbDatabase.intermediate,
      ...enhancedVerbDatabase.advanced
    ]
    
    return allVerbs.filter(verb => verb.frequency === frequency)
  }
  
  // Get verbs for specific level
  getVerbsForLevel(levelId) {
    if (levelId <= 8) return this.getVerbsByDifficulty('beginner')
    if (levelId <= 17) return [...this.getVerbsByDifficulty('beginner'), ...this.getVerbsByDifficulty('elementary')]
    if (levelId <= 28) return [...this.getVerbsByDifficulty('beginner'), ...this.getVerbsByDifficulty('elementary'), ...this.getVerbsByDifficulty('intermediate')]
    return Object.values(enhancedVerbDatabase).flat()
  }
  
  // Get irregular verbs only
  getIrregularVerbs() {
    const allVerbs = Object.values(enhancedVerbDatabase).flat()
    return allVerbs.filter(verb => verb.type === 'irregular')
  }
  
  // Get regular verbs only
  getRegularVerbs() {
    const allVerbs = Object.values(enhancedVerbDatabase).flat()
    return allVerbs.filter(verb => verb.type === 'regular')
  }
  
  // Get verb by base form
  getVerbByBase(baseForm) {
    const allVerbs = Object.values(enhancedVerbDatabase).flat()
    return allVerbs.find(verb => verb.V1.toLowerCase() === baseForm.toLowerCase())
  }
  
  // Get all forms of a verb
  getAllForms(baseForm) {
    const verb = this.getVerbByBase(baseForm)
    if (!verb) return null
    
    return {
      V1: verb.V1,
      V1_3rd: verb.V1_3rd,
      V1_ing: verb.V1_ing,
      V2: verb.V2,
      V3: verb.V3,
      type: verb.type,
      examples: verb.examples
    }
  }
  
  // Check if verb is irregular
  isIrregular(baseForm) {
    const verb = this.getVerbByBase(baseForm)
    return verb ? verb.type === 'irregular' : false
  }
  
  // Get appropriate verb form for tense
  getVerbFormForTense(baseForm, tense, subject = null) {
    const verb = this.getVerbByBase(baseForm)
    if (!verb) return baseForm
    
    switch (tense) {
      case 'present':
        return this.isPluralSubject(subject) ? verb.V1 : verb.V1_3rd
      case 'base':
        return verb.V1
      case 'continuous':
        return verb.V1_ing
      case 'past':
        return verb.V2
      case 'perfect':
        return verb.V3
      default:
        return verb.V1
    }
  }
  
  // Check if subject is plural (for subject-verb agreement)
  isPluralSubject(subject) {
    if (!subject) return false
    const pluralSubjects = ['I', 'you', 'we', 'they']
    return pluralSubjects.includes(subject.toLowerCase())
  }
  
  // Get high-frequency verbs for beginners
  getBeginnerVerbs() {
    return this.getVerbsByFrequency('very_high').slice(0, 10)
  }
  
  // Get verbs with examples
  getVerbsWithExamples(difficulty) {
    const verbs = this.getVerbsByDifficulty(difficulty)
    return verbs.map(verb => ({
      ...verb,
      exampleSentences: verb.examples
    }))
  }
}

// Export instances
export const verbSelector = new VerbSelector()

export default enhancedVerbDatabase

