const Product = require('../models/product');
const Order = require('../models/order');

exports.getShop = (req, res, next) => {
    res.render('shop/shop', {
        pageTitle: 'Shop', 
        path: '/shop'
        
    });
};

exports.getWishlist = (req, res, next) => {
    res.render('shop/wishlist', {
        pageTitle: 'Wishlist', 
        path: '/wishlist'
        
    });
};

exports.getSingleProduct = (req, res, next) => {
    res.render('shop/single-product', {
        pageTitle: 'Single Product', 
        path: '/single-product'
        
    });
};

exports.getCart = (req, res, next) => {
    res.render('shop/cart', {
        pageTitle: 'Cart', 
        path: '/cart'
        
    });
};

exports.getCheckout = (req, res, next) => {
    res.render('shop/checkout', {
        pageTitle: 'Checkout', 
        path: '/checkout'
        
    });
};

exports.getProducts = (req, res, next) => {
    Product.find()
      .then(products => {
        res.render('shop/shop', {
            prods: products, 
            pageTitle: 'All Products', 
            path: '/products'
            
        });
       })
      .catch(err => {
          console.log(err)
      });
};

exports.getProduct = (req, res, next) => {
    const prodId = req.params.productId;
    Product.findById(prodId)
    .then(product => {
        res.render('shop/detail', {
            product: product,
            pageTitle: product.title,
            path: '/products'
      });
    })
    .catch(err => console.log(err));
};

exports.getIndex = (req, res,next) => {
    Product.find()
      .then(products => {
        res.render('shop/index', {
            prods: products, 
            pageTitle: 'Shop', 
            path: '/',
        });
       })
      .catch(err => {
          console.log(err)
      });
}

/* exports.getCart = (req, res,next) => {
    req.user
        .populate('cart.items.productId')
        .execPopulate()
        .then(user => {
            const products = user.cart.items;
            res.render('shop/cart', {
                pageTitle: 'Your Cart', 
                path: '/cart', 
                products: products
            });
        })
        .catch(err => {
            console.log(err)
        });
} */

exports.postCart = (req, res,next) => {
    const prodId = req.body.productId;
    Product.findById(prodId)
        .then(product => {
            return req.user.addToCart(product);
        })
        .then(result => {
            res.redirect('/cart');
        })
}

exports.postCartProductDelete = (req, res,next) => {
    const prodId = req.body.productId;
    req.user
    .removeFromCart(prodId)
    .then(result => {
        res.redirect('/cart');
    })
    .catch(err => console.log(err));
}

exports.postOrder = (req, res,next) => {
    req.user
        .populate('cart.items.productId')
        .execPopulate()
        .then(user => {
            
            const products = user.cart.items.map(i => {
                return {quantity: i.quantity, product: { ...i.productId._doc} };
            });
            
            const order = new Order({
                user: {
                    email: req.user.email,
                    userId: req.user
                },
                products: products
            });
            console.log(order);
            return order.save();
        })
        .then(result => {
            req.user.clearCart();
        })
        .then(() => {
            res.redirect('/orders');
        })
        .catch(err => console.log(err));
}

exports.getOrder = (req, res,next) => {
    Order.find({"user.userId": req.user._id})
        .then(orders => {
            console.log(orders[0].products[0]);
            res.render('shop/orders', {
                pageTitle: 'Your Orders', 
                path: '/orders', 
                orders: orders
            });
        })
        .catch(err => console.log(err));
}
