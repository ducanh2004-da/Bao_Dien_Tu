const postModel = require("../models/post.js");
const categoryModel = require("../models/category.js");
const path = require("path");
const homeModel = require("../models/home.js");
const { post } = require("../routes/writer.js");

module.exports = {
  showMainPage: (req, res) => {
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
          homeModel.getMostViewPost((err,mostViewPost)=>{
            if (err) {
              console.error("Lỗi khi lấy bài viết:", err);
              return res.status(500).send("Lỗi khi lấy bài viết");
            }
              homeModel.getMostLikePost((err,mostLikePost)=>{
                if (err) {
                  console.error("Lỗi khi lấy bài viết:", err);
                  return res.status(500).send("Lỗi khi lấy bài viết");
                }

          res.render("subsPage/subscriber_main.hbs", {
            layout: "main",
            categories: filteredCategories,
            posts: postsWithCategoryNames,
            hotPost: posts[0],
            latestPost: posts,
            groupedByParent: groupedByParent,
            mostViewPost,
            mostLikePost,
            user: req.session.user
          });
        });
      });
        });
      });
    });
  },
};

module.exports.showDetail = (req, res, next) => {
  const id = req.params.id;
  
  homeModel.updateView(id,(err)=>{
    if (err) {
      console.error("Lỗi khi lấy bài viết:", err);
      return res.status(500).send("Lỗi khi lấy bài viết");
    }
  })
  // Fetch the post by ID
  postModel.getPostById(id, (err, posts) => {
    if (err) {
      console.error("Lỗi khi lấy bài viết:", err);
      return res.status(500).send("Lỗi khi lấy bài viết");
    }

      // Assuming you have a function to fetch category by ID
      categoryModel.getCatById(posts.categoryId, (err, categories) => {
        if (err) {
          console.error("Lỗi khi lấy bài viết:", err);
          return res.status(500).send("Lỗi khi lấy bài viết");
        }
          // Pass both post and category data to the view
          res.render("vwPost/post-detail", { 
              posts: posts[0],            // Single post data
              categories: categories[0]         // Category information (name, etc.)
          });
      });
  });
}
module.exports.likePost = (req,res) =>{
  const id = req.params.id;

  homeModel.updateLike(id,(err)=>{
    if (err) {
      console.error("Lỗi khi lấy bài viết:", err);
      return res.status(500).send("Lỗi khi lấy bài viết");
    }
      res.redirect("/home/view");
  })
}

