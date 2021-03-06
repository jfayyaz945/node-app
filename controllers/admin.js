const { validationResult } = require('express-validator');

const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
    res.render('admin/add', {
        pageTitle: 'Add Product', 
        path: '/admin/add',
        editing: false,
        hasError: false,
        errorMessage: null,
        validationErrors: []
    });
};

exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.edit;
    if(!editMode){
        return res.redirect('/');
    }
    const prodId = req.params.productId;
    Product.findById(prodId)
    .then(product => {
        if(!product){
            return res.redirect('/');
        }
        res.render('admin/add', {
            pageTitle: 'Edit Product', 
            path: '/admin/edit',
            editing: editMode,
            product: product,
            hasError: false,
            errorMessage: null,
            validationErrors: []
        });
     })
    .catch(err => console.log(err));
};

exports.postAddProduct = (req,res, next) => {
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;

    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        return res.status(422).render('admin/add', {
            pageTitle: 'Add Product', 
            path: '/admin/edit',
            editing: false,
            hasError: true,
            product: {
                title: title,
                imageUrl: imageUrl,
                price: price,
                description: description
            },
            errorMessage: errors.array()[0].msg,
            validationErrors: errors.array()
        });
    }

    const product = new Product({title: title, price: price,description: description,imageUrl: imageUrl, userId: req.user});
    product.save()
    .then(result => {
        res.redirect('/admin/products');
    })
    .catch(err => console.log(err));
};

exports.postEditProduct = (req,res, next) => {
    const prodId = req.body.productId;
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;
    
    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        return res.status(422).render('admin/add', {
            pageTitle: 'Edit Product', 
            path: '/admin/edit',
            editing: true,
            hasError: true,
            product: {
                title: title,
                imageUrl: imageUrl,
                price: price,
                description: description,
                _id: prodId
            },
            errorMessage: errors.array()[0].msg,
            validationErrors: errors.array()
        });
    }

    Product.findById(prodId)
        .then(product => {
            if(product.userId.toString() !== req.user._id.toString()){
                return res.redirect('/');
            }
            product.title = title;
            product.price = price;
            product.description = description;
            product.imageUrl = imageUrl;
            return product.save()
                .then(result => {
                    res.redirect('/admin/products');
                })
        })
        
        .catch(err => console.log(err));
};

exports.deleteProduct = (req,res, next) => {
    const prodId = req.body.productId;
    Product.deleteOne({_id: prodId, userId: req.user._id})
        .then(() => {
            res.redirect('/admin/products');
        })
        .catch(err => console.log(err));
}

exports.getProducts = (req,res, next) => {
    Product.find({userId: req.user._id})
      /* .select('title price -_id')
      .populate('userId', 'name') */
      .then(products => {
        res.render('admin/products', {
            prods: products, 
            pageTitle: 'Admin Products', 
            path: '/admin/products',
        });
       })
      .catch(err => {
          console.log(err)
      });
}; 