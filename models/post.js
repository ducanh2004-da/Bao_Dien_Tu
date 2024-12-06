const db = require("../utils/db");

const getAllPosts = (callback) => {
  db.query("SELECT * FROM posts", callback);
};
const updatePublished = (id, callback) => {
  db.query(
    "UPDATE posts SET statusName = 'Published' WHERE id = ? ",
    [id],
    callback
  );
};
const deletes = (id, callback) => {
  db.query("DELETE FROM posts WHERE id = ?", [id], callback);
};

const getNextId = (tableName, callback) => {
  const query = "SHOW TABLE STATUS WHERE Name = ?";
  db.query(query, [tableName], (err, results) => {
    if (err) {
      return callback(err, null);
    }

    const nextId = results[0]?.Auto_increment;
    callback(null, nextId);
  });
};

const insertArticle = (article, callback) => {
  const query = `
    INSERT INTO posts 
      (title, categoryId, thumbnail, publish_date, abstract, content, statusName, created_at, updated_at, userId)
    VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW(), ?)
  `;

  db.query(
    query,
    [
      article.title, // Tiêu đề bài viết
      article.category, // ID chuyên mục
      article.thumbnail || null, // Ảnh đại diện (có thể null nếu không có)
      article.publish_date || null, // Ngày xuất bản (có thể null nếu chưa xuất bản)
      article.summary, // Tóm tắt bài viết
      article.content, // Nội dung bài viết
      article.statusName || "Pending-Approval", // Trạng thái mặc định
      article.userId, // ID người dùng viết bài
    ],
    callback // Hàm callback xử lý kết quả
  );
};

const getArticlesByStatus = (statusName, userId, callback) => {
  if (statusName === "all") {
    const query = `
    SELECT * FROM posts 
    WHERE userId=?
  `;
    db.query(query, [userId], callback);
  } else {
    const query = `
    SELECT * FROM posts 
    WHERE statusName=? AND userId=?
  `;
    db.query(query, [statusName, userId], callback);
  }
};

const getArticlesById = (id, callback) => {
  const query = `
   SELECT * FROM posts
   WHERE id=?
  `;

  db.query(
    query,
    [id],
    callback // Hàm callback xử lý kết quả
  );
};

const updateArticle = (article, callback) => {
  const query = `
    UPDATE posts
    SET title = ?, category_id = ?, thumbnail = ?, abstract = ?, content = ?, updated_at = NOW()
    WHERE id = ?
  `;

  // Truyền các giá trị từ đối tượng article vào query
  db.query(
    query,
    [
      article.title, // title
      article.categoryId, // category_id
      article.thumbnail, // thumbnail
      article.summary, // abstract
      article.content, // content
      article.id, // id (để xác định bài viết cần cập nhật)
    ],
    callback // Hàm callback xử lý kết quả
  );
};

module.exports = {
  getAllPosts,
  updatePublished,
  deletes,
  insertArticle,
  getNextId,
  getArticlesByStatus,
  getArticlesById,
  updateArticle,
};
