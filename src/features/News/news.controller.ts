import { Router } from "express";
import { authenticate } from "../../middlewars/authenticate.midleware.js";
import { Roles } from "../../entities/constanta/Roles.enum.js";
import { validateDto } from "../../middlewars/validate.js";
import { Create_News } from "../../dto/News/Create.News.dto.js";
import { NewsImage } from "../../middlewars/upload.midleware.js";
import { News } from "../../entities/News.entity.js";
import { getUrl } from "../../Functions/GetUrl.js";

/**
 * @swagger
 * components:
 *   schemas:
 *     News:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         title:
 *           type: string
 *           example: "Yangi yangilik"
 *         img:
 *           type: string
 *           example: "uploads/news_123.jpg"
 *         caption:
 *           type: string
 *           example: "Qisqacha izoh"
 *         HtmlText:
 *           type: string
 *           example: "<p>Yangilikning to'liq matni</p>"
 *         date:
 *           type: string
 *           example: "2026-03-11"
 *         korishlar:
 *           type: integer
 *           example: 0
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * /news:
 *   post:
 *     summary: Yangi yangilik qo'shish (Admin)
 *     tags:
 *       - News
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Yangi yangilik"
 *               caption:
 *                 type: string
 *                 example: "Qisqacha izoh"
 *               HtmlText:
 *                 type: string
 *                 example: "<p>Yangilikning to'liq matni</p>"
 *               date:
 *                 type: string
 *                 example: "2026-03-11"
 *               img:
 *                 type: string
 *                 format: binary
 *                 description: "Yangilik uchun rasm fayli"
 *             required:
 *               - title
 *               - caption
 *               - HtmlText
 *               - date
 *               - img
 *     responses:
 *       200:
 *         description: Qo'shildi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/News'
 *       400:
 *         description: Xato malumotlar
 */

export const NewsRouter = Router()

NewsRouter.post("/news", authenticate(Roles.Admin), NewsImage.single("img"), validateDto(Create_News), async (req, res) => {
    const img = req.file.filename
    if (!img) return res.status(400).json({ message: "Xato malumotlar" })
    console.log(req.file);
    

    try {
        const news = News.create({ ...req.body, img: `uploads/news/${img}` })
        await News.save(news)
        res.json({message:"Qo'shildi",data:news})
    }catch(err){
        res.status(400).json({message:JSON.stringify(err,null,2)})
    }
})

/**
 * @swagger
 * /news/many:
 *   get:
 *     summary: Newslarni olish
 *     tags:
 *       - News
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 5
 *         description: "Olish kerak bo'lgan yangiliklar soni"
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: "Sahifa raqami"
 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 *         description: "Title bo'yicha qidirish"
 *     responses:
 *       200:
 *         description: Olindi!
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/News'
 */

NewsRouter.get("/news/many",async(req,res)=>{
    const limit=Number(req.query.limit) || 12
    const page=Number(req.query.page) || 1
    const title=String(req.query.title)

    const news=await News.find({where:{},skip:limit*(page-1),take:limit,select:["caption","title","id","img","date"]})
    const news2=news.map(e=>{return{...e,img:getUrl(e.img)}})

    
    res.json({message:"Olindi!",data:news2})
})

NewsRouter.get("/news/one/:id",async(req,res)=>{
    const id=Number(req.params.id)
    if(isNaN(id)) return res.status(400).json({message:"Xato malumot!"})

    const news=await News.findOneBy({id:id})
    const morenews=await News.find({select:["caption","title","id","img","date"],take:3})
    const othernews=morenews.map(e=>{return{...e,img:getUrl(e.img)}})
    news.img=getUrl(news.img)
    console.log({...news,othernews});
    
    res.json({message:"Olindi!",data:{...news,othernews}})
})
