-- Comprehensive Sentence Builder Game Backend Schema
-- Designed for extensive rules, questions, and adaptive learning

-- ================================
-- BASIC USER SYSTEM (Optional for free play)
-- ================================

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE,
    username VARCHAR(50) UNIQUE,
    role VARCHAR(20) DEFAULT 'student' CHECK (role IN ('student', 'teacher', 'admin')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true
);

-- ================================
-- GRAMMAR SYSTEM
-- ================================

CREATE TABLE grammar_categories (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    color_scheme VARCHAR(50),
    order_index INTEGER NOT NULL,
    unlock_requirement INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE grammar_levels (
    id INTEGER PRIMARY KEY,
    category_id VARCHAR(50) REFERENCES grammar_categories(id),
    name VARCHAR(100) NOT NULL,
    short_description TEXT,
    explanation TEXT NOT NULL,
    formula VARCHAR(100),
    pattern VARCHAR(200),
    example VARCHAR(200),
    difficulty VARCHAR(20) CHECK (difficulty IN ('beginner', 'elementary', 'intermediate', 'advanced')),
    points INTEGER DEFAULT 10,
    unlock_requirement INTEGER DEFAULT 0,
    required_categories TEXT[],
    time_expressions TEXT[],
    order_index INTEGER NOT NULL,
    is_challenging BOOLEAN DEFAULT false,
    is_critical BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE grammar_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    level_id INTEGER REFERENCES grammar_levels(id),
    rule_type VARCHAR(50) NOT NULL, -- 'verb_form', 'subject_verb_agreement', 'article_usage', etc.
    rule_name VARCHAR(100) NOT NULL,
    conditions JSONB NOT NULL, -- Complex conditions for rule application
    validation_logic JSONB NOT NULL, -- How to validate this rule
    error_messages JSONB NOT NULL, -- Specific error messages for different scenarios
    examples TEXT[],
    priority INTEGER DEFAULT 1, -- Higher priority rules are checked first
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ================================
-- VOCABULARY & WORDS
-- ================================

CREATE TABLE word_categories (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    grammatical_type VARCHAR(50), -- 'noun', 'verb', 'adjective', etc.
    is_toggleable BOOLEAN DEFAULT false,
    toggle_type VARCHAR(50), -- 'singular_plural', 'base_third_person', etc.
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE vocabulary_words (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    word VARCHAR(100) NOT NULL,
    category_id VARCHAR(50) REFERENCES word_categories(id),
    pos VARCHAR(50) NOT NULL, -- Part of speech
    difficulty_level VARCHAR(20) CHECK (difficulty_level IN ('beginner', 'elementary', 'intermediate', 'advanced')),
    frequency_rank INTEGER, -- How common this word is (1 = most common)

    -- Word forms for different grammatical contexts
    base_form VARCHAR(100),
    third_person_form VARCHAR(100),
    past_form VARCHAR(100),
    past_participle VARCHAR(100),
    present_participle VARCHAR(100),
    plural_form VARCHAR(100),

    -- Usage information
    usage_notes TEXT,
    example_sentences TEXT[],
    collocations TEXT[], -- Words that commonly go together

    -- Metadata
    is_irregular BOOLEAN DEFAULT false,
    is_countable BOOLEAN DEFAULT true,
    requires_article BOOLEAN DEFAULT false,
    article_type VARCHAR(20), -- 'definite', 'indefinite', 'zero'

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ================================
-- QUESTIONS & EXERCISES
-- ================================

CREATE TABLE question_types (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    template JSONB NOT NULL, -- Template for generating questions
    validation_rules JSONB NOT NULL,
    scoring_rules JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type_id VARCHAR(50) REFERENCES question_types(id),
    level_id INTEGER REFERENCES grammar_levels(id),
    category_id VARCHAR(50) REFERENCES grammar_categories(id),

    -- Question content
    instruction TEXT NOT NULL,
    prompt TEXT,
    context TEXT, -- Background information or scenario

    -- Expected answer structure
    expected_pattern VARCHAR(200),
    required_words TEXT[],
    forbidden_words TEXT[],
    word_categories_needed TEXT[],

    -- Multiple correct answers support
    correct_answers JSONB NOT NULL, -- Array of acceptable answers
    partial_credit_answers JSONB, -- Answers that get partial credit

    -- Difficulty and targeting
    difficulty VARCHAR(20) CHECK (difficulty IN ('beginner', 'elementary', 'intermediate', 'advanced')),
    target_skills TEXT[], -- Skills this question tests
    prerequisite_skills TEXT[], -- Skills needed to answer this

    -- Adaptive learning
    estimated_difficulty NUMERIC(3,2), -- 0.0 to 1.0
    discrimination_power NUMERIC(3,2), -- How well it separates skill levels

    -- Metadata
    tags TEXT[],
    author_id UUID REFERENCES users(id),
    times_used INTEGER DEFAULT 0,
    times_correct INTEGER DEFAULT 0,
    average_time_seconds NUMERIC(5,2),

    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE question_hints (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question_id UUID REFERENCES questions(id) ON DELETE CASCADE,
    hint_text TEXT NOT NULL,
    hint_order INTEGER NOT NULL,
    unlock_condition VARCHAR(50) DEFAULT 'time_based', -- 'time_based', 'attempts_based', 'always_available'
    unlock_value INTEGER DEFAULT 30, -- seconds or attempts before hint is available
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ================================
-- OPTIONAL ANALYTICS (for future use)
-- ================================

-- These tables can be used later if analytics are needed
-- For now, users can play freely without tracking

-- ================================
-- OPTIONAL ADAPTIVE LEARNING (for future use)
-- ================================

-- These tables can be used later if adaptive learning is implemented
-- For now, users can play freely with standard difficulty

-- ================================
-- CONTENT MANAGEMENT
-- ================================

CREATE TABLE content_collections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    type VARCHAR(50) NOT NULL, -- 'lesson_plan', 'quiz_set', 'practice_session', 'assessment'
    target_audience VARCHAR(50),
    estimated_duration_minutes INTEGER,
    difficulty_range VARCHAR(50), -- 'beginner-elementary', 'intermediate-advanced', etc.

    -- Content references
    question_ids UUID[],
    level_ids INTEGER[],
    required_skills TEXT[],
    learning_objectives TEXT[],

    -- Metadata
    author_id UUID REFERENCES users(id),
    is_public BOOLEAN DEFAULT false,
    usage_count INTEGER DEFAULT 0,
    rating NUMERIC(2,1), -- 1.0 to 5.0
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ================================
-- OPTIONAL GAMIFICATION (for future use)
-- ================================

-- These tables can be used later if achievements are implemented
-- For now, users can play freely without gamification

-- ================================
-- INDEXES FOR PERFORMANCE
-- ================================

-- User-related indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX idx_user_progress_last_activity ON user_progress(last_activity);

-- Grammar system indexes
CREATE INDEX idx_grammar_levels_category ON grammar_levels(category_id);
CREATE INDEX idx_grammar_levels_difficulty ON grammar_levels(difficulty);
CREATE INDEX idx_grammar_rules_level ON grammar_rules(level_id);
CREATE INDEX idx_grammar_rules_type ON grammar_rules(rule_type);

-- Vocabulary indexes
CREATE INDEX idx_vocabulary_category ON vocabulary_words(category_id);
CREATE INDEX idx_vocabulary_difficulty ON vocabulary_words(difficulty_level);
CREATE INDEX idx_vocabulary_frequency ON vocabulary_words(frequency_rank);
CREATE INDEX idx_vocabulary_pos ON vocabulary_words(pos);

-- Question system indexes
CREATE INDEX idx_questions_type ON questions(type_id);
CREATE INDEX idx_questions_level ON questions(level_id);
CREATE INDEX idx_questions_category ON questions(category_id);
CREATE INDEX idx_questions_difficulty ON questions(difficulty);
CREATE INDEX idx_questions_active ON questions(is_active);

-- Analytics indexes
CREATE INDEX idx_question_attempts_user ON question_attempts(user_id);
CREATE INDEX idx_question_attempts_question ON question_attempts(question_id);
CREATE INDEX idx_question_attempts_session ON question_attempts(session_id);
CREATE INDEX idx_question_attempts_time ON question_attempts(submitted_at);
CREATE INDEX idx_learning_analytics_user ON learning_analytics(user_id);
CREATE INDEX idx_learning_analytics_metric ON learning_analytics(metric_name);

-- Performance indexes
CREATE INDEX idx_skill_assessments_user_skill ON skill_assessments(user_id, skill_name);
CREATE INDEX idx_user_achievements_user ON user_achievements(user_id);

-- ================================
-- GRAMMAR RULES MIGRATION
-- ================================

-- Insert comprehensive grammar rules for all 47 levels
INSERT INTO grammar_rules (level_id, rule_type, rule_name, conditions, validation_logic, error_messages, examples, priority) VALUES

-- Level 1: Basic SVO Order
(1, 'word-order', 'Basic SVO Order', '{"required_elements": ["subject", "verb", "object"], "strict_order": true}',
 '{"check_order": true, "allow_flexibility": false}', '{"wrong_order": "Remember: Subject + Verb + Object order in English", "object_first": "Object should come after subject and verb"}',
 ARRAY['"I eat pizza" - Subject (I) + Verb (eat) + Object (pizza)'], 10),

(1, 'subject-verb-agreement', 'Present Simple Agreement', '{"tense": "present", "required_agreement": true}',
 '{"third_person_s": true, "pronoun_check": true}', '{"missing_s": "Use -s with he/she/it: he eats, she likes, it works", "wrong_form": "Use base form with I/you/we/they: I eat, you like, we work"}',
 ARRAY['"I eat" (no -s)', '"he eats" (with -s)', '"she likes" (with -s)'], 8),

-- Level 2: Articles
(2, 'article-usage', 'Article Rules', '{"requires_article": true, "article_types": ["definite", "indefinite"]}',
 '{"countable_check": true, "vowel_check": true}', '{"missing_article": "Add a/an before singular countable nouns", "wrong_article": "Use \"a\" before consonant sounds, \"an\" before vowel sounds"}',
 ARRAY['"I eat a sandwich" (consonant sound)', '"She drinks an orange" (vowel sound)'], 9),

-- Level 3: Negatives
(3, 'negation', 'Negative Structure', '{"is_negative": true, "required_auxiliary": true}',
 '{"do_support": true, "not_placement": true}', '{"missing_do": "Use do/does + not + base verb for negatives", "wrong_order": "Remember: don''t/doesn''t + base verb"}',
 ARRAY['"I don''t like pizza"', '"She doesn''t eat meat"'], 8),

-- Level 4: Questions
(4, 'question-formation', 'Yes/No Questions', '{"is_question": true, "question_type": "yes_no"}',
 '{"auxiliary_first": true, "subject_after_aux": true}', '{"missing_do": "Questions need do/does at the beginning", "wrong_order": "Do/Does + subject + base verb"}',
 ARRAY['"Do you like pizza?"', '"Does she eat breakfast?"'], 9),

-- Level 5: Wh-Questions
(5, 'question-formation', 'Wh-Questions', '{"is_question": true, "question_type": "wh", "wh_word": "what"}',
 '{"wh_first": true, "auxiliary_second": true}', '{"wrong_wh_position": "Question words (what/who/where) go at the beginning", "missing_aux": "Use do/does after wh-word"}',
 ARRAY['"What do you eat?"', '"What does she study?"'], 9),

-- Level 7: Present Continuous
(7, 'tense-consistency', 'Present Continuous', '{"tense": "continuous", "required_be_verb": true}',
 '{"ing_form": true, "be_verb_present": true}', '{"missing_be": "Use am/is/are + verb-ing for ongoing actions", "wrong_form": "Add -ing to the main verb"}',
 ARRAY['"I am eating lunch"', '"She is studying English"'], 8),

-- Level 8: Continuous Questions
(8, 'question-formation', 'Continuous Questions', '{"tense": "continuous", "is_question": true}',
 '{"wh_first": true, "be_verb_second": true}', '{"wrong_structure": "What + are/is + subject + verb-ing?", "missing_ing": "Add -ing to the main verb"}',
 ARRAY['"What are you doing?"', '"Where is she going?"'], 9),

-- Level 13: Past Simple
(13, 'verb-form', 'Past Simple Forms', '{"tense": "past", "required_v2": true}',
 '{"regular_ed": true, "irregular_forms": true}', '{"wrong_form": "Use past tense: add -ed for regular verbs, special forms for irregular", "missing_ed": "Regular verbs need -ed: worked, played, studied"}',
 ARRAY['"I ate pizza yesterday"', '"She went home early"'], 8),

-- Level 14: Past Negative
(14, 'negation', 'Past Negative', '{"tense": "past", "is_negative": true}',
 '{"did_not": true, "base_verb": true}', '{"wrong_did": "Use didn''t + base verb (not past form)", "missing_did": "Past negatives need didn''t + base verb"}',
 ARRAY['"I didn''t go yesterday"', '"She didn''t eat lunch"'], 8),

-- Level 15: Past Questions
(15, 'question-formation', 'Past Questions', '{"tense": "past", "is_question": true}',
 '{"did_first": true, "base_verb": true}', '{"wrong_structure": "Did + subject + base verb?", "missing_did": "Past questions need ''Did'' at the beginning"}',
 ARRAY['"Did you see the movie?"', '"Did she finish homework?"'], 9),

-- Level 18: Present Perfect
(18, 'verb-form', 'Present Perfect Forms', '{"tense": "perfect", "required_have": true}',
 '{"have_has": true, "past_participle": true}', '{"wrong_aux": "Use have/has + past participle (V3)", "missing_have": "Present perfect needs have/has + V3"}',
 ARRAY['"I have visited Paris"', '"She has finished work"'], 8),

-- Level 19: Present Perfect Experience
(19, 'question-formation', 'Perfect Questions', '{"tense": "perfect", "is_question": true, "experience_words": true}',
 '{"have_first": true, "ever_usage": true}', '{"wrong_structure": "Have/Has + subject + ever + V3?", "missing_ever": "Use ''ever'' in experience questions"}',
 ARRAY['"Have you ever been to Japan?"', '"Has she ever seen snow?"'], 9),

-- Level 25: Going to Future
(25, 'tense-consistency', 'Going to Future', '{"tense": "future", "required_going_to": true}',
 '{"be_going_to": true, "base_verb": true}', '{"wrong_structure": "Use am/is/are + going to + base verb", "missing_going": "Future plans need ''going to''"}',
 ARRAY['"I am going to study tonight"', '"It is going to rain soon"'], 8),

-- Level 26: Will Future
(26, 'tense-consistency', 'Will Future', '{"tense": "future", "required_will": true}',
 '{"will_first": true, "base_verb": true}', '{"wrong_structure": "Use will + base verb for predictions", "missing_will": "Future predictions need ''will''"}',
 ARRAY['"I will help you tomorrow"', '"She will arrive at 6 PM"'], 8),

-- Level 31: Can for Ability
(31, 'modal-verbs', 'Can for Ability', '{"modal": "can", "ability_context": true}',
 '{"can_first": true, "base_verb": true}', '{"wrong_modal": "Use ''can'' + base verb for ability", "missing_can": "Ability sentences need ''can''"}',
 ARRAY['"I can speak three languages"', '"Can you drive a car?"'], 8),

-- Level 32: Should for Advice
(32, 'modal-verbs', 'Should for Advice', '{"modal": "should", "advice_context": true}',
 '{"should_first": true, "base_verb": true}', '{"wrong_modal": "Use ''should'' + base verb for advice", "missing_should": "Advice sentences need ''should''"}',
 ARRAY['"You should exercise more often"', '"Should I call the doctor?"'], 8),

-- Level 33: Must for Obligation
(33, 'modal-verbs', 'Must for Obligation', '{"modal": "must", "obligation_context": true}',
 '{"must_first": true, "base_verb": true}', '{"wrong_modal": "Use ''must'' + base verb for obligation", "missing_must": "Obligation sentences need ''must''"}',
 ARRAY['"You must wear a seatbelt"', '"Students must attend all classes"'], 8);

-- ================================
-- SAMPLE DATA INSERTS
-- ================================

-- Insert sample grammar categories
INSERT INTO grammar_categories (id, name, description, icon, color_scheme, order_index) VALUES
('present-basics', 'Present Tense Basics', 'Foundation present tense structures', 'play', 'green', 1),
('time-expressions', 'Time & Expressions', 'Time concepts and preposition usage', 'clock', 'yellow', 2),
('past-tense', 'Past Tense', 'Complete past tense mastery', 'history', 'red', 3),
('present-perfect', 'Present Perfect', 'Present perfect in all its forms', 'trending-up', 'purple', 4),
('future-tense', 'Future Tenses', 'Plans, predictions, and future structures', 'arrow-right', 'blue', 5),
('modals', 'Modal Verbs', 'Can, should, must, used to family', 'shield', 'orange', 6),
('commands', 'Commands & Suggestions', 'Imperatives and polite suggestions', 'command', 'brown', 7),
('comparisons', 'Comparisons', 'Comparative and superlative forms', 'bar-chart', 'gray', 8),
('advanced', 'Advanced Structures', 'Tag questions, conditionals, phrasal verbs', 'star', 'rainbow', 9);

-- Insert sample question types
INSERT INTO question_types (id, name, description, template, validation_rules, scoring_rules) VALUES
('sentence-building', 'Sentence Building', 'Build sentences using word tiles',
 '{"type": "tile_selection", "instruction_template": "Build a sentence using the words below", "required_elements": ["subject", "verb", "object"]}',
 '{"grammar_check": true, "word_order": true, "completeness": true}',
 '{"full_credit": 1.0, "partial_credit_threshold": 0.7, "grammar_weight": 0.6, "completeness_weight": 0.4}'
),
('multiple-choice', 'Multiple Choice', 'Choose the correct answer from options',
 '{"type": "single_select", "options_count": 4, "distractor_generation": "automatic"}',
 '{"exact_match": true}',
 '{"correct": 1.0, "incorrect": 0.0}'
),
('fill-in-blank', 'Fill in the Blank', 'Complete sentences with missing words',
 '{"type": "text_input", "blank_markers": ["___", "[blank]"], "case_sensitive": false}',
 '{"exact_match": false, "fuzzy_matching": true, "synonym_acceptance": true}',
 '{"exact_match": 1.0, "close_match": 0.8, "partial_match": 0.5}'
),
('drag-and-drop', 'Drag and Drop', 'Arrange words or phrases in correct order',
 '{"type": "ordering", "shuffle_items": true, "visual_feedback": true}',
 '{"order_accuracy": true, "position_scoring": true}',
 '{"perfect_order": 1.0, "minor_errors": 0.8, "major_errors": 0.5}'
);

-- Sample achievements removed for free play
-- These can be added back later if gamification is implemented

-- ================================
-- FUNCTIONS FOR COMMON OPERATIONS
-- ================================

-- Basic user functions (no progress tracking for free play)
-- These can be extended later if user accounts are implemented