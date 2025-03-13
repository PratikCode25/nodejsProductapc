const Product = require('../model/product');

const getFiltersData= async(req,res,next)=>{
  try {
    const colorFilter= await Product.distinct('color');
    const brandFilter= await Product.distinct('brand');

    res.locals.filter = {
        colorFilter,
        brandFilter
      };
      next();
  } catch (error) {
    console.log(error);
  }
  
}

module.exports=getFiltersData;