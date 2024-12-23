const db = require("../utils/db.js");

const getPostsByNewTime = (callback) => {
  const query = `
    SELECT *
    FROM posts
    ORDER BY publish_date DESC
    LIMIT 4;
  `;
  db.query(query, callback);
};
const getPostsByParrentId = (callback) => {
  const query = `
    SELECT c.*, p.*
    FROM categories c
    JOIN posts p ON c.id = p.categoryId;
  `;

  db.query(query, callback);
};

module.exports = {
  getPostsByNewTime,
  getPostsByParrentId,
};
