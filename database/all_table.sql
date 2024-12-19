CREATE DATABASE IF NOT EXISTS baodientu;

USE baodientu;

-- Bảng lưu trữ người dùng
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100), 
    email VARCHAR(100) NOT NULL UNIQUE, 
    password VARCHAR(255),  -- Có thể để null nếu dùng OAuth
    githubId VARCHAR(255) UNIQUE,  
    googleId VARCHAR(255) UNIQUE,  
    role ENUM('subscriber', 'writer', 'editor', 'admin') DEFAULT 'subscriber',
    penName VARCHAR(50),
    expiry_date DATE,
    birthday DATE,  
    otp_code VARCHAR(6),                   
    otp_expires_at DATETIME,               
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

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
    thumbnail VARCHAR(255),  
    publish_date DATE,
    premium BOOLEAN,
    abstract TEXT,  
    content LONGTEXT,  
    statusName ENUM('Published', 'Rejected', 'Pending-Approval', 'Approved') NOT NULL, 
    media VARCHAR(255),  
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    userId INT NOT NULL,
    refuse VARCHAR(255),
    views INT DEFAULT 0,
    likes INT DEFAULT 0,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);

-- Bảng liên kết nhiều-nhiều giữa bài viết và nhãn
CREATE TABLE post_categories (
    postId INT,
    categoryId INT,
    PRIMARY KEY (postId, categoryId),  
    CONSTRAINT fk_post_categories_post
        FOREIGN KEY (postId) REFERENCES posts(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_post_categories_category
        FOREIGN KEY (categoryId) REFERENCES categories(id)
        ON DELETE CASCADE
);

-- Bảng lưu trữ bình luận của đọc giả
CREATE TABLE comments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    postId INT,  
    commenter VARCHAR(100) NOT NULL,  
    commentDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  
    content TEXT NOT NULL,  
    email VARCHAR(100), 
    CONSTRAINT fk_comments_post
        FOREIGN KEY (postId) REFERENCES posts(id)
        ON DELETE CASCADE  
);

-- Bảng lưu trữ gói premium !! time là ngày => tính sang phút
CREATE TABLE Packs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    price INT,
    name VARCHAR(100),
    time INT
);