const db = require("../utils/db");

const getAllPosts = (callback) => {
    db.query("SELECT * FROM posts", callback);
};
const getPostById = (id, callback) => {
    db.query("SELECT * FROM posts WHERE id = ?", [id], (err, results) => {
        if (err) return callback(err);
        callback(null, results[0]);
    });
};

const updatePublished = (id, callback) => {
    db.query(
        "UPDATE posts SET statusName = 'Published' WHERE id = ? ",
        [id],
        callback
    );
};

const getPostAuthorInfo = (id, callback) => {
    db.query(
        `SELECT users.id, users.username, users.penName, users.email
        FROM users
        JOIN posts ON users.id = posts.userId
        WHERE posts.id = ?`,
        [id],
        (err, results) => {
            if (err) return callback(err);
            callback(null, results[0]);
        }
    );
};

const updatePost = (id, post, callback) => {
    db.query(
        "UPDATE posts SET title = ?, abstract = ?, content = ? WHERE id = ? ",
        [post.title, post.abstract, post.content, id],
        callback
    );
};
const deletePost = (id, callback) => {
    db.query("DELETE FROM posts WHERE id = ?", [id], callback);
};

const updateView = (id, callback) => {


    db.query(
        "UPDATE posts SET views = views + 1 WHERE id = ?",
        [id],
        callback
    );
};
const updateLike = (id, callback) => {


    db.query(
        "UPDATE posts SET likes = likes + 1 WHERE id = ?",
        [id],
        callback
    );
};


const getPostByCategory = (categoryId, callback) => {
    const query = `
    SELECT 
      p.*, 
      c.name AS category_name
    FROM posts p
    JOIN post_categories pc ON p.id = pc.postId
    JOIN categories c ON pc.categoryId = c.id
    WHERE c.id = ?
      AND p.statusName = 'Published'
    ORDER BY p.created_at DESC;
  `;
    db.query(query, [categoryId], callback);
};

module.exports = {
    getAllPosts,
    getPostById,
    getPostAuthorInfo,
    getPostByCategory,
    updatePublished,
    updatePost,
    updateView,
    updateLike,
    deletePost,
};
