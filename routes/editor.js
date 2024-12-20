const express = require("express");
const router = express.Router();
const editorController = require("../controllers/editor.js");

router.get("/", (req, res) => {
    res.redirect("/editor/article?statusName=Approved");
});
router.get("/article", editorController.showMainPage);
router.get("/article-review", editorController.showArticleReview);
router.post("/article-approved", editorController.articleApproved);
router.post("/article-rejected", editorController.articleRejected);
module.exports = router;
