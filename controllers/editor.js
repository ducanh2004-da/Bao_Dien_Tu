const editorModel = require("../models/editor.js");
const categoryModel = require("../models/category.js");
const path = require("path");

module.exports = {
  showMainPage: (req, res) => {
    const statusFilter = "Approved";

    editorModel.getArticlesByStatus(statusFilter, (err, articles) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Lỗi khi lấy bài viết.");
      }

      const listCategoryId = articles.map((article) => article.categoryId);
      const listUserId = articles.map((article) => article.userId);
      if (articles && articles.length > 0) {
        editorModel.getCategoriesByIds(listCategoryId, (err, categories) => {
          if (err) {
            console.error(err);
            return res.status(500).send("Lỗi khi lấy danh mục.");
          }

          editorModel.getUsersByIds(listUserId, (err, users) => {
            if (err) {
              console.error(err);
              return res.status(500).send("Lỗi khi lấy thông tin người dùng.");
            }

            const articlesWithNames = articles.map((article) => {
              const categoryName =
                  categories.find((cat) => cat.id === article.categoryId)?.name ||
                  "Không xác định";

              const userName =
                  users.find((user) => user.id === article.userId)?.username ||
                  "Không xác định";

              return {
                ...article,
                categoryName: categoryName,
                userName: userName,
              };
            });
            res.render("editorPage/editor_review", {
              articles: articlesWithNames,
              user: req.session.user
            });
          });
        });
      } else {
        res.render("editorPage/editor_review", {
          articles: null,
          user: req.session.user
        });
      }
    });
  },

  showArticleReview: (req, res) => {
    const id = req.query.id;
    editorModel.getArticlesById(id, (err, article) => {
      if (err) {
        return;
      }
      res.render("editorPage/editor_postreview", {
        article: article[0],
        user: req.session.user
      });
    });
  },

  updateStatusName: (req, res) => {},

  showArticlePage: (req, res) => {
    const statusFilter = req.query.statusName;

    editorModel.getArticlesByStatus(statusFilter, (err, articles) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Lỗi khi lấy bài viết.");
      }

      const listCategoryId = articles.map((article) => article.categoryId);
      const listUserId = articles.map((article) => article.userId);
      if (articles && articles.length > 0) {
        editorModel.getCategoriesByIds(listCategoryId, (err, categories) => {
          if (err) {
            console.error(err);
            return res.status(500).send("Lỗi khi lấy danh mục.");
          }

          editorModel.getUsersByIds(listUserId, (err, users) => {
            if (err) {
              console.error(err);
              return res.status(500).send("Lỗi khi lấy thông tin người dùng.");
            }

            const articlesWithNames = articles.map((article) => {
              const categoryName =
                categories.find((cat) => cat.id === article.categoryId)?.name ||
                "Không xác định";

              const userName =
                users.find((user) => user.id === article.userId)?.username ||
                "Không xác định";

              return {
                ...article,
                categoryName: categoryName,
                userName: userName,
              };
            });
            res.render("editorPage/editor_review", {
              articles: articlesWithNames,
              user: req.session.user
            });
          });
        });
      } else {
        res.render("editorPage/editor_review", {
          articles: null,
          user: req.session.user
        });
      }
    });
  },

  articleApproved: (req, res) => {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ message: "Thiếu ID bài viết." });
    }

    editorModel.updateStatusName("Approved", id, "", (err) => {
      if (err) {
        console.error("Error updating status:", err);
        return res
          .status(500)
          .json({ message: "Có lỗi xảy ra khi cập nhật trạng thái." });
      }
      return res
        .status(200)
        .json({ message: "Cập nhật trạng thái thành công." });
    });
  },
  articleRejected: (req, res) => {
    const { id, rejectReason } = req.body;

    if (!rejectReason || !id) {
      return res
        .status(400)
        .json({ message: "Thiếu lý do từ chối hoặc ID bài viết." });
    }

    editorModel.updateStatusName("Rejected", id, rejectReason, (err) => {
      if (err) {
        console.error("Error updating status:", err);
        return res
          .status(500)
          .json({ message: "Có lỗi xảy ra khi cập nhật trạng thái." });
      }
      return res
        .status(200)
        .json({ message: "Cập nhật trạng thái thành công." });
    });
  },
};
