const express = require('express');
const routeController = require('../controllers/route.controller');
const router = express.Router();

router.post('/route', routeController.findRoute);
router.post('/route/all', routeController.listRoutes);

module.exports = router;