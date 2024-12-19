CREATE DATABASE baodientu;

USE baodientu;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100), 
    email VARCHAR(100) NOT NULL UNIQUE, 
    password VARCHAR(255),   -- Có thể để null nếu dùng OAuth
    githubId VARCHAR(255) UNIQUE,  -- Lưu ID Facebook nếu sử dụng OAuth
    googleId VARCHAR(255) UNIQUE,  -- Lưu ID Google nếu sử dụng OAuth
    role ENUM('subscriber','writer','editor','admin') DEFAULT 'subscriber',  -- Phân quyền người dùng
    penName VARCHAR(50),  -- Bút danh (không bắt buộc)
    birthday DATE,  -- Ngày sinh
	otp_code VARCHAR(6),                   -- Mã OTP 6 chữ số
    otp_expires_at DATETIME,               -- Thời gian hết hạn của mã OTP
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
-- Lưu trữ nhãn cho bài viết
-- Bảng lưu trữ nhãn
CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    parent_id INT,
    editorId INT
);

-- Bảng lưu trữ thông tin bài viết
CREATE TABLE posts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    categoryId INT,
    thumbnail VARCHAR(255),  -- Ảnh đại diện
    publish_date DATE,  -- Ngày xuất bản (có thể để null nếu chưa xuất bản)
    abstract TEXT,  -- Nội dung tóm tắt bài viết
    content LONGTEXT,  -- Nội dung chi tiết bài viết
    statusName ENUM('Published', 'Rejected', 'Pending-Approval', 'Approved') NOT NULL, 
    media VARCHAR(255),  -- Hình ảnh/video trong bài viết
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    userId INT NOT NULL,
    refuse VARCHAR(255),
    views INT DEFAULT 0,
    likes INT DEFAULT 0,
);


-- Bảng liên kết nhiều-nhiều giữa bài viết và nhãn
CREATE TABLE post_categories (
    postId INT,
    tagId INT,

    CONSTRAINT fk_post_categories_post
    FOREIGN KEY (postId) REFERENCES posts(id)
    ON DELETE CASCADE,

    CONSTRAINT fk_post_categories_tag
    FOREIGN KEY (tagId) REFERENCES categories(id)
    ON DELETE CASCADE,

    PRIMARY KEY (postId, tagId)  -- Đảm bảo không có nhãn trùng lặp cho mỗi bài viết
);

-- Bảng lưu trữ bình luận của đọc giả
CREATE TABLE comments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    postId INT,  -- Liên kết đến bài viết mà bình luận thuộc về
    commenter VARCHAR(100) NOT NULL,  -- Tên đọc giả
    commentDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  
    content TEXT NOT NULL,  -- Nội dung bình luận
    email VARCHAR(100), 
    
    -- Ràng buộc khóa ngoại cho postId
    CONSTRAINT fk_comments_post
    FOREIGN KEY (postId) REFERENCES posts(id)
    ON DELETE CASCADE  -- Xóa bình luận nếu bài viết bị xóa
);