const multer =require('multer')


const fileStorageEngine = multer.diskStorage({
    destination: (req, file, cb) => {
    cb(null, './uploads')},
  
    filename: (req, file, cb) =>{
    cb(null, Date.now()+ '..' + file.originalname)
  }
  }
  
  ) 
  
exports.upload = multer({storage : fileStorageEngine})