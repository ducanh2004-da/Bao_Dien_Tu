const db = require("../utils/db");

const getAllPosts = (callback) => {
    db.query("SELECT * FROM posts", callback);
};
const getPostById = (id, callback) => {
    db.query("SELECT * FROM posts WHERE id = ?", [id], (err, results) => {
        if (err) return callback(err);
        callback(null, results[0]);
    })
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
const deletes = (id, callback) => {
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

module.exports = {
    getAllPosts,
    getPostById,
    getPostAuthorInfo,
    updatePublished,
    updatePost,
    updateView,
    updateLike,
    deletes,
};
