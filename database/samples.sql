-- Insert sample users

INSERT INTO users (id, username, email, password, role, created_at)
VALUES
    (1, 'John', 'john@example.com', '$2a$10$Ufb9xTeA.1.e08gvS8KZt.uoREaCkyhJrrNMXwN1ExfB2SXyQ8bv.','subscriber', CURRENT_TIMESTAMP),
    (2, 'Jane', 'jane@example.com', '$2a$10$Ufb9xTeA.1.e08gvS8KZt.uoREaCkyhJrrNMXwN1ExfB2SXyQ8bv.', 'writer', CURRENT_TIMESTAMP),
    (3, 'Admin', 'admin@example.com', '$2a$10$Ufb9xTeA.1.e08gvS8KZt.uoREaCkyhJrrNMXwN1ExfB2SXyQ8bv.', 'admin', CURRENT_TIMESTAMP);


-- 0909090909 password
-- Insert Sample Subscriptions
INSERT INTO subscriptions (userId, start_date, end_date, status)
VALUES
    (1, CURRENT_DATE, DATE_ADD(CURRENT_DATE, INTERVAL 7 DAY), 'Active'),
    (2, CURRENT_DATE, DATE_SUB(CURRENT_DATE, INTERVAL 3 DAY), 'Active'),
    (3, CURRENT_DATE, DATE_ADD(CURRENT_DATE, INTERVAL 30 DAY), 'Active');

-- Insert sample categories
-- Thêm 3 category cha
INSERT INTO categories (name, parent_id, editorId) VALUES
('Technology', NULL, NULL),
('Lifestyle', NULL, NULL),
('Education', NULL, NULL);

-- Thêm 5 category con thuộc vào 1 trong 3 category cha và phân cho editor
INSERT INTO categories (name, parent_id, editorId) VALUES
('AI', 1, 4),
('Gadgets', 1, 4),
('Health', 2, 4),
('Travel', 2, 4),
('Online Courses', 3, 4);

-- Insert sample posts
-- Thêm 20 bài post liên kết với các category qua bảng post_categories
INSERT INTO posts (title, publish_date, premium, abstract, content, statusName, userId, tags) VALUES
('Introduction to AI', '2024-12-01', TRUE, 'Abstract about AI', 'Content about AI', 'Published', 2, 'AI, Machine Learning'),
('Top Gadgets of 2024', '2024-11-15', FALSE, 'Abstract about gadgets', 'Content about gadgets', 'Published', 2, 'Gadgets, Technology'),
('Healthy Living Tips', '2024-10-20', TRUE, 'Abstract about health', 'Content about health', 'Published', 2, 'Health, Fitness'),
('Best Travel Destinations', '2024-09-25', FALSE, 'Abstract about travel', 'Content about travel', 'Published', 2, 'Travel, Adventure'),
('Top Online Courses', '2024-08-30', TRUE, 'Abstract about courses', 'Content about courses', 'Published', 2, 'Education, Online Courses'),
('AI in Education', '2024-12-02', TRUE, 'Abstract about AI in education', 'Content about AI in education', 'Published', 2, 'AI, Education'),
('Fitness Gadgets', '2024-10-22', FALSE, 'Abstract about fitness gadgets', 'Content about fitness gadgets', 'Published', 2, 'Health, Gadgets'),
('Travel Gadgets', '2024-09-28', TRUE, 'Abstract about travel gadgets', 'Content about travel gadgets', 'Published', 2, 'Travel, Gadgets'),
('AI and Healthcare', '2024-12-03', TRUE, 'Abstract about AI and healthcare', 'Content about AI and healthcare', 'Published', 2, 'AI, Health'),
('Budget Travel Tips', '2024-09-29', FALSE, 'Abstract about budget travel', 'Content about budget travel', 'Published', 2, 'Travel, Lifestyle'),
('Gadget Reviews', '2024-11-16', FALSE, 'Abstract about gadget reviews', 'Content about gadget reviews', 'Published', 2, 'Gadgets, Technology'),
('Online Learning Platforms', '2024-08-31', TRUE, 'Abstract about online learning', 'Content about online learning', 'Published', 2, 'Education, Online Courses'),
('Technology Trends', '2024-12-05', TRUE, 'Abstract about technology trends', 'Content about technology trends', 'Published', 2, 'Technology, AI'),
('Travel Safety Tips', '2024-09-30', FALSE, 'Abstract about travel safety', 'Content about travel safety', 'Published', 2, 'Travel, Adventure'),
('Healthy Diet Plans', '2024-10-23', TRUE, 'Abstract about diet plans', 'Content about diet plans', 'Published', 2, 'Health, Lifestyle'),
('Gadgets in Education', '2024-12-06', FALSE, 'Abstract about gadgets in education', 'Content about gadgets in education', 'Published', 2, 'Education, Gadgets'),
('Adventure Travel', '2024-09-26', TRUE, 'Abstract about adventure travel', 'Content about adventure travel', 'Published', 2, 'Travel, Adventure'),
('AI in Daily Life', '2024-12-07', TRUE, 'Abstract about AI in daily life', 'Content about AI in daily life', 'Published', 2, 'AI, Lifestyle'),
('Wearable Gadgets', '2024-11-17', FALSE, 'Abstract about wearable gadgets', 'Content about wearable gadgets', 'Published', 2, 'Gadgets, Technology'),
('Home Health Devices', '2024-10-24', TRUE, 'Abstract about health devices', 'Content about health devices', 'Published', 2, 'Health, Gadgets');

-- Liên kết bài viết với các danh mục qua bảng post_categories
INSERT INTO post_categories (postId, categoryId) VALUES
(1, 4), (2, 5), (3, 6), (4, 7), (5, 8),
(6, 4), (7, 5), (8, 5), (9, 6), (10, 7),
(11, 5), (12, 8), (13, 4), (14, 7), (15, 6),
(16, 8), (17, 7), (18, 4), (19, 5), (20, 6);
-- Insert sample comments
INSERT INTO comments (postId, content, userId)
VALUES
(1, 'Great insights on AI!', 1),
(2, 'This is very helpful, thanks!', 1),
(3, 'Python is my favorite language!', 1);
(4, 'Great insights on AI!', 1),
(5, 'This is very helpful, thanks!', 1),
(6, 'Python is my favorite language!', 1);
(7, 'Great insights on AI!', 1),
(8, 'This is very helpful, thanks!', 1),
(9, 'Python is my favorite language!', 1);

-- Insert sample likes
INSERT INTO likes (postId, userId)
VALUES
(1, 1),
(1, 3),
(2, 1),
(3, 2);
(4, 3),
(5, 1),
(6, 2);
