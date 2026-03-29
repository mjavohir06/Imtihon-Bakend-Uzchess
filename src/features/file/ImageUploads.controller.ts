import { Router, Request, Response } from "express";
import { uploadsImage } from "../../middlewars/upload.midleware.js";



export const ImageUploadsRouter=Router()


/**
 * @swagger
 * /imageupload:
 *   post:
 *     tags:
 *       - Uploads
 *     summary: Upload a file
 *     description: Upload a file to the server
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               icon:
 *                 type: string
 *                 format: binary
 *                 description: The file to upload
 *     responses:
 *       201:
 *         description: File uploaded successfully
 *         schema:
 *           type: object
 *           properties:
 *             filename:
 *               type: string
 *               example: "icon-1234567890.png"
 *             path:
 *               type: string
 *               example: "/uploads/icon-1234567890.png"
 *             size:
 *               type: number
 *               example: 5242
 *             mimetype:
 *               type: string
 *               example: "image/png"
 *       400:
 *         description: No file uploaded or validation error
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: "Fayl yuklanmadi"
 *       500:
 *         description: Server error during file upload
 */


ImageUploadsRouter.post("/imageupload",uploadsImage.single("icon"),
    async (req : Request,res : Response)=>{
        // @ts-ignore
        if(!req.file){
            return res.status(400).json({message:"Fayl yuklanmadi"})
        }
        // @ts-ignore
        res.status(201).json(req.file)
    }
)