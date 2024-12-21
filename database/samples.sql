-- Insert sample users
INSERT INTO users (username, email, password, role, penName, birthday, imgURL)
VALUES
('john_doe', 'john@example.com', '$2a$10$Ufb9xTeA.1.e08gvS8KZt.uoREaCkyhJrrNMXwN1ExfB2SXyQ8bv.', 'subscriber', 'JohnD', '1990-01-01', 'https://example.com/img/john.jpg'),
('jane_writer', 'jane@example.com', '$2a$10$Ufb9xTeA.1.e08gvS8KZt.uoREaCkyhJrrNMXwN1ExfB2SXyQ8bv.', 'writer', 'JaneW', '1985-05-20', 'https://example.com/img/jane.jpg'),
('editor_bob', 'bob@example.com', '$2a$10$Ufb9xTeA.1.e08gvS8KZt.uoREaCkyhJrrNMXwN1ExfB2SXyQ8bv.', 'editor', 'EditorBob', '1980-12-12', 'https://example.com/img/bob.jpg'),
('admin_alan', 'alan@example.com', '$2a$10$Ufb9xTeA.1.e08gvS8KZt.uoREaCkyhJrrNMXwN1ExfB2SXyQ8bv.', 'admin', 'AdminAlan', '1975-07-15', 'https://example.com/img/alan.jpg');

-- 0909090909 password

-- Insert sample categories
INSERT INTO categories (name, parent_id, editorId)
VALUES
('Technology', NULL, 3),
('Health', NULL, 3),
('Programming', 1, 3),
('Fitness', 2, 3);

-- Insert sample posts
INSERT INTO posts (title, publish_date, premium, abstract, content, statusName, media, userId, tags)
VALUES
('The Rise of AI', '2024-12-01', TRUE, 'A brief look at the rise of AI technologies.', 'Detailed content about AI...', 'Published', 'https://example.com/media/ai.jpg', 2, 'AI,Technology'),
('Staying Fit in 2024', '2024-12-15', FALSE, 'Tips for staying healthy and fit.', 'In-depth health and fitness tips...', 'Published', 'https://example.com/media/fitness.jpg', 2, 'Fitness,Health'),
('Introduction to Python', '2024-11-20', FALSE, 'A beginner guide to Python programming.', 'Complete guide to Python basics...', 'Approved', 'https://example.com/media/python.jpg', 2, 'Programming,Python');

-- Insert sample post categories
INSERT INTO post_categories (postId, categoryId)
VALUES
(1, 1),
(2, 2),
(3, 3);

-- Insert sample comments
INSERT INTO comments (postId, content, userId)
VALUES
(1, 'Great insights on AI!', 1),
(2, 'This is very helpful, thanks!', 1),
(3, 'Python is my favorite language!', 1);

-- Insert sample likes
INSERT INTO likes (postId, userId)
VALUES
(1, 1),
(1, 3),
(2, 1),
(3, 2);
