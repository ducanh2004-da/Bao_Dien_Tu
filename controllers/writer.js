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
                csrfToken: req.csrfToken(),
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
                        children: categories
                            .filter((child) => child.parent_id === parent.id)
                            .map((child) => ({
                                id: child.id,
                                name: child.name,
                            })),
                    }));

                console.log(filteredCategories);

                categoryModel.getPostCategories(id, (err, postCategories) => {
                    if (err) {
                        console.error("Lỗi khi lấy danh mục bài viết:", err);
                        return res.status(500).send("Lỗi khi lấy danh mục bài viết");
                    }

                    res.render("vwWriter/FixArticle", {
                        layout: "main",
                        title: "Sửa bài viết",
                        categories: filteredCategories,
                        postCategories: postCategories,
                        user: req.session.user,
                        article: article[0],
                        tags: article[0].tags.split(","),
                    });
                });
            });
        });
    },

    showRefuse: (req, res) => {
        const id = req.query.id;
        writerModel.getArticlesById(id, (err, article) => {
            if (err) {
                return;
            }
            // Get the column refuse in the article
            const refuse = article[0].refuse;
            return res.json({ refuse });
        });
    },

    showCategoryPage: (req, res) => {
        res.render("Category", {
            layout: "main",
        });
    },

    submitArticle: (req, res) => {
        const { title, abstract, content, category, tags } = req.body;
  const thumbnailPath = req.file.path; // đã được multer lưu
  const is_premium = req.body.is_premium === 'on' ? 1 : 0;
  const categories = Array.isArray(category)
  ? category.map(id => parseInt(id, 10))
  : [parseInt(category, 10)];              // :contentReference[oaicite:7]{index=7}

// 2) Chia tags (nếu là chuỗi “tag1,tag2”) thành mảng
const tagsArray = typeof tags === 'string'
  ? tags.split(',').map(tag => tag.trim())  // :contentReference[oaicite:8]{index=8}
  : tags;                                    // nếu đã là mảng

  // Chèn bài vào DB, cùng đường dẫn thumbnail
  writerModel.insertArticle({
    title,
    abstract,
    content,
    categories,
    tags: tagsArray,
    is_premium,
    userId: req.session.user.id,
    thumbnail: thumbnailPath
  }, (err, result) => {
    if (err) {
      console.error('Lỗi khi thêm bài viết:', err);
      return res.status(500).send('Lỗi khi thêm bài viết');
    }
    res.redirect('/writer/my-articles');
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

            const { title, abstract, content, category, tags } = req.body;
            const is_premium = req.body.is_premium === "on"? 1 : 0;

            writerModel.updateArticle(
                {
                    title: title,
                    abstract: abstract,
                    content: content,
                    category: parseInt(category, 10),
                    is_premium: is_premium,
                    tags: tags,
                    id: id,
                },
                (insertErr, result) => {
                    if (insertErr) {
                        console.error("Lỗi khi sửa bài viết:", insertErr);
                        return res.status(500).send("Lỗi khi sửa bài viết");
                    }

                    res.redirect(`/writer/my-articles`);
                }
            );
        });
    },
};
