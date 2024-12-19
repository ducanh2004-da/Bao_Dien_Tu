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
                                title: "Trang chủ",
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
                        title: post.title,
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

    // Search for posts
    search: (req, res) => {
        const query = req.query.q || "";

        // Ensure page is within valid range
        if (!req.query.page) {
            return res.redirect("./search?q=" + query + "&page=1");
        }

        let page = req.query.page;
        if (page < 1) page = 1;


        // Limit the number of results per page
        const limit = 10;

        // Calculate start index for pagination
        const startIndex = (page - 1) * limit;

        // Fetch search results
        homeModel.searchContent(query, limit, startIndex, (err, results) => {
            if (err) {
                console.error("Lỗi khi tìm kiếm bài viết:", err);
                return res.status(500).send("Không thể tìm kiếm bài viết");
            }

            if (results.length === 0) {
                return res.render("vwGuest/search", {
                    layout: "main",
                    title: "Kết quả tìm kiếm cho " + query,
                    posts: results,
                    user: req.session.user,
                    message: "Không tìm thấy kết quả phù hợp",
                });
            }

            // Fetch total number of results
            homeModel.searchContentCount(query, (err, count) => {
                if (err) {
                    console.error("Lỗi khi đếm số kết quả:", err);
                    return res.status(500).send("Không thể đếm số kết quả");
                }

                const nRows = count[0].total;

                // Calculate total number of pages
                const totalPages = Math.ceil(nRows / limit);

                // Ensure that the page is within the valid range
                if (page > totalPages) {
                    return res.status(404).send("Không tìm thấy trang");
                }

                pages = [];
                const dotsIndex = page + 3;
                for (let i = 1; i <= totalPages; i++) {
                    if (i === dotsIndex) {
                        pages.push({
                            value: "...",
                        });
                        break;
                    };
                    if (i <= totalPages) {
                        pages.push({
                            value: i,
                        });
                    };
                };

                for (let i = totalPages - 3; i <= totalPages; i++) {
                    if (i > dotsIndex) {
                        pages.push({
                            value: i,
                        });
                    }
                };

                // Render search results
                res.render("vwGuest/search", {
                    layout: "main",
                    title: "Kết quả tìm kiếm cho " + query,
                    posts: results,
                    currentPage: page,
                    totalPages,
                    pages,
                    query,
                    message: "Tìm thấy " + nRows + " kết quả phù hợp",
                });
            });
        });
    }
};
