const postModel = require("../models/post.js");
const categoryModel = require("../models/category.js");
const homeModel = require("../models/home.js");
const subscriptionModel = require("../models/subscription.js");
const commentModel = require("../models/comment.js");


module.exports = {
    // Show the subscriber main page
    showMainPage: (req, res) => {

        let { notification } = req.session;
        const { isSubscriber, isUser } = req.session;
        // Clear the notification after displaying it
        req.session.notification = null;

        // Fetch all categories
        categoryModel.getAllCategories((err, categories) => {
            if (err) {
              return res.status(500).send("Không thể lấy danh mục");
            }

            // Build hierarchical categories
            const filteredCategories = categories
                .filter((category) => category.parent_id === null)
                .map((parent) => ({
                    ...parent,
                    children: categories.filter((child) => child.parent_id === parent.id),
                }));

            // Check if the user is a subscriber
            if (isSubscriber) {
                homeModel.getHighlightedPosts((err, highlightedPosts) => {
                    if (err) {
                      return res.status(500).send("Không thể lấy bài viết nổi bật");
                    }

                    // Fetch top categories with newest posts
                    homeModel.getTopCategoriesWithNewestPosts((err, posts) => {
                        if (err) {
                          return res.status(500).send("Không thể lấy danh mục hàng đầu");
                        }

                        // Group posts by category_name
                        const topCategories = posts.reduce((grouped, post) => {
                            const { category_name, ...data } = post;
                            if (!grouped[category_name]) {
                                grouped[category_name] = [];
                            }
                            grouped[category_name].push(data);
                            return grouped;
                        }, {});

                        // Fetch top 10 newest posts
                        homeModel.getTop10NewestPosts((err, latestPosts) => {
                            if (err) {
                                return res.status(500).send("Không thể lấy bài viết mới nhất");
                            }

                            // Fetch top 10 most viewed posts
                            homeModel.getTop10MostViewedPosts((err, mostViewPosts) => {
                                if (err) {
                                    return res.status(500).send("Không thể lấy bài viết được xem nhiều nhất");
                                }

                                res.render("vwUser/home", {
                                    layout: "main",
                                    title: "Trang chủ",
                                    notification: notification,
                                    categories: filteredCategories,
                                    highlightedPosts,
                                    topCategories,
                                    latestPosts,
                                    mostViewPosts,
                                    user: req.session.user,
                                });
                            });
                        });
                    });
                });
            } else if (isUser) {
                homeModel.getHighlightedPostsNoPremium((err, highlightedPosts) => {
                    if (err) {
                        return res.status(500).send("Không thể lấy bài viết nổi bật");
                    }

                    // Fetch top categories with newest posts
                    homeModel.getTopCategoriesWithNewestPostsNoPremium((err, posts) => {
                        if (err) {
                            return res.status(500).send("Không thể lấy danh mục hàng đầu");
                        }

                        // Group posts by category_name
                        const topCategories = posts.reduce((grouped, post) => {
                            const { category_name, ...data } = post;
                            if (!grouped[category_name]) {
                                grouped[category_name] = [];
                            }
                            grouped[category_name].push(data);
                            return grouped;
                        }, {});

                        // Fetch top 10 newest posts
                        homeModel.getTop10NewestPostsNoPremium((err, latestPosts) => {
                            if (err) {
                                return res.status(500).send("Không thể lấy bài viết mới nhất");
                            }

                            // Fetch top 10 most viewed posts
                            homeModel.getTop10MostViewedPostsNoPremium((err, mostViewPosts) => {
                                if (err) {
                                    return res.status(500).send("Không thể lấy bài viết được xem nhiều nhất");
                                }

                                notification = {
                                    type: "info",
                                    content: "Hãy trở thành subscriber để được đọc những bài viết premium",
                                };

                                res.render("vwUser/home", {
                                    layout: "main",
                                    title: "Trang chủ",
                                    notification: notification,
                                    categories: filteredCategories,
                                    highlightedPosts,
                                    topCategories,
                                    latestPosts,
                                    mostViewPosts,
                                    user: req.session.user,
                                });
                            });
                        });
                    });
                });
            }
        });
    },

    // Show post details
    showDetail: (req, res) => {
        const {id} = req.params;

        postModel.isPremium(id, (err, isPremium) => {
            if (err) {
                return res.status(500).send("Không thể lấy bài viết");
            }
            if (isPremium && req.session.isSubscriber) {
                // Increment view count for the post
                postModel.updateView(id, (err) => {
                    if (err) {
                        console.error("Lỗi khi cập nhật lượt xem:", err);
                        return res.status(500).send("Không thể cập nhật lượt xem");
                    }
                });

                // Fetch post details
                postModel.getPostById(id, (err, post) => {
                    if (err) {
                        console.error("Lỗi khi lấy bài viết:", err);
                        return res.status(500).send("Không thể lấy chi tiết bài viết");
                    }

                    // Ensure that the post is published
                    if (post.statusName !== "Published") {
                        return res.status(404).send("Bài viết không tồn tại hoặc chưa được xuất bản");
                    }

                    // Fetch author information
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

                            // Fetch comments for the post
                            commentModel.getCommentsByPostId(id, (err, comments) => {
                                if (err) {
                                    console.error("Lỗi khi lấy bình luận:", err);
                                    return res.status(500).send("Không thể lấy bình luận");
                                }

                                console.log(comments);

                                // Render post detail view
                                res.render("vwPost/post-detail", {
                                    layout: "main",
                                    title: post.title,
                                    post: post, // Single post data
                                    category: categories[0], // Category information
                                    author: author, // Author information
                                    user: req.session.user, // User information
                                    comments: comments, // Comments for the post
                                });
                            });
                        });
                    });
                });
            } else {
                // Show a message to prompt the user to subscribe
                req.session.notification = {
                    type: "warning",
                        content: "Bài viết này chỉ dành cho người đăng ký",
                };
                res.redirect("/main");
            }
        });
    },

    // Show the category page
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

                if (req.session.isSubscriber) {
                    postModel.getPostsByCategory(id, (err, posts) => {
                        if (err) {
                            return res.status(500).send("Không thể lấy bài viết của danh mục này");
                        }
                        homeModel.getTop5MostLikedPostsByCategory(id, (err, hotPosts) => {
                            if (err) {
                                return res.status(500).send("Không thể lấy bài viết được yêu thích nhất của danh mục này");
                            }

                            // Render the homepage view
                            res.render("vwPost/byCat", {
                                layout: "main",
                                user: req.session.user,
                                title: category[0].name,
                                categories: filteredCategories,    // Hierarchical categories
                                posts,
                                hotPosts
                            });
                        });
                    })
                } else if (req.session.isUser) {
                    postModel.getPostsByCategoryNoPremium(id, (err, posts) => {
                        if (err) {
                            return res.status(500).send("Không thể lấy bài viết của danh mục này");
                        }
                        homeModel.getTop5MostLikedPostsByCategoryNoPremium(id, (err, hotPosts) => {
                            if (err) {
                                return res.status(500).send("Không thể lấy bài viết được yêu thích nhất của danh mục này");
                            }

                            // Render the homepage view
                            res.render("vwPost/byCat", {
                                layout: "main",
                                user: req.session.user,
                                title: category[0].name,
                                categories: filteredCategories,    // Hierarchical categories
                                posts,
                                hotPosts
                            });
                        });
                    })
                }
            });
        });
    },

    // Like a post
    likePost: (req, res) => {
        const {id} = req.params;

        if (req.session.isUser) {
            postModel.updateLike(id, (err) => {
                if (err) {
                    console.error("Lỗi khi cập nhật lượt thích:", err);
                    return res.status(500).send("Không thể cập nhật lượt thích");
                }

                // Redirect back to referer
                res.redirect(req.headers.referer);
            });
        } else {
            res.redirect("/login");
        }
    },

    // Search for posts
    search: (req, res) => {
        const query = req.query.q || "";

        // Ensure page is within valid range
        if (!req.query.page) {
            return res.redirect("./search?q=" + query + "&page=1");
        }

        let {page} = req.query;
        page = Math.max(page, 1)


        // Limit the number of results per page
        const limit = 10;

        // Calculate start index for pagination
        const startIndex = (page - 1) * limit;

        // Fetch search results
        if (req.session.isSubscriber) {
            homeModel.searchContent(query, limit, startIndex, (err, results) => {
                if (err) {
                    console.error("Lỗi khi tìm kiếm bài viết:", err);
                    return res.status(500).send("Không thể tìm kiếm bài viết");
                }

                if (results.length === 0) {
                    return res.render("vwPost/search", {
                        layout: "main",
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

                    let pages = [];
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

                    // Render search results
                    res.render("vwPost/search", {
                        layout: "main",
                        title: "Kết quả tìm kiếm" + query,
                        posts: results,
                        user: req.session.user,
                        currentPage: page,
                        totalPages,
                        pages,
                        query,
                        message: "Tìm thấy " + nRows + " kết quả phù hợp",
                    });
                });
            });
        } else if (req.session.isUser) {
            homeModel.searchContentNoPremium(query, limit, startIndex, (err, results) => {
                if (err) {
                    console.error("Lỗi khi tìm kiếm bài viết:", err);
                    return res.status(500).send("Không thể tìm kiếm bài viết");
                }

                if (results.length === 0) {
                    return res.render("vwPost/search", {
                        layout: "main",
                        posts: results,
                        user: req.session.user,
                        message: "Không tìm thấy kết quả phù hợp",
                    });
                }

                // Fetch total number of results
                homeModel.searchContentCountNoPremium(query, (err, count) => {
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

                    let pages = [];
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

                    // Render search results
                    res.render("vwPost/search", {
                        layout: "main",
                        title: "Kết quả tìm kiếm" + query,
                        posts: results,
                        user: req.session.user,
                        currentPage: page,
                        totalPages,
                        pages,
                        query,
                        message: "Tìm thấy " + nRows + " kết quả phù hợp",
                    });
                });
            });
        }
    },

    // Subscription page
    showSubscription: (req, res) => {
        const { user, isUser, isSubscriber } = req.session;
        subscriptionModel.getSubscriptionByUserId(user.id, (err, subscription) => {
            if (err) {
                console.error("Lỗi khi lấy thông tin đăng ký:", err);
                return res.status(500).send("Không thể lấy thông tin đăng ký");
            }

            if (subscription.length === 0) {
                return res.render("vwUser/subscription", {
                    layout: "main",
                    title: "Đăng ký gói dịch vụ",
                    user,
                    isUser,
                    isSubscriber,
                });
            } else {
                // Get subscription days left
                subscriptionModel.getUserSubscriptionDaysLeft(user.id, (err, daysLeft) => {
                    if (err) {
                        console.error("Lỗi khi lấy số ngày còn lại của đăng ký:", err);
                        return res.status(500).send("Không thể lấy số ngày còn lại của người dùng");
                    }

                    // Render subscription page
                    res.render("vwUser/subscription", {
                        layout: "main",
                        title: "Gói dịch vụ",
                        user,
                        subscription: subscription[0],
                        isSubscriber,
                        daysLeft,
                        almostExpired: daysLeft <= 3,
                    });
                });

            }
        });
    },

    // Subscribe to a plan

    subscribe: (req, res) => {
        if (req.user.role === 'subscriber') {
            req.session.notification = {
                type: 'warning',
                content: 'Bạn đã đăng ký gói dịch vụ này'
            };
            // Pass the notification to the next request
            return res.redirect('/main');

        }

        // Create a new subscription
        subscriptionModel.subscribe(
            req.user.id,
            30,
            (err) => {
                if (err) {
                    console.log(err);
                    return res.status(500).send('Lỗi khi tạo đăng ký');
                }
                // Set success notification
                req.session.notification = {
                    type: 'success',
                    content: 'Bạn đã đăng ký thành công gói dịch vụ!'
                };

                // Redirect to the main page
                res.redirect('/main');
            }
        );
    },

    // Extend subscription by 30 days
    extendSubscription: (req, res) => {
        const { user } = req.session;
        
        // Check if the user is a subscriber
        subscriptionModel.getSubscriptionByUserId = (user.id, (err, subscription) => {
            if (err) {
                console.error("Lỗi khi lấy thông tin đăng ký:", err);
                return res.status(500).send("Không thể lấy thông tin đăng ký");
            }

            // Check if the user has an active subscription
            if (subscription.length === 0) {
                req.session.notification = {
                    type: 'warning',
                    content: 'Bạn chưa đăng ký gói dịch vụ nên không thể gia hạn'
                };
                return res.redirect('/main');
            }

            // Extend the subscription
            subscriptionModel.extendSubscription(
                user.id,
                30,
                (err) => {
                    if (err) {
                        console.log(err);
                        return res.status(500).send('Lỗi khi gia hạn đăng ký');
                    }

                    // Set success notification
                    req.session.notification = {
                        type: 'success',
                        content: 'Đăng ký cơ bản 30 ngày'
                    };

                    // Redirect to the main page
                    res.redirect('/main');
                }
            );
        });
    },

    comment: (req, res) => {
        const {id} = req.params;
        const {content} = req.body;
        const userId = req.session.user.id;

        commentModel.addComment(id, userId, content, (err) => {
            if (err) {
                console.error("Lỗi khi thêm bình luận:", err);
                return res.status(500).send("Không thể thêm bình luận");
            }

            res.redirect(req.headers.referer);
        });
    },
};

