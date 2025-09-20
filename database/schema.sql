-- Comprehensive Sentence Builder Game Backend Schema
-- Designed for extensive rules, questions, and adaptive learning

-- ================================
-- USER MANAGEMENT
-- ================================

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'student' CHECK (role IN ('student', 'teacher', 'admin')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true,

    -- Student Profile
    native_language VARCHAR(50),
    proficiency_level VARCHAR(20) DEFAULT 'beginner' CHECK (proficiency_level IN ('beginner', 'elementary', 'intermediate', 'advanced')),
    learning_goals TEXT[],
    preferred_topics TEXT[]
);

CREATE TABLE user_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    total_xp INTEGER DEFAULT 0,
    current_streak INTEGER DEFAULT 0,
    longest_streak INTEGER DEFAULT 0,
    total_questions_answered INTEGER DEFAULT 0,
    correct_answers INTEGER DEFAULT 0,
    current_level INTEGER DEFAULT 1,
    unlocked_categories TEXT[] DEFAULT ARRAY['present-basics'],
    achievements TEXT[] DEFAULT ARRAY[]::TEXT[],
    last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    study_time_minutes INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
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
-- USER INTERACTIONS & ANALYTICS
-- ================================

CREATE TABLE user_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    session_start TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    session_end TIMESTAMP WITH TIME ZONE,
    total_questions_attempted INTEGER DEFAULT 0,
    total_correct INTEGER DEFAULT 0,
    xp_gained INTEGER DEFAULT 0,
    categories_practiced TEXT[],
    levels_attempted INTEGER[],
    device_type VARCHAR(50),
    user_agent TEXT
);

CREATE TABLE question_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    session_id UUID REFERENCES user_sessions(id) ON DELETE CASCADE,
    question_id UUID REFERENCES questions(id),
    level_id INTEGER REFERENCES grammar_levels(id),

    -- Student's response
    user_answer TEXT NOT NULL,
    selected_words TEXT[], -- For sentence building questions
    construction_order INTEGER[], -- Order in which words were selected

    -- Timing information
    time_to_first_interaction INTEGER, -- milliseconds
    total_time_spent INTEGER, -- milliseconds
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    submitted_at TIMESTAMP WITH TIME ZONE,

    -- Evaluation
    is_correct BOOLEAN,
    score NUMERIC(3,2), -- 0.0 to 1.0 for partial credit
    grammar_errors JSONB, -- Detailed breakdown of errors
    feedback_given TEXT,

    -- Hints and assistance
    hints_used INTEGER DEFAULT 0,
    hint_texts_shown TEXT[],

    -- Learning insights
    error_categories TEXT[], -- Types of errors made
    improvement_suggestions TEXT[],

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE learning_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    metric_name VARCHAR(100) NOT NULL,
    metric_value NUMERIC,
    metric_context JSONB, -- Additional context for the metric
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    -- Useful for tracking trends
    daily_aggregate BOOLEAN DEFAULT false,
    weekly_aggregate BOOLEAN DEFAULT false,
    monthly_aggregate BOOLEAN DEFAULT false
);

-- ================================
-- ADAPTIVE LEARNING SYSTEM
-- ================================

CREATE TABLE skill_assessments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    skill_name VARCHAR(100) NOT NULL,
    proficiency_level NUMERIC(3,2) NOT NULL, -- 0.0 to 1.0
    confidence_interval NUMERIC(3,2), -- Uncertainty in the estimate
    last_assessed TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    assessment_basis INTEGER DEFAULT 1, -- Number of questions this is based on
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE difficulty_adjustments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    question_id UUID REFERENCES questions(id),
    original_difficulty NUMERIC(3,2),
    adjusted_difficulty NUMERIC(3,2),
    adjustment_reason VARCHAR(100),
    performance_context JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

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
-- GAMIFICATION SYSTEM
-- ================================

