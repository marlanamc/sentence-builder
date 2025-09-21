-- Test Users for Sentence Builder Game
-- These are sample users you can insert into your Supabase users table
-- Note: These won't work for authentication unless you also create them in Supabase Auth
-- If your users table has a password_hash column, include it with dummy values

-- Insert test users into the users table
-- Option 1: If your users table doesn't have password_hash column
INSERT INTO users (email, username, role, is_active) VALUES
('john.doe@example.com', 'johndoe', 'student', true),
('jane.smith@example.com', 'janesmith', 'student', true),
('teacher1@example.com', 'teacher1', 'teacher', true),
('admin@example.com', 'admin', 'admin', true),
('test.student@example.com', 'teststudent', 'student', true),
('advanced.learner@example.com', 'advancedlearner', 'student', true),
('beginner@example.com', 'beginner', 'student', true);

-- Option 2: If your users table has a password_hash column (replace with your actual column structure)
-- INSERT INTO users (email, username, password_hash, role, is_active) VALUES
-- ('john.doe@example.com', 'johndoe', '$2a$10$dummyhashedpassword1', 'student', true),
-- ('jane.smith@example.com', 'janesmith', '$2a$10$dummyhashedpassword2', 'student', true),
-- ('teacher1@example.com', 'teacher1', '$2a$10$dummyhashedpassword3', 'teacher', true),
-- ('admin@example.com', 'admin', '$2a$10$dummyhashedpassword4', 'admin', true),
-- ('test.student@example.com', 'teststudent', '$2a$10$dummyhashedpassword5', 'student', true),
-- ('advanced.learner@example.com', 'advancedlearner', '$2a$10$dummyhashedpassword6', 'student', true),
-- ('beginner@example.com', 'beginner', '$2a$10$dummyhashedpassword7', 'student', true);

-- Sample query to view all users
SELECT id, email, username, role, created_at, is_active
FROM users
ORDER BY created_at DESC;

-- Sample query to find a specific user
SELECT * FROM users WHERE email = 'john.doe@example.com';

-- Sample query to get users by role
SELECT * FROM users WHERE role = 'student';

-- Sample query to count users by role
SELECT role, COUNT(*) as user_count
FROM users
GROUP BY role;
