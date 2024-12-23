/*
const multer = require('multer');

/*
    IMPORTANT NOTICE: 
    The older "uploads" must be created first.
*/
/*
const storage = multer.diskStorage({
    //Where file should be saved
    destination:(req, file, cb)=>{
        cb(null, './backend/uploads/');
    },
    // Name of file
    filename: (req, file, cb)=>{
        cb(null, Date.now() + "-" + file.originalname)
    }
})
*/

//////////
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// cloudinary configuration
cloudinary.config({
    cloud_name: "djhd6qba5",
    api_key: "812622557717794",
    api_secret: "fps622VkH2jPnsxTtevoYAbYBRs"
});


const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params:{
        folder: 'Waraqa'
    }
});
///////////



const fileFilter = (req, file, cb)=>{
    let allowedTypes = ["image/jpeg","image/jpg","image/png","image/gif"];
    if(!allowedTypes.includes(file.mimetype)){
        const error = new Error("This type doesn't allowed");
        error.code = "ERROR_FILE_TYPE"
        return cb(error, false)
    }
    cb(null, true)
}
const upload = multer({
    storage:storage,
    fileFilter:fileFilter,
    limits:{
        fileSize: 1024*1024*5 //5MB
    },
    // dest:"./backend/uploads" // Also create the file if doesn't exist
});


function uploadValidation(err,req,res,next){
    if(err.code === "ERROR_FILE_TYPE"){
        res.json({msg:"Worng type"});
        return
    }
}


module.exports = {upload, uploadValidation}