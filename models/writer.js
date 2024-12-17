const db = require("../utils/db");

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
      article.title,
      article.category,
      article.thumbnail || null,
      article.publish_date || null,
      article.summary,
      article.content,
      article.statusName || "Pending-Approval",
      article.userId,
    ],
    callback
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

const getArticlesByUserId = (userId, callback) => {
    const query = `
        SELECT * FROM posts
        WHERE userId = ?
    `;

    db.query(query, [userId], callback);
}

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
    SET title = ?, categoryId = ?, abstract = ?, content = ?, statusName = ?, updated_at = NOW()
    WHERE id = ?
  `;
  db.query(
    query,
    [
      article.title,
      article.category,
      article.summary,
      article.content,
      "Pending-Approval",
      article.id,
    ],
    callback
  );
};

const getCategoryById = (ids, callback) => {
  const query = "SELECT name FROM categories WHERE id = ?";
  db.query(query, [ids], callback);
};

module.exports = {
  insertArticle,
  getNextId,
  getArticlesByStatus,
  getArticlesByUserId,
  getArticlesById,
  updateArticle,
  getCategoryById,
};
