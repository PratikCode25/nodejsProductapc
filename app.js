const express=require('express');
require('dotenv').config();
require('ejs');
const dbCon=require('./app/config/db');

const path=require('path');
const fs=require('path');
const app=express();
const session=require('express-session')
const flash=require('connect-flash')
const cookieparser=require('cookie-parser')


dbCon();


app.use(session({
    cookie: {
        maxAge: 60000
    },
    secret: "pratikdhhdhd",
    resave: false,
    saveUninitialized: false
}));

app.use(cookieparser());
app.use(flash())

app.set('view engine','ejs')
app.set('views','views');

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use(express.static('public'));
app.use('/uploads',express.static(path.join(__dirname,'/uploads')));

const productRoute=require('./app/router/productRote');
app.use(productRoute);

const ProductApiRoute=require('./app/router/productApiRoutes')
app.use(ProductApiRoute)

const port=3005;
app.listen(port,()=>{
    console.log(`Server is running on port ${port}...`);
})
