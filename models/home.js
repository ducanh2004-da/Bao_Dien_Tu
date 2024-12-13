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
const updateView = (id,callback) =>{
  db.query("UPDATE posts SET views = views + 1  WHERE id = ?",
      [id],callback
  )
}

const getMostViewPost = (callback) =>{
  db.query("SELECT * FROM posts WHERE statusName = 'Published' ORDER BY views DESC LIMIT 10;",
      callback
  )
}

const getMostLikePost = (callback) =>{
  db.query("SELECT * FROM posts WHERE statusName = 'Published' ORDER BY likes DESC LIMIT 10",
      callback
  )
}

const updateLike = (id, callback) =>{
  db.query("UPDATE posts SET likes = likes + 1  WHERE id = ?",
      [id],callback
  )
}

module.exports = {
  getPostsByNewTime,
  getPostsByParrentId,
  updateView,
  getMostViewPost,
  getMostLikePost,
  updateLike
};
