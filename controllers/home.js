const path = require("path");
const postModel = require("../models/post.js");
const categoryModel = require("../models/category.js");
const homeModel = require("../models/home.js");

module.exports = {
    // Show the homepage
    showHomePage: (req, res) => {
        categoryModel.getAllCategories((err, categories) => {
            if (err) {
                console.error("Error fetching categories:", err);
                return res.status(500).send("Error fetching categories");
            }

            // Build a hierarchical structure of categories
            const filteredCategories = categories
                .filter((category) => category.parent_id === null)
                .map((parent) => ({
                    ...parent,
                    children: categories.filter((child) => child.parent_id === parent.id),
                }));

            // Fetch posts by new time, filtered to "Published" only
            homeModel.getPostsByNewTime((err, latestPost) => {
                if (err) {
                    console.error("Error fetching posts:", err);
                    return res.status(500).send("Error fetching posts");
                }

                // Filter "Published" posts
                const publishedLatestPosts = latestPost.filter((post) => post.statusName === "Published");

                // Map posts with category names
                const postsWithCategoryNames = publishedLatestPosts.map((post) => {
                    const category = categories.find((cat) => cat.id === post.categoryId);
                    return {
                        ...post,
                        categoryName: category ? category.name : "Unknown",
                    };
                });

                // Fetch grouped posts, filtered to "Published" only
                homeModel.getPostsByParrentId((err, results) => {
                    if (err) {
                        console.error("Error fetching grouped posts:", err);
                        return res.status(500).send("Error fetching grouped posts");
                    }

                    // Filter "Published" posts
                    const publishedResults = results.filter((row) => row.statusName === "Published");

                    // Group posts by parent categories
                    const groupedByParent = publishedResults.reduce((acc, row) => {
                        const parentCategory = categories.find((cat) => cat.id === row.parent_id);
                        const parentName = parentCategory ? parentCategory.name : "Unknown";

                        if (!acc[parentName]) acc[parentName] = [];
                        acc[parentName].push(row);

                        return acc;
                    }, {});

                    // Fetch most viewed posts, filtered to "Published" only
                    homeModel.getPostsByMostView((err, mostViewPost) => {
                        if (err) {
                            console.error("Error fetching most viewed posts:", err);
                            return res.status(500).send("Error fetching most viewed posts");
                        }

                        const publishedMostViewPost = mostViewPost.filter((post) => post.statusName === "Published");

                        // Fetch most liked posts, filtered to "Published" only
                        homeModel.getMostLikePost((err, mostLikePost) => {
                            if (err) {
                                console.error("Error fetching most liked posts:", err);
                                return res.status(500).send("Error fetching most liked posts");
                            }

                            const publishedMostLikePost = mostLikePost.filter((post) => post.statusName === "Published");

                            // Render the homepage view
                            res.render("vwPost/guest", {
                                layout: "main",
                                categories: filteredCategories,
                                posts: postsWithCategoryNames,
                                latestPost: publishedLatestPosts,
                                groupedByParent,
                                mostViewPost: publishedMostViewPost,
                                mostLikePost: publishedMostLikePost,
                            });
                        });
                    });
                });
            });
        });
    },

    // Show post details
    showDetail: (req, res) => {
        const id = req.params.id;

        // Increment view count for the post
        homeModel.updateView(id, (err) => {
            if (err) {
                console.error("Error updating view count:", err);
                return res.status(500).send("Error updating view count");
            }
        });

        // Fetch post details
        postModel.getPostById(id, (err, posts) => {
            if (err) {
                console.error("Error fetching post details:", err);
                return res.status(500).send("Error fetching post details");
            }

            // Ensure post is "Published"
            const publishedPost = posts.find((post) => post.statusName === "Published");
            if (!publishedPost) {
                return res.status(404).send("Post not found or not published");
            }

            // Fetch category details for the post
            categoryModel.getCatById(publishedPost.categoryId, (err, categories) => {
                if (err) {
                    console.error("Error fetching category details:", err);
                    return res.status(500).send("Error fetching category details");
                }

                // Render post detail view
                res.render("vwPost/post-detail", {
                    posts: publishedPost, // Single post data
                    categories: categories[0], // Category information
                });
            });
        });
    },

    // Like a post
    likePost: (req, res) => {
        const id = req.params.id;

        homeModel.updateLike(id, (err) => {
            if (err) {
                console.error("Error updating like count:", err);
                return res.status(500).send("Error updating like count");
            }

            // Redirect to home view after liking
            res.redirect("/home/view");
        });
    },
};
