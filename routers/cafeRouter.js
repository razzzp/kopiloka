const express = require('express');
const { catchAsync } = require('../utils/catchAsync');
const { requireLogin, isAuthor } = require('../middlewares');
const cafeController = require('../controllers/cafeController');

cafeRouter = express.Router();

cafeRouter.route('/')
    .get(catchAsync(cafeController.retrieveCafes))
    .post(requireLogin, catchAsync(cafeController.createCafe));

cafeRouter.get('/new', requireLogin, cafeController.renderNewForm);

cafeRouter.route('/:id')
    .get(catchAsync(cafeController.retrieveCafe))
    .delete(requireLogin, catchAsync(isAuthor), catchAsync(cafeController.deleteCafe))
    .put(requireLogin, catchAsync(isAuthor), catchAsync(cafeController.updateCafe));

cafeRouter.get('/:id/edit', requireLogin, catchAsync(isAuthor), catchAsync(cafeController.renderEditForm));

module.exports = cafeRouter;