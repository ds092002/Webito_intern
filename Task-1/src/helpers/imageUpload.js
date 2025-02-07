const multer = require('multer')

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, 'src/public/images');
        cb(null, 'src/public/profile');
    },
    filename: function(req, file, cb) {
        cb(null, `${Date.now()}_${file.originalname}`)
    }
});

exports.upload = multer({storage: storage});