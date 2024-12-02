-- Chèn dữ liệu mẫu vào bảng `posts`

UPDATE users 
SET role = 'admin' 
WHERE email = 'anhdott1@gmail.com';

-- Thêm dữ liệu vào bảng posts
INSERT INTO posts (title, abstract, content, statusName) VALUES
('báo hot 2', 'này là bản tóm tắt', 'Nội dung chi tiết', 'Pending-Publication');


