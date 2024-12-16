const postModel = require("../models/post.js");
const categoryModel = require("../models/category.js");
const path = require("path");
const homeModel = require("../models/home.js");
const { post } = require("../routes/writer.js");

module.exports = {
    // Show the subscriber main page
    showMainPage: (req, res) => {
        // Fetch all categories
        categoryModel.getAllCategories((err, categories) => {
            if (err) {
                console.error("Lỗi khi lấy danh mục:", err);
                return res.status(500).send("Không thể lấy danh mục");
            }

            // Build hierarchical categories
            const filteredCategories = categories
                .filter((category) => category.parent_id === null)
                .map((parent) => ({
                    ...parent,
                    children: categories.filter((child) => child.parent_id === parent.id),
                }));

            // Fetch highlighted posts (most liked in the past week)
            homeModel.getHighlightedPosts((err, highlightedPosts) => {
                if (err) {
                    console.error("Lỗi khi lấy bài viết nổi bật:", err);
                    return res.status(500).send("Không thể lấy bài viết nổi bật");
                }

                // Fetch top categories with newest posts
                homeModel.getTopCategoriesWithNewestPosts((err, posts) => {
                    if (err) {
                        console.error("Lỗi khi lấy bài viết theo danh mục:", err);
                        return res.status(500).send("Không thể lấy bài viết theo danh mục");
                    }

                    // Group posts by category name
                    const topCategories = posts.reduce((grouped, post) => {
                        const { category_name, ...data } = post;
                        if (!grouped[category_name]) grouped[category_name] = [];
                        grouped[category_name].push(data);
                        return grouped;
                    }, {});

                    // Fetch the latest 10 posts
                    homeModel.getTop10NewestPosts((err, latestPosts) => {
                        if (err) {
                            console.error("Lỗi khi lấy bài viết mới nhất:", err);
                            return res.status(500).send("Không thể lấy bài viết mới nhất");
                        }

                        // Fetch the 10 most viewed posts
                        homeModel.getTop10MostViewedPosts((err, mostViewPosts) => {
                            if (err) {
                                console.error("Lỗi khi lấy bài viết được xem nhiều nhất:", err);
                                return res.status(500).send("Không thể lấy bài viết được xem nhiều nhất");
                            }

                            // Render the subscriber main page
                            res.render("subsPage/subscriber_main", {
                                layout: "main",
                                categories: filteredCategories,   // Hierarchical categories
                                highlightedPosts,                // Highlighted posts
                                topCategories,                   // Top categories with newest posts
                                latestPosts,                      // Latest posts
                                mostViewPosts,                    // Most viewed posts
                                user: req.session.user,          // Subscriber user data
                            });
                        });
                    });
                });
            });
        });
    },

    // Show post details (similar to guest)
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
                console.error("Lỗi khi lấy bài viết:", err);
                return res.status(500).send("Không thể lấy bài viết");
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

                res.render("vwPost/post-detail", {
                    posts: publishedPost, // Single post data
                    categories: categories[0], // Category information
                });
            });
        });
    },

    // Like a post (similar to guest)
    likePost: (req, res) => {
        const id = req.params.id;

        homeModel.updateLike(id, (err) => {
            if (err) {
                console.error("Lỗi khi tăng lượt thích:", err);
                return res.status(500).send("Không thể tăng lượt thích");
            }

            res.redirect("/subscriber/main");
        });
    },
};