CREATE TABLE achievements (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    type VARCHAR(50) NOT NULL, -- 'streak', 'mastery', 'exploration', 'social', etc.

    -- Unlock conditions
    unlock_conditions JSONB NOT NULL,
    points_reward INTEGER DEFAULT 0,
    badge_tier VARCHAR(20) DEFAULT 'bronze' CHECK (badge_tier IN ('bronze', 'silver', 'gold', 'platinum')),

    -- Display
    display_order INTEGER,
    is_hidden BOOLEAN DEFAULT false, -- Secret achievements
    is_active BOOLEAN DEFAULT true,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE user_achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    achievement_id VARCHAR(50) REFERENCES achievements(id),
    unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    progress_data JSONB, -- For achievements with multiple steps

    UNIQUE(user_id, achievement_id)
);

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

-- Insert sample achievements
INSERT INTO achievements (id, name, description, icon, type, unlock_conditions, points_reward, badge_tier) VALUES
('first-sentence', 'First Sentence', 'Build your first correct sentence', 'award', 'milestone', '{"correct_sentences": 1}', 10, 'bronze'),
('streak-warrior', 'Streak Warrior', 'Maintain a 7-day learning streak', 'flame', 'streak', '{"consecutive_days": 7}', 50, 'silver'),
('grammar-master', 'Grammar Master', 'Complete all levels in a category', 'crown', 'mastery', '{"category_completion": 1}', 100, 'gold'),
('speed-demon', 'Speed Demon', 'Answer 10 questions correctly in under 5 seconds each', 'zap', 'performance', '{"fast_correct_answers": 10, "max_time_seconds": 5}', 75, 'silver'),
('perfectionist', 'Perfectionist', 'Get 50 questions correct in a row', 'target', 'accuracy', '{"consecutive_correct": 50}', 200, 'platinum');

-- ================================
-- FUNCTIONS FOR COMMON OPERATIONS
-- ================================

-- Function to update user progress
CREATE OR REPLACE FUNCTION update_user_progress(
    p_user_id UUID,
    p_xp_gained INTEGER DEFAULT 0,
    p_question_answered BOOLEAN DEFAULT false,
    p_was_correct BOOLEAN DEFAULT false
)
RETURNS void AS $$
BEGIN
    UPDATE user_progress
    SET
        total_xp = total_xp + p_xp_gained,
        total_questions_answered = CASE WHEN p_question_answered THEN total_questions_answered + 1 ELSE total_questions_answered END,
        correct_answers = CASE WHEN p_was_correct THEN correct_answers + 1 ELSE correct_answers END,
        last_activity = NOW(),
        updated_at = NOW()
    WHERE user_id = p_user_id;
END;
$$ LANGUAGE plpgsql;

-- Function to calculate user accuracy
CREATE OR REPLACE FUNCTION get_user_accuracy(p_user_id UUID)
RETURNS NUMERIC AS $$
DECLARE
    accuracy NUMERIC;
BEGIN
    SELECT
        CASE
            WHEN total_questions_answered = 0 THEN 0
            ELSE ROUND((correct_answers::NUMERIC / total_questions_answered) * 100, 2)
        END
    INTO accuracy
    FROM user_progress
    WHERE user_id = p_user_id;

    RETURN COALESCE(accuracy, 0);
END;
$$ LANGUAGE plpgsql;

-- Function to get recommended questions for a user
CREATE OR REPLACE FUNCTION get_recommended_questions(
    p_user_id UUID,
    p_limit INTEGER DEFAULT 10
)
RETURNS TABLE(question_id UUID, estimated_difficulty NUMERIC, recommendation_score NUMERIC) AS $$
BEGIN
    RETURN QUERY
    SELECT
        q.id,
        q.estimated_difficulty,
        -- Simple recommendation score based on user's current level and question difficulty
        (1.0 - ABS(q.estimated_difficulty - (up.current_level::NUMERIC / 45.0))) as rec_score
    FROM questions q
    CROSS JOIN user_progress up
    WHERE up.user_id = p_user_id
        AND q.is_active = true
        AND q.level_id <= up.current_level + 2  -- Don't recommend questions too far ahead
    ORDER BY rec_score DESC, RANDOM()  -- Add some randomness
    LIMIT p_limit;
END;
$$ LANGUAGE plpgsql;