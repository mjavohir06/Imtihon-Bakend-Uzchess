import multer from "multer";

// ---------------------Storagelar-----------------------

const storageNews=multer.diskStorage({
    destination:(req,file,callback)=>{
        callback(null,"./public/uploads/news")
    },
    filename:(req,file,callback)=>{
        callback(null,`${Date.now()}_${file.originalname}`)
    }
})

const storageIcons=multer.diskStorage({
    destination:(req,file,callback)=>{
        callback(null,"./public/uploads/icons")
    },
    filename:(req,file,callback)=>{
        callback(null,`${Date.now()}_${file.originalname}`)
    }
})

// ---------------------Filterlar----------------------------

const ImageFilter:multer.Options['fileFilter']=(req,file,callback)=>{
    const allowedTypes=["image/png","image/jpeg","image/jpg"]
    if(!allowedTypes.includes(file.mimetype)){
        callback (new Error("Ruxsat etinmagan Fayl turi jo'natildi. Faqat Rasmlar qabul qilinadi!"))
    }else{
        callback(null,true)
    }
}

const IconFilter:multer.Options['fileFilter']=(req,file,callback)=>{
    const allowedTypes=["image/svg"]
    if(!allowedTypes.includes(file.mimetype)){
        callback (new Error("Ruxsat etinmagan Fayl turi jo'natildi. Faqat icon qabul qilinadi!"))
    }else{
        callback(null,true)
    }
}



// -----------------------middlewarelar--------------------------

export const NewsImage=multer({
    storage:storageNews,
    fileFilter:ImageFilter,
    limits:{
        fieldSize:1024*1024*5
    }
})

export const uploadsImage=multer({
    storage:storageIcons,
    fileFilter:IconFilter,
})