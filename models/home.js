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
            JOIN categories c ON p.categoryId = c.id
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
    SELECT p.*, c.name AS category_name
    FROM posts p
           JOIN categories c ON p.categoryId = c.id
    WHERE p.statusName = 'Published'
    ORDER BY p.views DESC
      LIMIT 10;
  `;
  db.query(query, callback);
};

// Fetch the top 10 newest posts, including category name
const getTop10NewestPosts = (callback) => {
  const query = `
    SELECT p.*, c.name AS category_name
    FROM posts p
           JOIN categories c ON p.categoryId = c.id
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
        SELECT c.id AS category_id, c.name AS category_name, SUM(p.views) AS total_views
        FROM categories c
        JOIN posts p ON c.id = p.categoryId
        WHERE p.statusName = 'Published'
        GROUP BY c.id, c.name
        ORDER BY total_views DESC
        LIMIT 10
    ), RankedPosts AS (
        SELECT 
            p.id, 
            p.title, 
            p.categoryId, 
            p.publish_date, 
            p.abstract, 
            p.thumbnail, 
            p.likes,
            p.views,
            ROW_NUMBER() OVER (PARTITION BY p.categoryId ORDER BY p.publish_date DESC) AS row_num
        FROM posts p
        JOIN TopCategories tc ON p.categoryId = tc.category_id
        WHERE p.statusName = 'Published'
    )
    SELECT 
        c.name AS category_name,
        rp.id AS post_id,
        rp.title,
        rp.publish_date,
        rp.abstract,
        rp.thumbnail,
        rp.likes,
        rp.views
    FROM RankedPosts rp
    JOIN categories c ON rp.categoryId = c.id
    WHERE rp.row_num <= 3
    ORDER BY c.name, rp.publish_date DESC;
  `;

  db.query(query, callback);
};

const getPostsByNewTime = (callback) => {
  const query = `
    SELECT *
    FROM posts
    WHERE statusName = 'Published'
    ORDER BY publish_date DESC
    LIMIT 4;
  `;
  db.query(query, callback);
};

const getPostsByParrentId = (callback) => {
  const query = `
    SELECT c.*, p.*
    FROM categories c
    JOIN posts p ON c.id = p.categoryId
    WHERE p.statusName = 'Published';
  `;
  db.query(query, callback);
};

const updateView = (id, callback) => {
  db.query(
    "UPDATE posts SET views = views + 1 WHERE id = ?",
    [id],
    callback
  );
};

const getMostViewPost = (callback) => {
  db.query(
    "SELECT * FROM posts WHERE statusName = 'Published' ORDER BY views DESC LIMIT 10;",
    callback
  );
};

const getMostLikePost = (callback) => {
  db.query(
    "SELECT * FROM posts WHERE statusName = 'Published' ORDER BY likes DESC LIMIT 10;",
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

const searchContent = (content, callback) => {
  const query = `
    SELECT
      *
    FROM
      posts
    WHERE
      statusName = 'Published'
        AND MATCH(abstract) AGAINST (?)
  `;
  db.query(query, [content], callback);
};
module.exports = {
  getPostsByNewTime,
  getPostsByParrentId,
  getHighlightedPosts,
  getTop10MostViewedPosts,
  getTop10NewestPosts,
  getTopCategoriesWithNewestPosts,
  searchContent,
  updateView,
  getMostViewPost,
  getMostLikePost,
  updateLike,
};
