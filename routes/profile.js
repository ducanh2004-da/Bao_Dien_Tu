const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profile');

router.get('/',profileController.show);

router.get('/edit', profileController.viewEdit);

router.post('/update',profileController.Edit);

module.exports = router;