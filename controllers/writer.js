const categoryModel = require("../models/category.js");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const writerModel = require("../models/writer.js");

module.exports = {
    showMainPage: (req, res) => {
        res.render("vwWriter/main", {
            layout: "main",
            title: "Trang chủ của tác giả",
            user: req.session.user
        });
    },

    showPostArticlePage: (req, res) => {
        categoryModel.getAllCategories((err, categories) => {
            if (err) {
                console.error("Lỗi khi lấy danh mục:", err);
                return res.status(500).send("Lỗi khi lấy danh mục");
            }

            // Group categories by parent_id
            const filteredCategories = categories
                .filter((category) => category.parent_id === null)
                .map((parent) => ({
                    ...parent,
                    children: categories.filter((child) => child.parent_id === parent.id),
                }));

            res.render("vwWriter/PostArticle", {
                layout: "main",
                title: "Đăng bài viết",
                user: req.session.user,
                categories: filteredCategories,
            });
        });
    },

    showMyArticlePage: (req, res) => {
        const userId = req.session.user.id;
        writerModel.getArticlesByUserId(userId, (err, articles) => {
            if (err) {
                console.error(err);
                return res.status(500).send("Lỗi khi lấy bài viết.");
            }

            // Group articles by statusName
            const groupedArticles = [];
            articles.forEach((article) => {
                const { statusName, ...data } = article;
                const group = groupedArticles.find((group) => group.statusName === statusName);
                if (group) {
                    group.articles.push(data);
                } else {
                    groupedArticles.push({
                        statusName: statusName,
                        articles: [data],
                    });
                }
            });

            res.render("vwWriter/MyArticle", {
                layout: "main",
                title: "Bài viết của tôi",
                user: req.session.user,
                articles: groupedArticles,
            });
        });
    },

    showFixArticlePage: (req, res) => {
        const id = req.query.id;
        writerModel.getArticlesById(id, (err, article) => {
            if (err) {
                return;
            }

            categoryModel.getAllCategories((err, categories) => {
                if (err) {
                    console.error("Lỗi khi lấy danh mục:", err);
                    return res.status(500).send("Lỗi khi lấy danh mục");
                }

                // Group categories by parent_id
                const filteredCategories = categories
                    .filter((category) => category.parent_id === null)
                    .map((parent) => ({
                        ...parent,
                        children: categories.filter((child) => child.parent_id === parent.id),
                    }));

                res.render("vwWriter/FixArticle", {
                    layout: "main",
                    title: "Sửa bài viết",
                    categories: filteredCategories,
                    user: req.session.user,
                    article: article[0],
                });
            });
        });
    },

    showRefuseArticlePage: (req, res) => {
        const id = req.query.id;
        writerModel.getArticlesById(id, (err, article) => {
            if (err) {
                return;
            }

            categoryModel.getAllCategories((err, categories) => {
                if (err) {
                    console.error("Lỗi khi lấy danh mục:", err);
                    return res.status(500).send("Lỗi khi lấy danh mục");
                }
                const filteredCategories = categories.filter(
                    (category) => category.parent_id !== null
                );
                res.render("vwWriter/RefuseArticle", {
                    layout: "main",
                    categories: filteredCategories,
                    user: req.session.user,
                    article: article[0],
                });
            });
        });
    },

    showCategoryPage: (req, res) => {
        res.render("Category", {
            layout: "main",
        });
    },

    submitArticle: (req, res) => {
        writerModel.getNextId("posts", (err, nextId) => {
            if (err) {
                console.error("Lỗi khi lấy ID tiếp theo:", err);
                return res.status(500).send("Lỗi khi lấy ID tiếp theo");
            }

            const storage = multer.diskStorage({
                destination: function (req, file, cb) {
                    const folderPath = `./public/posts/imgs/${nextId}`;
                    if (!fs.existsSync(folderPath)) {
                        fs.mkdirSync(folderPath, { recursive: true });
                    }
                    cb(null, folderPath);
                },
                filename: function (req, file, cb) {
                    cb(null, "thumbnail" + path.extname(file.originalname));
                },
            });

            const upload = multer({ storage }).single("thumbnail");

            upload(req, res, (err) => {
                if (err) {
                    console.error("Lỗi khi upload ảnh:", err);
                    return res.status(500).send("Lỗi khi upload ảnh");
                }

                const { title, summary, content, category, tags } = req.body;

                const categoryId = parseInt(category, 10);
                if (isNaN(categoryId)) {
                    console.error("categoryId không hợp lệ:", category);
                    return res
                        .status(400)
                        .send("Danh mục không hợp lệ. Vui lòng kiểm tra lại.");
                }

                writerModel.insertArticle(
                    {
                        title: title,
                        category: categoryId,
                        summary: summary,
                        content: content,
                        userId: req.session.user.id,
                    },
                    (insertErr, result) => {
                        if (insertErr) {
                            console.error("Lỗi khi thêm bài viết:", insertErr);
                            return res.status(500).send("Lỗi khi thêm bài viết");
                        }

                        res.redirect(`/writer/my-articles`);
                    }
                );
            });
        });
    },

    submitFixArticle: (req, res) => {
        const id = req.query.id;
        const storage = multer.diskStorage({
            destination: function (req, file, cb) {
                const folderPath = `./public/posts/imgs/${id}`;
                if (!fs.existsSync(folderPath)) {
                    fs.mkdirSync(folderPath, { recursive: true });
                }
                cb(null, folderPath);
            },
            filename: function (req, file, cb) {
                cb(null, "thumbnail" + path.extname(file.originalname));
            },
        });

        const upload = multer({ storage }).single("thumbnail");

        upload(req, res, (err) => {
            if (err) {
                console.error("Lỗi khi upload ảnh:", err);
                return res.status(500).send("Lỗi khi upload ảnh");
            }

            const { title, summary, content, category, tags } = req.body;

            writerModel.updateArticle(
                {
                    title: title,
                    category: parseInt(category, 10),
                    summary: summary,
                    content: content,
                    id: id,
                },
                (insertErr, result) => {
                    if (insertErr) {
                        console.error("Lỗi khi sửa bài viết:", insertErr);
                        return res.status(500).send("Lỗi khi sửa bài viết");
                    }

                    writer

                    res.redirect(`/writer/my-articles`);
                }
            );
        });
    },
};
