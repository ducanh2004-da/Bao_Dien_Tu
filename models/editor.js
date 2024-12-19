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
    let query = `
        SELECT posts.*, GROUP_CONCAT(categories.name) AS categories
        FROM posts
        LEFT JOIN post_categories ON posts.id = post_categories.postId
        LEFT JOIN categories ON post_categories.categoryId = categories.id
    `;
    if (statusName !== "all") {
        query += " WHERE posts.statusName = ?";
        db.query(query + " GROUP BY posts.id", [statusName], callback);
    } else {
        db.query(query + " GROUP BY posts.id", [], callback);
    }
};

const getArticlesById = (id, callback) => {
    const query = `
        SELECT posts.*, GROUP_CONCAT(categories.name) AS categories
        FROM posts
        LEFT JOIN post_categories ON posts.id = post_categories.postId
        LEFT JOIN categories ON post_categories.categoryId = categories.id
        WHERE posts.id = ?
        GROUP BY posts.id
    `;
    db.query(query, [id], callback);
};

const getCategoriesByIds = (ids, callback) => {
    const query = "SELECT id, name FROM categories WHERE id IN (?)";
    db.query(query, [ids], callback);
};

const getUsersByIds = (ids, callback) => {
    const query = "SELECT id, username FROM users WHERE id IN (?)";
    db.query(query, [ids], callback);
};

const getCategoryById = (id, callback) => {
    const query = "SELECT name FROM categories WHERE id=?";
    db.query(query, [id], callback);
};

const updateStatusName = (statusName, postId, refuse, callback) => {
    let query;
    let params;
    if (statusName === "Approved") {
        query = `
            UPDATE posts
            SET statusName = ?
            WHERE id = ?
        `;
        params = [statusName, postId];
    } else if (statusName === "Rejected") {
        query = `
            UPDATE posts
            SET statusName = ?, refuse = ?
            WHERE id = ?
        `;
        params = [statusName, refuse, postId];
    }
    db.query(query, params, callback);
};

module.exports = {
    getAllPosts,
    getPostById,
    updatePublished,
    getArticlesByStatus,
    getArticlesById,
    getCategoriesByIds,
    getUsersByIds,
    getCategoryById,
    updateStatusName,
};