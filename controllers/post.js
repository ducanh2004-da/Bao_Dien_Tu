const postModel = require("../models/post.js");
const categoryModel = require("../models/category.js");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

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

      res.render("PostArticle", {
        layout: "user",
        categories: filteredCategories,
      });
    });
  },

  showMyArticlePage: (req, res) => {
    const statusFilter = req.query.statusName || "all";
    const userId = 1;

    postModel.getArticlesByStatus(statusFilter, userId, (err, articles) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Lỗi khi lấy bài viết.");
      }
      res.render("MyArticle", {
        layout: "user",
        articles: articles,
      });
    });
  },

  showFixArticlePage: (req, res) => {
    const id = req.query.id;
    postModel.getArticlesById(id, (err, article) => {
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
        res.render("FixArticle", {
          layout: "user",
          categories: filteredCategories,
          article: article[0],
        });
      });
    });
  },

  showRefuseArticlePage: (req, res) => {
    res.render("RefuseArticle", {
      layout: "user",
    });
  },

  showCategoryPage: (req, res) => {
    res.render("Category", {
      layout: "user",
    });
  },

  submitArticle: (req, res) => {
    // Gọi hàm getNextId để lấy ID tiếp theo
    postModel.getNextId("posts", (err, nextId) => {
      if (err) {
        console.error("Lỗi khi lấy ID tiếp theo:", err);
        return res.status(500).send("Lỗi khi lấy ID tiếp theo");
      }

      // Cấu hình lưu ảnh với thư mục theo ID bài viết
      const storage = multer.diskStorage({
        destination: function (req, file, cb) {
          const folderPath = `./public/posts/imgs/${nextId}`;
          if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath, { recursive: true }); // Tạo thư mục nếu chưa tồn tại
          }
          cb(null, folderPath); // Lưu ảnh vào thư mục theo ID bài viết
        },
        filename: function (req, file, cb) {
          cb(null, "thumbnail" + path.extname(file.originalname)); // Đặt tên file là thumbnail.<ext>
        },
      });

      const upload = multer({ storage }).single("thumbnail");

      // Xử lý upload ảnh
      upload(req, res, (err) => {
        if (err) {
          console.error("Lỗi khi upload ảnh:", err);
          return res.status(500).send("Lỗi khi upload ảnh");
        }

        const { title, summary, content, category, tags } = req.body;

        // Thêm bài viết vào database
        postModel.insertArticle(
          {
            title: title,
            category: parseInt(category, 10), // Đảm bảo ID chuyên mục là số
            summary: summary,
            content: content,
            userId: 1, // Lấy ID người dùng từ session
          },
          (insertErr, result) => {
            if (insertErr) {
              console.error("Lỗi khi thêm bài viết:", insertErr);
              return res.status(500).send("Lỗi khi thêm bài viết");
            }

            // Chuyển hướng tới trang bài viết
            res.redirect(`/editor/my-article`);
          }
        );
      });
    });
  },

  submitFixArticle: (req, res) => {
    const id = req.query.id;
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

      // Thêm bài viết vào database
      postModel.updateArticle(
        {
          title: title,
          category: parseInt(category, 10), // Đảm bảo ID chuyên mục là số
          summary: summary,
          content: content,
          userId: 1, // Lấy ID người dùng từ session
        },
        (insertErr, result) => {
          if (insertErr) {
            console.error("Lỗi khi thêm bài viết:", insertErr);
            return res.status(500).send("Lỗi khi thêm bài viết");
          }

          // Chuyển hướng tới trang bài viết
          res.redirect(`/editor/my-article`);
        }
      );
    });
  },
};
