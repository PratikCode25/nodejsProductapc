const Product = require('../model/product');
const fs = require('fs');
const CSVmodel = require('../model/usercsv')
const csv = require('csvtojson')
const path = require('path')
const slug=require('slugify')
class ProductController {

    async createProduct(req, res) {
        try {
            const { name, description, price, size, color, brand } = req.body;
            // if (description && description.length < 20) {
            //     return res.status(400).json({
            //         message: "Description minimum length should be 20",
            //     })
            // }
            // if (price && price < 100) {
            //     return res.status(400).json({
            //         message: "Price should be greater than 100",
            //     })
            // }
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
                brand: brand.toLowerCase(),
                slug:slug(name)
            })
            if (req.files) {
                productData.image = req.files.map((file) => {
                    return file.path;
                })
            }
            const savedProduct = await productData.save();

            if (savedProduct) {
                return res.status(201).json({
                    message: "Product is created successfully",
                    data: savedProduct
                })
            }
        } catch (error) {
            return res.status(500).json({
                message: error.message
            })
        }
    }

    async getAllProduct(req, res) {
        try {
            const products = await Product.find({ isDeleted: false });
            return res.status(200).json({
                message: "Products data fetched successfully",
                total: products.length,
                data: products
            })
        } catch (error) {
            return res.status(500).json({
                message: error.message
            })
        }
    }

    async getFilterAllProduct(req, res) {
        try {
            const { size, color, brand } = req.query;
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
            return res.status(200).json({
                message: "Products data fetched successfully",
                total: productData.length,
                data: productData
            })

        } catch (error) {
            return res.status(500).json({
                message: error.message
            })
        }
    }

    async getSearchedProduct(req, res) {
        try {
            const { name } = req.query;
            const queryObj = {}
            if (name) {
                queryObj.name = { $regex: name, $options: "i" }
            }
            const productData = await Product.find(queryObj);
            return res.status(200).json({
                message: "Products data fetched successfully",
                total: productData.length,
                data: productData
            })
        } catch (error) {
            return res.status(500).json({
                message: error.message
            })
        }


    }


    async updateProduct(req, res) {
        try {

            const id = req.params.id;
            const productData = await Product.findById(id);
            if (!productData) {
                return res.status(404).json({ message: `No data found with id:${req.params.id}` });
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
                return res.status(404).json({ message: `No data found with id:${req.params.id}` });
            }

            if (req.files && req.files.length > 0 && productData.image.length > 0) {
                productData.image.forEach(imagePath => {
                    if (fs.existsSync(imagePath)) {
                        fs.unlinkSync(imagePath);
                    }
                });
            }

            return res.status(200).json({
                message: "Product data updated successfully",
                data: updatedProduct
            })

        } catch (error) {
            return res.status(500).json({
                message: error.message
            })
        }
    }
    async getProduct(req, res) {
        try {
            const productData = await Product.findById(req.params.id);
            if (!productData) {
                return res.status(404).json({ message: `No data found with id:${req.params.id}` })
            }
            return res.status(200).json({
                message: "Product data fetched successfully",
                data: productData
            })
        } catch (error) {
            return res.status(500).json({
                message: error.message
            })
        }
    }
    async softDeleteProduct(req, res) {
        try {
            const deletedProduct = await Product.findByIdAndUpdate(req.params.id, { isDeleted: true }, { new: true }, { runValidators: true });
            if (!deletedProduct) {
                return res.status(404).json({ message: `No data found with id:${req.params.id}` });
            }
            return res.status(200).json({
                message: "Product data deleted successfully",
                data: deletedProduct
            })
        } catch (error) {
            return res.status(500).json({
                message: error.message
            })
        }
    }

    async deleteProduct(req, res) {
        try {

            const id = req.params.id;
            const productData = await Product.findById(id);
            if (!productData) {
                return res.status(404).json({ message: `No data found with id:${req.params.id}` });
            }

            const deletedProduct = await Product.findByIdAndDelete(id);
            if (!deletedProduct) {
                return res.status(404).json({ message: `No data found with id:${req.params.id}` });
            }
            if (productData.image.length > 0) {
                productData.image.forEach(imagePath => {
                    fs.unlinkSync(imagePath);
                });
            }
            return res.status(200).json({
                message: "Product data deleted successfully",
                data: deletedProduct
            })

        } catch (error) {
            return res.status(500).json({
                message: error.message
            })
        }
    }


    //csv file upload

    async createCsv(req, res) {

        try {
            const userData = []

            csv()
                .fromFile(req.file.path)
                .then(async (response) => {
                    //console.log(response);
                    for (let x = 0; x < response.length; x++) {
                        userData.push({
                            name: response[x].name,
                            email: response[x].email,
                            phone: response[x].phone,
                            city: response[x].city
                        })
                    }
                    const datas = await CSVmodel.insertMany(userData)
                    res.status(200).json({
                        message: "csv file uploaded successfully",
                        data: datas
                    })
                })


        } catch (error) {
            console.log(error);

        }
    }
}

module.exports = new ProductController();