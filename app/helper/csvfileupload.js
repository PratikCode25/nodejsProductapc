const multer=require('multer')
const fs=require('fs')
const path=require('path')


// use multer diskStorage for file upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../../public/csvuploads'), function (error, success) {
            if (error) throw error;
        })
    },
    filename: function (req, file, cb) {
        cb(null,file.originalname)
    }
});
//define uploaded storage path
const csvUpload = multer({ storage: storage });

module.exports=csvUpload

