const postModel = require("../models/post.js");
const categoryModel = require("../models/category.js");
const path = require("path");
const homeModel = require("../models/home.js");
const { post } = require("../routes/writer.js");

module.exports = {
  showHomePage: (req, res) => {
    categoryModel.getAllCategories((err, categories) => {
      if (err) {
        console.error("Lỗi khi lấy danh mục:", err);
        return res.status(500).send("Lỗi khi lấy danh mục");
      }

      const filteredCategories = categories.filter(
        (category) => category.parent_id !== null
      );

      homeModel.getPostsByNewTime((err, posts) => {
        if (err) {
          console.error("Lỗi khi lấy bài viết:", err);
          return res.status(500).send("Lỗi khi lấy bài viết");
        }

        const postsWithCategoryNames = posts.map((post) => {
          const category = categories.find((cat) => cat.id === post.categoryId);
          const categoryName = category ? category.name : "Không xác định";

          return {
            ...post,
            categoryName: categoryName,
          };
        });

        homeModel.getPostsByParrentId((err, results) => {
          const groupedByParent = results.reduce((acc, row) => {
            const parentId = row.parent_id;

            const parentCategory = categories.find(
              (cat) => cat.id === parentId
            );
            const parentName = parentCategory
              ? parentCategory.name
              : "Không xác định";

            if (!acc[parentName]) {
              acc[parentName] = [];
            }

            acc[parentName].push(row);

            return acc;
          }, {});

          res.render("vwPost/guest", {
            layout: "main",
            categories: filteredCategories,
            posts: postsWithCategoryNames,
            hotPost: posts[0],
            groupedByParent: groupedByParent,
          });
        });
      });
    });
  },
};
