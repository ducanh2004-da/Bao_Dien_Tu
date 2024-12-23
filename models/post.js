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

const updateLike = (postId, userId, callback) => {
    // Check if the user has already liked the post
    db.query(
        "SELECT COUNT(*) AS liked FROM likes WHERE postId = ? AND userId = ?",
        [postId, userId],
        (err, results) => {
            if (err) return callback(err);

            const liked = results[0].liked > 0;

            if (liked) {
                // If the user has already liked the post, delete the like
                deleteLike(postId, userId, callback);
            } else {
                // If the user has not liked the post, insert a new like
                insertLike(postId, userId, callback);
            }
        }
    );
};

const insertLike = (postId, userId, callback) => {
    db.query(
        "INSERT INTO likes (postId, userId) VALUES (?, ?)",
        [postId, userId],
        callback
    );
};

const isLiked = (postId, userId, callback) => {
    db.query(
        "SELECT COUNT(*) AS liked FROM likes WHERE postId = ? AND userId = ?",
        [postId, userId],
        (err, results) => {
            if (err) return callback(err);
            callback(null, results[0].liked > 0);
        }
    );
};

const deleteLike = (postId, userId, callback) => {
    db.query(
        "DELETE FROM likes WHERE postId = ? AND userId = ?",
        [postId, userId],
        callback
    );
};
const getPostsByCategory = (categoryId, limit, offset, callback) => {
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
                ORDER BY p.created_at DESC
                LIMIT ? OFFSET ?;
            `;
            params = [categoryId,limit, offset];
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
                ORDER BY p.created_at DESC
                LIMIT ? OFFSET ?;
            `;
            params = [categoryId,limit, offset];
        }

        db.query(query, params, callback);
    });
};

const isPremium = (id, callback) => {
    db.query("SELECT premium FROM posts WHERE id = ?", [id], callback);
};

const getPostsByCategoryNoPremium = (categoryId, limit, offset, callback) => {
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
                  AND p.premium = 0  -- Exclude premium posts
                ORDER BY p.created_at DESC
                LIMIT ? OFFSET ?;
            `;
            params = [categoryId,limit, offset];
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
                  AND p.premium = 0  -- Exclude premium posts
                ORDER BY p.created_at DESC;
                LIMIT ? OFFSET ?;
            `;
            params = [categoryId,limit, offset];
        }

        db.query(query, params, callback);
    });
};

const getPostsByCategoryCountNoPremium = (categoryId, callback) => {
    const query = `
        SELECT COUNT(*) AS total
        FROM posts p
        JOIN post_categories pc ON p.id = pc.postId
        JOIN categories c ON pc.categoryId = c.id
        WHERE p.statusName = 'Published'
          AND p.premium = 0
          AND (c.id = ? OR c.parent_id = ?);
    `;
    db.query(query, [categoryId, categoryId], callback);
}
const getPostsByCategoryCount = (categoryId, callback) => {
    const query = `
        SELECT COUNT(*) AS total
        FROM posts p
        JOIN post_categories pc ON p.id = pc.postId
        JOIN categories c ON pc.categoryId = c.id
        WHERE p.statusName = 'Published'
          AND (c.id = ? OR c.parent_id = ?);
    `;
    db.query(query, [categoryId, categoryId], callback);
}

const getLikes = (postId, callback) => {
    db.query(
        "SELECT likes FROM posts WHERE id = ?",
        [postId],
        (err, results) => {
            if (err) return callback(err);
            callback(null, results[0].likes);
        }
    );
};

module.exports = {
    getAllPosts,
    getPostById,
    getPostAuthorInfo,
    getPostsByCategory,
    getPostsByCategoryNoPremium,
    isPremium,
    updatePublished,
    updatePost,
    updateView,
    updateLike,
    isLiked,
    insertLike,
    deleteLike,
    deletePost,
    getLikes,
    getPostsByCategoryCountNoPremium,
    getPostsByCategoryCount
};
