const express = require('express');
const { catchAsync } = require('../utils/catchAsync');
const { requireLogin, isAuthor } = require('../middlewares');
const cafeController = require('../controllers/cafeController');

cafeRouter = express.Router();

cafeRouter.get('/', catchAsync(cafeController.retrieveCafes));

cafeRouter.post('/', requireLogin, catchAsync(cafeController.createCafe));

cafeRouter.get('/new', requireLogin, cafeController.renderNewForm);

cafeRouter.get('/:id', catchAsync(cafeController.retrieveCafe));

cafeRouter.delete('/:id', requireLogin, catchAsync(isAuthor), catchAsync(cafeController.deleteCafe));

cafeRouter.put('/:id', requireLogin, catchAsync(isAuthor), catchAsync(cafeController.updateCafe));

cafeRouter.get('/:id/edit', requireLogin, catchAsync(isAuthor), catchAsync(cafeController.renderEditForm));

module.exports = cafeRouter;