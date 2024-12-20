-- Insert Sample Users
-- Nên tạo user trước thay vì dùng query tạo user

-- Insert Sample Subscriptions
INSERT INTO subscriptions (userId, start_date, end_date, status)
VALUES
    (1, CURRENT_DATE, DATE_ADD(CURRENT_DATE, INTERVAL 7 DAY), 'Active'), -- John
    (2, DATE_SUB(CURRENT_DATE, INTERVAL 10 DAY), DATE_SUB(CURRENT_DATE, INTERVAL 3 DAY), 'Expired'), -- Jane
    (3, CURRENT_DATE, DATE_ADD(CURRENT_DATE, INTERVAL 30 DAY), 'Active'); -- Admin

-- Insert Sample Categories
INSERT INTO categories (name, parent_id, editorId)
VALUES
    ('Technology', NULL, 3), -- Parent category
    ('Programming', 1, 3), -- Sub-category of Technology
    ('Science', NULL, 3), -- Parent category
    ('Physics', 3, 3); -- Sub-category of Science

-- Insert Sample Posts
INSERT INTO posts (title, publish_date, premium, abstract, content, statusName, media, userId, refuse, views, likes, tags)
VALUES
    ('The Future of Tech', CURRENT_DATE, TRUE, 'Exploring future technologies.', 'Detailed content goes here.', 'Published', 'media1.mp4', 1, NULL, 100, 25, 'tech,future'),
    ('Advances in Physics', CURRENT_DATE, FALSE, 'Breakthroughs in physics.', 'Detailed content goes here.', 'Published', 'media2.mp4', 2, NULL, 50, 15, 'science,physics'),
    ('Learn Python', CURRENT_DATE, TRUE, 'A beginners guide to Python.', 'Detailed content goes here.', 'Pending-Approval', NULL, 1, NULL, 20, 5, 'programming,python');

-- Insert Sample Post Categories
INSERT INTO post_categories (postId, categoryId)
VALUES
    (1, 2), -- 'The Future of Tech' belongs to 'Programming' (sub-category of Technology)
    (2, 4), -- 'Advances in Physics' belongs to 'Physics' (sub-category of Science)
    (3, 2); -- 'Learn Python' belongs to 'Programming' (sub-category of Technology)

-- Insert Sample Comments
INSERT INTO comments (postId, commenter, commentDate, content, email)
VALUES
    (1, 'Alice', CURRENT_TIMESTAMP, 'This article is amazing!', 'anhdott1@gmail.com'),
    (2, 'Bob', CURRENT_TIMESTAMP, 'Great insights on physics.', 'anhdott1@gmail.com'),
    (3, 'Charlie', CURRENT_TIMESTAMP, 'Looking forward to more Python content.', 'anhdott1@gmail.com');
