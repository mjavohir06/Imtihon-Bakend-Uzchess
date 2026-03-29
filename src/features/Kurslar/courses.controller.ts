import { Router } from "express";
import { Kurslar } from "../../entities/course.entity.js";
import { authenticate } from "../../middlewars/authenticate.midleware.js";
import { Roles } from "../../entities/constanta/Roles.enum.js";
import { validateDto } from "../../middlewars/validate.js";
import { CreateKursDto } from "../../dto/Courses/Create-course.dto.js";
import { UpdateKursDto } from "../../dto/Courses/Update-course.dto.js";
import { ILike } from "typeorm";
import { getUrl } from "../../Functions/GetUrl.js";

const kurslarRouter = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Kurslar:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         img:
 *           type: string
 *           example: "https://example.com/course.png"
 *         title:
 *           type: string
 *           example: "Node.js Backend"
 *         price_old:
 *           type: integer
 *           nullable: true
 *           example: 300000
 *         price_new:
 *           type: integer
 *           example: 250000
 *         author_id:
 *           type: integer
 *           example: 2
 *         daraja_id:
 *           type: integer
 *           example: 2
 *         category_id:
 *           type: integer
 *           example: 1
 *         language_id:
 *           type: integer
 *           example: 1
 *         created_at:
 *           type: string
 *           format: date-time
 *           example: "2026-01-07T10:00:00.000Z"
 *         author:
 *           $ref: '#/components/schemas/Author'
 *
 *     KurslarCreate:
 *       type: object
 *       required:
 *         - img
 *         - title
 *         - price_new
 *         - author_id
 *         - daraja_id
 *         - category_id
 *         - language_id
 *       properties:
 *         img:
 *           type: string
 *           example: "https://example.com/course.png"
 *         title:
 *           type: string
 *           example: "NestJS Advanced"
 *         price_old:
 *           type: integer
 *           nullable: true
 *           example: 300000
 *         price_new:
 *           type: integer
 *           example: 250000
 *         author_id:
 *           type: integer
 *           example: 2
 *         daraja_id:
 *           type: number
 *           example: 2
 *         category_id:
 *           type: number
 *           example: 1
 *         language_id:
 *           type: number
 *           example: 1
 */



/**
 * @swagger
 * /kurslar/many:
 *   get:
 *     summary: Barcha kurslarni olish
 *     description: Kurslar ro‘yxatini author ma’lumotlari bilan qaytaradi
 *     tags:
 *       - Kurslar
 *     responses:
 *       200:
 *         description: Kurslar muvaffaqiyatli olindi
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Kurslar'
 */


kurslarRouter.get("/kurslar/many", /*authenticate(),*/ async (req, res) => {
  const title=req.query.title?String(req.query.title):undefined
  const page=Number(req.query.page) 
  const limit=Number(req.query.limit) || 5

  if(isNaN(page) || isNaN(limit)){
    res.status(400).json({message:"Ma'lumotda xatolik!"})
  }
  
  const kurslar = await Kurslar.find({where: title? { title: ILike(`%${title}%`) }:{},skip:(page-1)*limit,take:limit,select:["author","author_id","category","category_id","daraja","daraja_id","grades","id","img","language","language_id","title","price_old","price_new"], relations: ["author", "language", "daraja","grades","category"] });

  
  const reskurslar=kurslar.map(e=>{
    console.log(e);
    
    let grade=0,star:string
    for(let g of e.grades){
      grade+=g.star
    }
    if(e.grades.length>1){
      star=(grade/e.grades.length).toFixed(1)
    }else{
      star=(grade).toFixed(1)
    }
    return{...e,img:getUrl(e.img),
    daraja:{
      icon:getUrl(e.daraja.icon),
      title:e.daraja.title,
      id:e.daraja.id
    },
    language:{
      id:e.language.id,
      title:e.language.title,
      code:e.language.code
    },
    author:{
      name:e.author.name,
      id:e.author.id
    },
    category:{
      name:e.category.name
    },
    grades:undefined,
    star:star
  }})
  
  res.send({message:"olindi",data:reskurslar});
})


/**
 * @swagger
 * /kurslar:
 *   post:
 *     summary: Yangi kurs qo‘shish
 *     tags:
 *       - Kurslar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/KurslarCreate'
 *     responses:
 *       201:
 *         description: Kurs muvaffaqiyatli yaratildi
 *       400:
 *         description: Noto‘g‘ri ma’lumot
 */


kurslarRouter.post("/kurslar", authenticate(Roles.Admin), validateDto(CreateKursDto), async (req, res) => {
  await Kurslar.save(Kurslar.create(req.body));
  res.status(201).send(req.body);
})

/**
 * @swagger
 * /kurslar/{id}:
 *   patch:
 *     summary: Kursni yangilash (Admin)
 *     tags: [Kurslar]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Yangilanadigan kurs IDsi
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               img:
 *                 type: string
 *               title:
 *                 type: string
 *               price_old:
 *                 type: integer
 *               price_new:
 *                 type: integer
 *               author_id:
 *                 type: integer
 *               daraja_id:
 *                 type: integer
 *               category_id:
 *                 type: integer
 *               language_id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Kurs yangilandi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Kurs yangilandi
 *                 kurs:
 *                   $ref: '#/components/schemas/Kurslar'
 *       400:
 *         description: Id noto‘g‘ri yoki yuborilgan data xato
 *       404:
 *         description: Kurs topilmadi
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin role talab qilinadi
 */

kurslarRouter.patch("/kurslar/:id", authenticate(Roles.Admin), validateDto(UpdateKursDto), async (req, res) => {
  const id = Number(req.params.id)
  if (isNaN(id)) return res.status(400).json({ message: "Id noto‘g‘ri" });

  const kurs = await Kurslar.findOneBy({ id });
  if (!kurs) return res.status(404).json({ message: "Kurs topilmadi" });

  const dataToUpdate: Partial<typeof kurs> = {};
  Object.entries(req.body).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      dataToUpdate[key] = value;
    }
  });

  Kurslar.merge(kurs, dataToUpdate);
  await Kurslar.save(kurs);

  res.status(200).json({ message: "Kurs yangilandi", kurs });

})

/**
 * @swagger
 * /kurslar/{id}:
 *   delete:
 *     summary: Kursni o‘chirish (Admin)
 *     tags: [Kurslar]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: O‘chiradigan kurs IDsi
 *     responses:
 *       200:
 *         description: Kurs o'chirildi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Kurs o'chirildi
 *                 kurs:
 *                   $ref: '#/components/schemas/Kurslar'
 *       400:
 *         description: Id noto‘g‘ri
 *       404:
 *         description: Kurs topilmadi
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin role talab qilinadi
 */

kurslarRouter.delete(
  "/kurslar/:id",
  authenticate(Roles.Admin),
  async (req, res) => {
    const id = Number(req.params.id);

    if (isNaN(id)) return res.status(400).json({ message: "Id noto‘g‘ri" });

    const kurs = await Kurslar.findOneBy({ id });
    if (!kurs) return res.status(404).json({ message: "Kurs topilmadi" });

    await Kurslar.remove(kurs);

    res.status(200).json({ message: "Kurs o'chirildi", kurs });
  }
);


export default kurslarRouter;