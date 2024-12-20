-- Create the database if it doesn't exist
CREATE DATABASE IF NOT EXISTS baodientu;

-- Use the database
USE baodientu;

-- Create the `users` table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100), 
    email VARCHAR(100) NOT NULL UNIQUE, 
    password VARCHAR(255),   -- Có thể để null nếu dùng OAuth
    githubId VARCHAR(255) UNIQUE,  -- Lưu ID Facebook nếu sử dụng OAuth
    googleId VARCHAR(255) UNIQUE,  -- Lưu ID Google nếu sử dụng OAuth
    role ENUM('subscriber', 'writer', 'editor', 'admin', 'non-subscriber') DEFAULT 'subscriber',  -- Phân quyền người dùng
    penName VARCHAR(50),  -- Bút danh (không bắt buộc)
    birthday DATE,  -- Ngày sinh
    imgURL VARCHAR(255) DEFAULT NULL, --lưu ảnh đại diện
	otp_code VARCHAR(6),                   -- Mã OTP 6 chữ số
    otp_expires_at DATETIME,               -- Thời gian hết hạn của mã OTP
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create the `categories` table
CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    parent_id INT,
    editorId INT
);

-- Create the `posts` table
CREATE TABLE posts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    publish_date DATE,
    premium BOOLEAN,
    abstract TEXT,
    content LONGTEXT,
    statusName ENUM('Published', 'Rejected', 'Pending-Approval', 'Approved') NOT NULL,
    media VARCHAR(255),
    userId INT NOT NULL,
    refuse VARCHAR(255),
    views INT DEFAULT 0,
    likes INT DEFAULT 0,
    tags VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);

-- Add a full-text index to the `abstract` column
ALTER TABLE posts ADD FULLTEXT(abstract);

-- Create the `post_categories` table (many-to-many relationship)
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

-- Create the `comments` table
CREATE TABLE comments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    postId INT,
    commentDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    content TEXT NOT NULL,
    userId INT NOT NULL,
    CONSTRAINT fk_comments_post
        FOREIGN KEY (postId) REFERENCES posts(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_comments_user
        FOREIGN KEY (userId) REFERENCES users(id)
        ON DELETE CASCADE
);

-- Create the `subscriptions` table
CREATE TABLE subscriptions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId INT NOT NULL,
    start_date DATE NOT NULL DEFAULT CURRENT_DATE,
    end_date DATE NOT NULL DEFAULT DATE_ADD(CURRENT_DATE, INTERVAL 7 DAY),
    status ENUM('Active', 'Expired') DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);

-- Create a trigger to handle new users and assign default subscription
DELIMITER $$

CREATE TRIGGER after_user_insert
AFTER INSERT ON users
FOR EACH ROW
BEGIN
    -- Insert default subscription for the new user
    INSERT INTO subscriptions (userId)
    VALUES (NEW.id);

    -- Ensure the default role is subscriber
    IF NEW.role IS NULL THEN
        UPDATE users
        SET role = 'subscriber'
        WHERE id = NEW.id;
    END IF;
END$$

DELIMITER ;

-- Create an event to update subscription status and user role
DELIMITER $$

CREATE EVENT update_subscription_status
ON SCHEDULE EVERY 1 DAY
DO
BEGIN
    -- Update expired subscriptions
    UPDATE subscriptions
    SET status = 'Expired'
    WHERE end_date < CURRENT_DATE AND status = 'Active';

    -- Update users with expired subscriptions to Non-subscriber
    UPDATE users
    SET role = 'non-subscriber'
    WHERE id IN (
        SELECT userId
        FROM subscriptions
        WHERE status = 'Expired'
    );
END$$

DELIMITER ;

-- Enable the event scheduler
SET GLOBAL event_scheduler = ON;
