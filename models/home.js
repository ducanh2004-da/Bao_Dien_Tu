const db = require("../utils/db.js");

// Fetch 3-4 highlighted posts in the past week
const getHighlightedPosts = (callback) => {
    const baseInterval = 7; // Initial interval in days
    const maxInterval = 365; // Maximum interval in days

    let currentInterval = baseInterval;

    const fetchPosts = () => {
        const query = `
            SELECT p.*, c.name AS category_name
            FROM posts p
                     JOIN post_categories pc ON p.id = pc.postId
                     JOIN categories c ON pc.categoryId = c.id
            WHERE p.statusName = 'Published'
              AND p.publish_date >= NOW() - INTERVAL ${currentInterval} DAY
            ORDER BY p.views DESC, p.likes DESC
                LIMIT 4;
        `;

        db.query(query, (err, results) => {
            if (err) {
                return callback(err, null);
            }

            // If results are empty and interval is within the maximum limit, increase interval and retry
            if (results.length === 0 && currentInterval < maxInterval) {
                currentInterval += 7; // Increase the interval by 7 days
                fetchPosts();
            } else {
                // Return results or empty list
                callback(null, results);
            }
        });
    };

    fetchPosts();
};

// Fetch the top 10 most viewed posts, including category name
const getTop10MostViewedPosts = (callback) => {
    const query = `
        SELECT
            p.*,
            c.name AS category_name
        FROM posts p
                 JOIN post_categories pc ON p.id = pc.postId
                 JOIN categories c ON pc.categoryId = c.id
        WHERE p.statusName = 'Published'
        ORDER BY p.views DESC
            LIMIT 10;
    `;
    db.query(query, callback);
};

// Fetch the top 10 newest posts, including category name
const getTop10NewestPosts = (callback) => {
    const query = `
        SELECT
            p.*,
            c.name AS category_name
        FROM posts p
                 JOIN post_categories pc ON p.id = pc.postId
                 JOIN categories c ON pc.categoryId = c.id
        WHERE p.statusName = 'Published'
        ORDER BY p.publish_date DESC
            LIMIT 10;
    `;
    db.query(query, callback);
};

// Function to fetch 3 newest posts for each of the top 10 most famous categories
const getTopCategoriesWithNewestPosts = (callback) => {
    const query = `
        WITH TopCategories AS (
            SELECT
                c.id AS category_id,
                c.name AS category_name,
                SUM(p.views) AS total_views
            FROM categories c
                     JOIN post_categories pc ON c.id = pc.categoryId
                     JOIN posts p ON pc.postId = p.id
            WHERE p.statusName = 'Published'
            GROUP BY c.id, c.name
            ORDER BY total_views DESC
            LIMIT 10
            ),
            RankedPosts AS (
        SELECT
            p.*,
            pc.categoryId,
            ROW_NUMBER() OVER (PARTITION BY pc.categoryId ORDER BY p.publish_date DESC) AS row_num
        FROM posts p
            JOIN post_categories pc ON p.id = pc.postId
            JOIN TopCategories tc ON pc.categoryId = tc.category_id
        WHERE p.statusName = 'Published'
            )
        SELECT
            c.name AS category_name,
            rp.*
        FROM RankedPosts rp
                 JOIN categories c ON rp.categoryId = c.id
        WHERE rp.row_num <= 3
        ORDER BY c.name, rp.publish_date DESC;
    `;
    db.query(query, callback);
};


const getTop5MostLikedPostsByCategory = (categoryId, callback) => {
    const query = `
        SELECT p.*, c.name AS category_name
        FROM posts p
                 JOIN post_categories pc ON p.id = pc.postId
                 JOIN categories c ON pc.categoryId = c.id
        WHERE p.statusName = 'Published' AND c.id = ?
        ORDER BY p.likes DESC
            LIMIT 5;
    `;
    db.query(query, [categoryId], callback);
};

const searchContent = (content, limit, offset, callback) => {
    const query = `
        SELECT
            id, title, abstract, publish_date, views, likes
        FROM
            posts
        WHERE
            statusName = 'Published'
                AND MATCH(abstract) AGAINST (?)
        ORDER BY publish_date DESC
            LIMIT ? OFFSET ?;
    `;
    db.query(query, [content, limit, offset], callback);
};

const searchContentCount = (content, callback) => {
    const query = `
        SELECT
            COUNT(*) AS total
        FROM
            posts
        WHERE
            statusName = 'Published'
                AND MATCH(abstract) AGAINST (?);
    `;
    db.query(query, [content], callback);
};

module.exports = {
    getHighlightedPosts,
    getTop10MostViewedPosts,
    getTop10NewestPosts,
    getTopCategoriesWithNewestPosts,
    getTop5MostLikedPostsByCategory,
    searchContentCount,
    searchContent,
};
