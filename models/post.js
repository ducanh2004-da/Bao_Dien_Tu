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
    // First, check if the category is a parent category
    const checkParentQuery = `
        SELECT COUNT(*) AS isParent
        FROM categories
        WHERE id = ? AND parent_id IS NULL
    `;

    db.query(checkParentQuery, [categoryId], (err, results) => {
        if (err) return callback(err);

        const isParent = results[0].isParent > 0;

        let query;
        let params;

        if (isParent) {
            // If it's a parent category, get posts from all its subcategories
            query = `
                SELECT 
                    p.*, 
                    c.name AS category_name
                FROM posts p
                JOIN post_categories pc ON p.id = pc.postId
                JOIN categories c ON pc.categoryId = c.id
                WHERE c.parent_id = ?
                  AND p.statusName = 'Published'
                ORDER BY p.created_at DESC;
            `;
            params = [categoryId];
        } else {
            // If it's not a parent category, get posts from the given category
            query = `
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
            params = [categoryId];
        }

        db.query(query, params, callback);
    });
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
