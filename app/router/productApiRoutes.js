const express=require('express');
const router=express.Router();

const ProductController=require('../controller/ProductApiController');
const studentImageUpload=require('../helper/productImageUpload');
const csvUpload = require('../helper/csvfileupload');

router.post('/product/create',studentImageUpload.array('image',10),ProductController.createProduct);
router.get('/product/list',ProductController.getAllProduct);
router.get('/product/filter',ProductController.getFilterAllProduct);
router.get('/product/search',ProductController.getSearchedProduct);
router.get('/product/:id',ProductController.getProduct);
router.post('/product/update/:id',studentImageUpload.array('image',10),ProductController.updateProduct);
router.post('/product/softDelete/:id',ProductController.softDeleteProduct);
router.get('/product/delete/:id',ProductController.deleteProduct);

//csv route
router.post('/user/create',csvUpload.single('file'),ProductController.createCsv);


module.exports=router;

