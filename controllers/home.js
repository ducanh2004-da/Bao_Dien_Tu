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
                            res.render("vwGuest/guest", {
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
        postModel.getPostById(id, (err, post) => {
            if (err) {
                console.error("Lỗi khi lấy chi tiết bài viết:", err);
                return res.status(500).send("Không thể lấy chi tiết bài viết");
            }

            // Ensure that the post is published
            if (post.statusName == "published") {
                return res.status(404).send("Bài viết không tồn tại hoặc chưa được xuất bản");
            }

            // Fetch Author information

            postModel.getPostAuthorInfo(post.id, (err, author) => {
                if (err) {
                    console.error("Lỗi khi lấy thông tin tác giả:", err);
                    return res.status(500).send("Không thể lấy thông tin tác giả");
                }

                // Fetch category details for the post
                categoryModel.getCatById(post.categoryId, (err, categories) => {
                    if (err) {
                        console.error("Lỗi khi lấy danh mục:", err);
                        return res.status(500).send("Không thể lấy danh mục");
                    }

                    // Render post detail view
                    res.render("vwGuest/post-detail", {
                        layout: "main",
                        post: post, // Single post data
                        category: categories[0], // Category information
                        author: author, // Author information
                    });
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

            // Return to referer page
            res.redirect(req.headers.referer);
        });
    },
};
