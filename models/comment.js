const db = require("../utils/db");

const getAllComments = (callback) => {
    db.query("SELECT * FROM comments", callback);
}

const getCommentById = (id, callback) => {
    db.query("SELECT * FROM comments WHERE id = ?", [id], callback);
}

const getCommentsByPostId = (postId, callback) => {
    db.query("SELECT * FROM comments WHERE postId = ?", [postId], callback);
}

const addComment = (comment, callback) => {
    db.query(
        "INSERT INTO comments SET ?",
        comment,
        (err, result) => {
            if (err) return callback(err);
            getCommentById(result.insertId, callback);
        }
    );
}