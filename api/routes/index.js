const express = require('express');
const routeController = require('../controllers/route.controller');
const router = express.Router();

router.get('/route', routeController.get);

module.exports = router;
