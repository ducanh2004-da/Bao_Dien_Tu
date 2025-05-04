const express = require("express");
const router = express.Router();
const multer     = require('multer');
const csurf      = require('csurf');
const path       = require('path');
const fs         = require('fs');
const writerController = require("../controllers/writer.js");
const authMiddleware = require("../middlewares/auth");
const writerModel = require("../models/writer");
const {validateArticlePost} = require('../validators/validators');

const csrfProtection = csurf({ cookie: true });

// Middleware lấy nextId, gắn vào req.nextId
function attachNextId(req, res, next) {
  writerModel.getNextId('posts', (err, nextId) => {
    if (err) return next(err);
    req.nextId = nextId;
    next();
  });
}

// Cấu hình storage dùng req.nextId
const storage = multer.diskStorage({
  destination(req, file, cb) {
    const folder = path.join(__dirname, '..', 'public', 'posts', 'imgs', String(req.nextId));
    fs.mkdirSync(folder, { recursive: true });
    cb(null, folder);
  },
  filename(req, file, cb) {
    cb(null, 'thumbnail' + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

router.get("/", authMiddleware.isUser, authMiddleware.isWriter, (req, res) => {
    res.redirect("/writer/my-articles");
});
router.get("/post-article",csrfProtection, writerController.showPostArticlePage);
router.get("/my-articles", writerController.showMyArticlePage);
router.get("/fix-article", writerController.showFixArticlePage);
router.post("/fix-article/submit", validateArticlePost, writerController.submitFixArticle);
router.get("/refuse-article", writerController.showRefuse);
router.get("/category", writerController.showCategoryPage);
router.post("/submit-article",attachNextId, upload.single('thumbnail'),
            csrfProtection, validateArticlePost, writerController.submitArticle);

module.exports = router;
