const express=require('express');
const router=express.Router();

const ProductController=require('../controller/ProductController');
const studentImageUpload=require('../helper/productImageUpload');
const getFiltersData=require('../middleware/getFiltersData');

router.get('/product/add',ProductController.addViewPage);
router.post('/product/add',studentImageUpload.array('image',10),ProductController.createProduct);
router.get('/product/list',getFiltersData,ProductController.getAllProduct);
router.get('/product/filter',getFiltersData,ProductController.getFilterAllProduct);
router.get('/product/search',getFiltersData,ProductController.getSearchedProduct);
router.get('/product/edit/:id',ProductController.editPage);
router.post('/product/update/:id',studentImageUpload.array('image',10),ProductController.updateProduct);
router.post('/product/softDelete/:id',ProductController.softDeleteProduct);
router.get('/product/delete/:id',ProductController.deleteProduct);



module.exports=router;

