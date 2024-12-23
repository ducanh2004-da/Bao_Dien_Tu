const categoryModel = require("../models/category.js");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const writerModel = require("../models/writer.js");

module.exports = {
  showMainPage: (req, res) => {
    res.render("layouts/user", {
      layout: false,
    });
  },

  showPostArticlePage: (req, res) => {
    categoryModel.getAllCategories((err, categories) => {
      if (err) {
        console.error("Lỗi khi lấy danh mục:", err);
        return res.status(500).send("Lỗi khi lấy danh mục");
      }

      const filteredCategories = categories.filter(
        (category) => category.parent_id !== null
      );

      res.render("writerPage/PostArticle", {
        layout: "user",
        categories: filteredCategories,
      });
    });
  },

  showMyArticlePage: (req, res) => {
    const statusFilter = req.query.statusName;
    const userId = req.session.user.id;
    writerModel.getArticlesByStatus(statusFilter, userId, (err, articles) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Lỗi khi lấy bài viết.");
      }
      res.render("writerPage/MyArticle", {
        layout: "user",
        articles: articles,
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
        const filteredCategories = categories.filter(
          (category) => category.parent_id !== null
        );
        res.render("writerPage/FixArticle", {
          layout: "user",
          categories: filteredCategories,
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
        res.render("writerPage/RefuseArticle", {
          layout: "user",
          categories: filteredCategories,
          article: article[0],
        });
      });
    });
  },

  showCategoryPage: (req, res) => {
    res.render("Category", {
      layout: "user",
    });
  },

  submitArticle: (req, res) => {
    writerModel.getNextId("posts", (err, nextId) => {
      if (err) {
        console.error("Lỗi khi lấy ID tiếp theo:", err);
        return res.status(500).send("Lỗi khi lấy ID tiếp theo");
      }

      if (!req.session || !req.session.user.id) {
        console.error("Không tồn tại user");
        return res.status(401).send("Bạn chưa đăng nhập.");
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

            res.redirect(`/writer/my-article`);
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

          res.redirect(`/writer/my-article`);
        }
      );
    });
  },
};
