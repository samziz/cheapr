const express = require('express');
const routeController = require('../controllers/route.controller');
const router = express.Router();
const validate = require('express-validation');
const schema = require('../schemas/route.schema');

router.post('/route', validate(schema.findRoute), routeController.findRoute);
router.post('/route/all', validate(schema.listRoutes), routeController.listRoutes);

module.exports = router;