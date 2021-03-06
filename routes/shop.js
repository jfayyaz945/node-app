const path = require('path');
const express = require('express');

const shopController = require('../controllers/shop');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.get('/', shopController.getIndex);

router.get('/products', shopController.getProducts);

router.get('/shop', shopController.getShop);
router.get('/wishlist', shopController.getWishlist);
router.get('/single-product', shopController.getSingleProduct);
router.get('/cart', shopController.getCart);
router.get('/checkout', shopController.getCheckout);

router.get('/about', shopController.getAboutPage);
router.get('/blog', shopController.getBlogPage);
router.get('/blog-single', shopController.getBlogSinglePage);
router.get('/contact', shopController.getContactPage);

router.get('/products/:productId', shopController.getProduct);

router.get('/cart', isAuth, shopController.getCart);

router.post('/cart', isAuth, shopController.postCart);

router.post('/cart-delete-item', isAuth, shopController.postCartProductDelete);

router.post('/create-order', isAuth, shopController.postOrder);
router.get('/orders', isAuth, shopController.getOrder);

module.exports = router;