const express = require('express');
const reportController = require('../controllers/reportController');
const router = express.Router();

router.get('/', reportController.getReportByDate);



module.exports = router;
