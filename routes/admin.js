const express = require('express');
const { body } = require('express-validator/check');

const adminController = require('../controllers/admin');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

 //GET
router.get('/add', isAuth, adminController.getAddProduct);

router.get('/products', isAuth, adminController.getProducts);

//POST
router.post('/add', 
    [
        body('title')
            .isString()
            .isLength({ min: 3 })
            .trim(),
        body('imageUrl').isURL(),
        body('peice').isFloat(),
        body('description')
            .isLength({ min: 5, max: 400 })
            .trim()
    ]
    ,isAuth, adminController.postAddProduct);

router.get('/edit/:productId', isAuth, adminController.getEditProduct);

router.post('/edit', 
        [
            body('title')
                .isString()
                .isLength({ min: 3 })
                .trim(),
            body('imageUrl').isURL(),
            body('peice'),
            body('description')
                .isLength({ min: 5, max: 400 })
                .trim()
        ]
        , isAuth, adminController.postEditProduct);

router.post('/delete', isAuth, adminController.deleteProduct);


module.exports = router;