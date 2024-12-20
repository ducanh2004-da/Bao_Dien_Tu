const postModel = require("../models/post.js");
const categoryModel = require("../models/category.js");
const homeModel = require("../models/home.js");

module.exports = {
    // Hiển thị trang chủ
    showHomePage: (req, res) => {
        categoryModel.getAllCategories((err, categories) => {
            if (err) {
              return res.status(500).send("Không thể lấy danh mục");
            }

            const filteredCategories = categories
                .filter((category) => category.parent_id === null)
                .map((parent) => ({
                    ...parent,
                    children: categories.filter((child) => child.parent_id === parent.id),
                }));

            homeModel.getHighlightedPostsNoPremium((err, highlightedPosts) => {
                if (err) {
                  return res.status(500).send("Không thể lấy bài viết nổi bật");
                }

                homeModel.getTopCategoriesWithNewestPostsNoPremium((err, posts) => {
                    if (err) {
                      return res.status(500).send("Không thể lấy danh mục hàng đầu");
                    }

                    const topCategories = posts.reduce((grouped, post) => {
                        const { category_name, ...data } = post;
                        if (!grouped[category_name]) {
                          grouped[category_name] = [];
                        }
                        grouped[category_name].push(data);
                        return grouped;
                    }, {});

                    homeModel.getTop10NewestPostsNoPremium((err, latestPosts) => {
                        if (err) {
                          return res.status(500).send("Không thể lấy bài viết mới nhất");
                        }

                        homeModel.getTop10MostViewedPostsNoPremium((err, mostViewPosts) => {
                            if (err) {
                              return res.status(500).send("Không thể lấy bài viết được xem nhiều nhất");
                            }

                            res.render("vwUser/home", {
                                layout: "main",
                                title: "Trang chủ",
                                categories: filteredCategories,
                                highlightedPosts,
                                topCategories,
                                latestPosts,
                                mostViewPosts,
                            });
                        });
                    });
                });
            });
        }); 
    },
    showCategory: (req, res) => {
        const id = parseInt(req.params.id || 0);

        // Get all categories to populate the navigation bar
        categoryModel.getAllCategories((err, categories) => {
            if (err) {
              return res.status(500).send("Không thể lấy danh mục");
            }

            const filteredCategories = categories
                .filter((category) => category.parent_id === null)
                .map((parent) => ({
                    ...parent,
                    children: categories.filter((child) => child.parent_id === parent.id),
                }));

            categoryModel.getCatById(id, (err, category) => {
                if (err) {
                  return res.status(500).send("Không thể lấy danh mục");
                }

                postModel.getPostByCategoryNoPremium(id, (err, posts) => {
                    if (err) {
                      return res.status(500).send("Không thể lấy bài viết của danh mục này");
                    }if (err) {
                          return res.status(500).send("Không thể lấy bài viết được yêu thích nhất của danh mục này");
                        }
                    homeModel.getTop5MostLikedPostsByCategoryNoPremium(id, (err, hotPosts) => {
                        if (err) {
                          return res.status(500).send("Không thể lấy bài viết được yêu thích nhất của danh mục này");
                        }
                        
                        // Render the homepage view
                        res.render("vwPost/byCat", {
                            layout: "main",
                            title: category[0].name,
                            categories: filteredCategories,    // Hierarchical categories
                            posts,
                            hotPosts
                        });
                    });
                });
            });
        }); 
    },

    // Hiển thị chi tiết bài viết
    showDetail: (req, res) => {
        const id = req.params.id;

        postModel.updateView(id, (err) => {
            if (err) {
                console.error("Lỗi khi tăng lượt xem:", err);
                return res.status(500).send("Không thể tăng lượt xem");
            }
        });

        postModel.getPostById(id, (err, post) => {
            if (err) {
                console.error("Lỗi khi lấy chi tiết bài viết:", err);
                return res.status(500).send("Không thể lấy chi tiết bài viết");
            }

            if (post.statusName != "Published") {
                return res.status(404).send("Bài viết không tồn tại hoặc chưa được xuất bản");
            }

            postModel.getPostAuthorInfo(post.id, (err, author) => {
                if (err) {
                    console.error("Lỗi khi lấy thông tin tác giả:", err);
                    return res.status(500).send("Không thể lấy thông tin tác giả");
                }

                categoryModel.getCatById(post.categoryId, (err, categories) => {
                    if (err) {
                        console.error("Lỗi khi lấy danh mục:", err);
                        return res.status(500).send("Không thể lấy danh mục");
                    }

                    // Splits the tags string into an array of tags
                    // post.tags = post.tags.split(",").map((tag) => tag.trim());

                    res.render("vwPost/post-detail", {
                        layout: "main",
                        title: post.title,
                        tags: post.tags.split(",").map((tag) => tag.trim()),
                        post,
                        category: categories[0],
                        author,
                    });
                });
            });
        });
    },

    // Tăng lượt thích bài viết
    likePost: (req, res) => {
        const id = req.params.id;

        postModel.updateLike(id, (err) => {
            if (err) {
                console.error("Lỗi khi tăng lượt thích:", err);
                return res.status(500).send("Không thể tăng lượt thích");
            }

            res.redirect(req.headers.referer);
        });
    },

    // Tìm kiếm bài viết
    search: (req, res) => {
        const query = req.query.q || "";

        if (!req.query.page) {
            return res.redirect("./search?q=" + query + "&page=1");
        }

        let page = req.query.page;
        if (page < 1) page = 1;

        const limit = 10;
        const startIndex = (page - 1) * limit;

        homeModel.searchContent(query, limit, startIndex, (err, results) => {
            if (err) {
                console.error("Lỗi khi tìm kiếm bài viết:", err);
                return res.status(500).send("Không thể tìm kiếm bài viết");
            }

            if (results.length === 0) {
                return res.render("vwPost/search", {
                    layout: "main",
                    title: "Kết quả tìm kiếm cho " + query,
                    posts: results,
                    user: req.session.user,
                    message: "Không tìm thấy kết quả phù hợp",
                });
            }

            homeModel.searchContentCount(query, (err, count) => {
                if (err) {
                    console.error("Lỗi khi đếm số kết quả:", err);
                    return res.status(500).send("Không thể đếm số kết quả");
                }

                const nRows = count[0].total;
                const totalPages = Math.ceil(nRows / limit);

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
                    }
                    if (i <= totalPages) {
                        pages.push({
                            value: i,
                        });
                    }
                }

                for (let i = totalPages - 3; i <= totalPages; i++) {
                    if (i > dotsIndex) {
                        pages.push({
                            value: i,
                        });
                    }
                }

                res.render("vwPost/search", {
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
