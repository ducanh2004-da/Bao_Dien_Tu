-- Insert Sample Users
INSERT INTO users (username, email, password, role, penName, birthday)
VALUES
    ('john_doe', 'john@example.com', 'hashed_password_1', 'subscriber', 'John', '1990-01-01'),
    ('jane_doe', 'jane@example.com', 'hashed_password_2', 'non-subscriber', 'Jane', '1992-02-02'),
    ('admin_user', 'admin@example.com', 'hashed_password_3', 'admin', NULL, '1985-05-15');

-- Insert Sample Subscriptions
INSERT INTO subscriptions (userId, start_date, end_date, status)
VALUES
    (1, CURRENT_DATE, DATE_ADD(CURRENT_DATE, INTERVAL 7 DAY), 'Active'), -- John
    (2, DATE_SUB(CURRENT_DATE, INTERVAL 10 DAY), DATE_SUB(CURRENT_DATE, INTERVAL 3 DAY), 'Expired'), -- Jane
    (3, CURRENT_DATE, DATE_ADD(CURRENT_DATE, INTERVAL 30 DAY), 'Active'); -- Admin

-- Insert Sample Categories
INSERT INTO categories (name, parent_id, editorId)
VALUES
    ('Technology', NULL, 3),
    ('Science', NULL, 3),
    ('Programming', 1, 3);

-- Insert Sample Posts
INSERT INTO posts (title, publish_date, premium, abstract, content, statusName, media, userId, refuse, views, likes, tags)
VALUES
    ('The Future of Tech', CURRENT_DATE, TRUE, 'Exploring future technologies.', 'Detailed content goes here.', 'Published', 'media1.mp4', 1, NULL, 100, 25, 'tech,future'),
    ('Advances in Science', CURRENT_DATE, FALSE, 'Breakthroughs in science.', 'Detailed content goes here.', 'Published', 'media2.mp4', 2, NULL, 50, 15, 'science,advances'),
    ('Learn Python', CURRENT_DATE, TRUE, 'A beginner guide to Python.', 'Detailed content goes here.', 'Pending-Approval', NULL, 1, NULL, 20, 5, 'programming,python');

-- Insert Sample Post Categories
INSERT INTO post_categories (postId, categoryId)
VALUES
    (1, 1), -- 'The Future of Tech' belongs to 'Technology'
    (2, 2), -- 'Advances in Science' belongs to 'Science'
    (3, 3); -- 'Learn Python' belongs to 'Programming'

-- Insert Sample Comments
INSERT INTO comments (postId, commenter, commentDate, content, email)
VALUES
    (1, 'Alice', CURRENT_TIMESTAMP, 'This article is amazing!', 'alice@example.com'),
    (2, 'Bob', CURRENT_TIMESTAMP, 'Great insights on science.', 'bob@example.com'),
    (1, 'Charlie', CURRENT_TIMESTAMP, 'Looking forward to more content.', 'charlie@example.com');
