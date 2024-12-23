const db = require("../utils/db");

const getAllPosts = (callback) => {
  db.query("SELECT * FROM posts", callback);
};
const getPostById = (id, callback) => {
  db.query("SELECT * FROM posts WHERE id = ?", [id], callback);
};
const updatePublished = (id, callback) => {
  db.query(
    "UPDATE posts SET statusName = 'Published' WHERE id = ? ",
    [id],
    callback
  );
};

const getArticlesByStatus = (statusName, callback) => {
  if (statusName === "all") {
    const query = `
    SELECT * FROM posts 
  `;
    db.query(query, [], callback);
  } else {
    const query = `
    SELECT * FROM posts 
    WHERE statusName=? 
  `;
    db.query(query, [statusName], callback);
  }
};

const getArticlesById = (id, callback) => {
  const query = `
   SELECT * FROM posts
   WHERE id=?
  `;

  db.query(query, [id], callback);
};

const updateArticle = (article, callback) => {
  const query = `
    UPDATE posts
    SET title = ?, categoryId = ?, abstract = ?, content = ?, updated_at = NOW()
    WHERE id = ?
  `;

  db.query(
    query,
    [
      article.title,
      article.category,
      article.summary,
      article.content,
      article.id,
    ],
    callback
  );
};

const getCategoriesByIds = (ids, callback) => {
  const query = "SELECT id, name FROM categories WHERE id IN (?)";
  db.query(query, [ids], (err, results) => {
    if (err) return callback(err);
    callback(null, results);
  });
};

const getUsersByIds = (ids, callback) => {
  const query = "SELECT id, username FROM users WHERE id IN (?)";
  db.query(query, [ids], (err, results) => {
    if (err) return callback(err);
    callback(null, results);
  });
};

const getCategoryById = (id, callback) => {
  const query = "SELECT name FROM categories WHERE id=?";
  db.query(query, [id], callback);
};
const updateStatusName = (statusName, postId, refuse, callback) => {
  if (statusName === "Approved") {
    const query = `
    UPDATE posts
    SET statusName = ?
    WHERE id = ?
  `;
    db.query(query, [statusName, postId], callback);
  } else if (statusName === "Rejected") {
    const query = `
    UPDATE posts
    SET statusName = ?, refuse = ?
    WHERE id = ?
  `;
    db.query(query, [statusName, refuse, postId], callback);
  }
};
module.exports = {
  getAllPosts,
  getPostById,
  updatePublished,
  getArticlesByStatus,
  getArticlesById,
  updateArticle,
  getCategoriesByIds,
  getUsersByIds,
  getCategoryById,
  updateStatusName,
};
