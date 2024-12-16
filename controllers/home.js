const postModel = require("../models/post.js");
const categoryModel = require("../models/category.js");
const path = require("path");
const homeModel = require("../models/home.js");
const { post } = require("../routes/writer.js");

module.exports = {
    // Show the homepage
    showHomePage: (req, res) => {
        categoryModel.getAllCategories((err, categories) => {
            if (err) return res.status(500).send("Cannot fetch categories");

            const filteredCategories = categories
                .filter((category) => category.parent_id === null)
                .map((parent) => ({
                    ...parent,
                    children: categories.filter((child) => child.parent_id === parent.id),
                }));

            homeModel.getHighlightedPosts((err, highlightedPosts) => {
                if (err) return res.status(500).send("Cannot fetch highlighted posts");

                homeModel.getTopCategoriesWithNewestPosts((err, posts) => {
                    if (err) return res.status(500).send("Cannot fetch top categories");

                    // Group posts by category_name
                    const topCategories = posts.reduce((grouped, post) =>
                    {
                        const { category_name, ...data } = post;
                        if (!grouped[category_name]) grouped[category_name] = [];
                        grouped[category_name].push(data);
                        return grouped;
                    }, {});

                    homeModel.getTop10NewestPosts((err, latestPosts) => {
                        if (err) return res.status(500).send("Cannot fetch latest posts");

                        homeModel.getTop10MostViewedPosts((err, mostViewPosts) => {
                            if (err) return res.status(500).send("Cannot fetch most viewed posts");

                            // Render the homepage view
                            res.render("vwPost/guest", {
                                layout: "main",
                                categories: filteredCategories,    // Hierarchical categories
                                highlightedPosts,        // Highlighted posts
                                topCategories,   // Posts grouped by parent categories
                                latestPosts,            // Latest posts
                                mostViewPosts,        // Most viewed posts
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
                console.error("Lỗi khi tăng lượt xem:", err);
                return res.status(500).send("Không thể tăng lượt xem");
            }
        });

        // Fetch post details
        postModel.getPostById(id, (err, posts) => {
            if (err) {
                console.error("Lỗi khi lấy chi tiết bài viết:", err);
                return res.status(500).send("Không thể lấy chi tiết bài viết");
            }

            // Ensure only published posts are displayed
            const publishedPost = posts.find((post) => post.statusName === "Published");
            if (!publishedPost) {
                return res.status(404).send("Bài viết không tồn tại hoặc chưa được xuất bản");
            }

            // Fetch category details for the post
            categoryModel.getCatById(publishedPost.categoryId, (err, categories) => {
                if (err) {
                    console.error("Lỗi khi lấy danh mục:", err);
                    return res.status(500).send("Không thể lấy danh mục");
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
                console.error("Lỗi khi tăng lượt thích:", err);
                return res.status(500).send("Không thể tăng lượt thích");
            }

            // Redirect to home view after liking
            res.redirect("/home/view");
        });
    },
};
