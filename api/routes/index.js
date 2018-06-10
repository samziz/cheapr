const express = require('express');
const routeController = require('../controllers/route.controller');
const router = express.Router();

app.get('/route', routeController.get);

module.exports = router;
