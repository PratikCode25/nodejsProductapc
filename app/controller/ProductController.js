const Product = require('../model/product');
const fs = require('fs');

class ProductController {

    async addViewPage(req, res) {
        try {
            res.render('product_add', {
                title: 'Product Add page'
            })
        } catch (error) {
            console.log(error);
        }
    }
    async createProduct(req, res) {
        try {
            const { name, description, price, size, color, brand } = req.body;
            const sizeArr = size;
            const colorArr = color.split(',').map((item) => {
                return item.toLowerCase();
            })
            const productData = new Product({
                name,
                description,
                price,
                size: sizeArr,
                color: colorArr,
                brand: brand.toLowerCase()
            })
            if (req.files) {
                productData.image = req.files.map((file) => {
                    return file.path;
                })
            }
            const savedProduct = await productData.save();

            if (savedProduct) {
                req.flash('message','create data Successfully');
                res.redirect('/product/list')
            } else {
                res.redirect('/product/add')
            }
        } catch (error) {
            console.log(error);
        }
    }

    async getAllProduct(req, res) {
        try {
            // const colorFilter= await Product.distinct('color');
            // console.log(colorFilter);
            const products = await Product.find({ isDeleted: false });
            return res.render('product_list', {
                title: 'Product List',
                message:req.flash('message'),
                data: products
            })
        } catch (error) {
            console.log(error);
        }
    }

    async getFilterAllProduct(req, res) {
        try {
            const { size, color, brand } = req.query;
            // console.log(size, color, brand);
            const filterObj = {};
            if (size) {
                filterObj.size = { $in: size }
            }
            if (color) {
                filterObj.color = { $in: color };
            }
            if (brand) {
                filterObj.brand = brand;
            }

            filterObj.isDeleted = false;

            const productData = await Product.find(filterObj);

            return res.render('product_list', {
                title: 'Product List',
                data: productData
            })
        } catch (error) {
            console.log(error);
        }
    }

    async getSearchedProduct(req,res){
        const {name}=req.query;
        const queryObj={}
        if(name){
            queryObj.name={ $regex: name, $options: "i" }
        }
        queryObj.isDeleted=false;
        const productData=await Product.find(queryObj);
        if(productData){
            res.render('product_list',{
                title: 'Product List',
                data: productData
            })
        }
    }

    async editPage(req, res) {
        try {
            const productData = await Product.findById(req.params.id);
            if (productData) {
                res.render('product_edit', {
                    title: 'Product Edit Page',
                    data: productData
                })
            } else {
                res.redirect('/product/list');
            }
        } catch (error) {
            console.log(error);
        }
    }

    async updateProduct(req, res) {
        try {

            const id = req.params.id;
            const productData = await Product.findById(id);
            if (!productData) {
                res.redirect('/product/edit/' + id);
            }

            const { name, description, price, size, color, brand } = req.body;

            const sizeArr = size;
            const colorArr = color.split(',').map((item) => {
                return item.toLowerCase();
            })

            let image = req.files && req.files.length > 0 ? req.files.map((file) => file.path) : productData.image;


            const updatedProduct = await Product.findByIdAndUpdate(id, {
                name, description, price, size: sizeArr, color: colorArr, brand: brand.toLowerCase(), image,
            }, { new: true }, { runValidators: true });
            if (!updatedProduct) {
                return res.redirect('/product/edit/' + id);
            }

            if (req.files && req.files.length > 0 && productData.image.length > 0) {
                productData.image.forEach(imagePath => {
                    if (fs.existsSync(imagePath)) {
                        fs.unlinkSync(imagePath);
                    }
                });
            }

            res.redirect('/product/list');

        } catch (error) {
            console.log(error);
        }
    }
    async getProduct(req, res) {
        try {
            const product = await Product.findById(req.params.id);
            if (!product) {
                return res.status(404).json({ message: `No data found with id:${req.params.id}` })
            }
            return res.status(200).json({
                message: "Product data fetched successfully",
                data: updatedProduct
            })
        } catch (error) {
            return res.status(400).json({
                message: error.message
            })
        }
    }
    async softDeleteProduct(req, res) {
        try {
            // soft delete
            const deletedProduct = await Product.findByIdAndUpdate(req.params.id, { isDeleted: true }, { new: true }, { runValidators: true });
            if (!deletedProduct) {
                return res.redirect('/product/list');
            }
           res.redirect('/product/list');
        } catch (error) {
            console.log(error);
        }
    }

    async deleteProduct(req, res) {
        try {

            const id = req.params.id;
            const productData = await Product.findById(id);
            if (!productData) {
                res.redirect('/product/list');
            }

            const deletedProduct = await Product.findByIdAndDelete(id);
            if (!deletedProduct) {
                res.redirect('/product/list');
            } else {
                if (productData.image.length > 0) {
                    productData.image.forEach(imagePath => {
                        fs.unlinkSync(imagePath);
                    });
                }
                res.redirect('/product/list');
            }

        } catch (error) {
            console.log(error);
        }
    }

}

module.exports = new ProductController();