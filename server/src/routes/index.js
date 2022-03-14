const express = require('express');
const router = express.Router();

// Controllers
const { login, register, checkAuth } = require('../controllers/auth');
const { addFilm, getFilm, getFilms, getFilmBanner } = require('../controllers/film');
const { getCategories } = require('../controllers/category');
const { getUserProfile, getUserOrderHistory, getPurchasedFilm, getUserAvatar } = require('../controllers/user');
const { addTransaction, getTransactions, updateTransaction } = require('../controllers/transaction');

// Middleware
const { auth } = require('../middlewares/auth');
const { uploadFile, uploadMultipleFile } = require('../middlewares/uploadFile');
const { loginValidation, registerValidation, isAdmin } = require('../middlewares/validator');

// Routes
router.post('/login', loginValidation, login);
router.post('/register', registerValidation, register);
router.get('/check-auth', auth, checkAuth);

// user
router.get('/u/avatar', auth, getUserAvatar);
router.get('/u/profile', auth, getUserProfile);
router.get('/u/orders', auth, getUserOrderHistory);
router.get('/u/film/:id', auth, getFilm);
router.get('/u/banner', auth, getFilmBanner);
router.get('/u/films', auth, getPurchasedFilm);

// non member
router.get('/g/film/:id', getFilm);
router.get('/g/banner', getFilmBanner);
router.get('/films', getFilms);

// admin
router.get('/categories', getCategories);
router.post('/film', auth, isAdmin, uploadMultipleFile('thumbnail', 'banner'), addFilm);
router.get('/transactions', auth, isAdmin, getTransactions);
router.patch('/transaction', auth, isAdmin, updateTransaction);
router.post('/transaction/film/:id', auth, isAdmin, uploadFile('transferProof'), addTransaction);

module.exports = router;
