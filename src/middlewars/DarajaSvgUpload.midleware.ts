import multer from "multer";
import fs from "fs";
import path from "path";

const uploadPath = path.join(process.cwd(), "public/uploads/icons");

if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, uploadPath);
    },
    filename: (req, file, callback) => {
        const ext = path.extname(file.originalname);
        const safeName = file.originalname
            .replace(ext, "")
            .replace(/\s+/g, "_")
            .toLowerCase();

        callback(null, `${Date.now()}_${safeName}${ext}`);
    }
});

const iconFilter: multer.Options["fileFilter"] = (req, file, callback) => {
    const allowedTypes = [
        "image/svg+xml"
    ];

    if (!allowedTypes.includes(file.mimetype)) {
        callback(
            new Error(
                "Ruxsat etilmagan fayl turi. Faqat PNG, JPG, JPEG yoki SVG iconlar qabul qilinadi!"
            )
        );
    } else {
        callback(null, true);
    }
};

export const uploadIcon = multer({
    storage,
    fileFilter: iconFilter,
    limits: {
        fileSize: 1024 * 1024 * 2 
    }
});
