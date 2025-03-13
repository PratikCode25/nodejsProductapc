const mongoose = require('mongoose');
const Schema = mongoose.Schema;




const productSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
    },
    size: {
        type:[String],
        default:[]
    },
    color: {
        type:[String],
        default:[]
    },
    image: {
        type: [String]
    },
    brand:{
        type:String,
        reuired:true
    },
    slug:{
        type:String,
        lowercase:true,
        default:'slug'
    },
    isDeleted:{
        type:Boolean,
        default:false
    }
},
    {
        timestamps: true
    }
)

const productModel=mongoose.model('product_ejs_filter',productSchema);
module.exports=productModel;