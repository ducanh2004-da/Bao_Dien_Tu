const express = require("express");
const router = express.Router();
const csurf = require('csurf');
const editorController = require("../controllers/editor.js");

const csrfProtection = csurf({
  cookie: { 
    httpOnly: true,
    sameSite: 'strict', // Dấu phẩy ở cuối
    secure: process.env.NODE_ENV === 'production' // Không có dấu phẩy ở cuối
  }
});

router.get("/", (req, res) => {
    res.redirect("/editor/article?statusName=Approved");
});
router.get("/article", csrfProtection, editorController.showMainPage);
router.get("/article-review", csrfProtection, editorController.showArticleReview);
router.post("/article-approved", csrfProtection, editorController.articleApproved);
router.post("/article-rejected", csrfProtection, editorController.articleRejected);
router.post('/post/:id/accept', csrfProtection,editorController.acceptPost);
router.post('/post/:id/schedule', csrfProtection, editorController.schedulePost);


module.exports = router;
