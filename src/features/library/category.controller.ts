import {Router} from "express";
import {Category} from "../../entities/category.entity.js";
import { authenticate } from "../../middlewars/authenticate.midleware.js";
import { Roles } from "../../entities/constanta/Roles.enum.js";

const categoryRouter = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Category:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         
 *         name:
 *           type: string
 *           example: "Tarix"
 *         books:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Book'
 *
 *     CategoryCreate:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         
 *         name:
 *           type: string
 *           example: "Tarix"
 */

/**
 * @swagger
 * /category:
 *   post:
 *     summary: Yangi Category qo‘shish
 *     tags:
 *       - Categorys
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CategoryCreate'
 *     responses:
 *       201:
 *         description: Category muvaffaqiyatli yaratildi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       400:
 *         description: Noto‘g‘ri ma’lumot
 */


categoryRouter.post(
  "/category",
  authenticate(Roles.Admin),
  async (req, res) => {
    const { name } = req.body;

    if (!name || typeof name !== "string") 
      return res.status(400).json({ message: "Yuborilgan ma'lumotda xatolik bor" });

    const existing = await Category.findOne({ where: { name } });
    if (existing) 
      return res.status(409).json({ message: "Bu kategoriya allaqachon band" });

    const newCategory = Category.create({ name });

    await Category.save(newCategory);

    res.status(201).json(newCategory);
  }
);


/**
 * @swagger
 * /category:
 *   get:
 *     summary: Barcha Categorylarni olish
 *     tags:
 *       - Categorys
 *     responses:
 *       200:
 *         description: Categorylar ro‘yxati
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Category'
 */

categoryRouter.patch(
  "/category/:oldname",
  authenticate(Roles.Admin),
  async (req, res) => {
    const { name } = req.body;
    const { oldname } = req.params;

    if (oldname === name) {
      return res.status(400).json({ message: "Buni o'zgartirish foydasiz emas" });
    }

    const oldCategory = await Category.findOne({ where: { name: oldname } });
    if (!oldCategory) {
      return res.status(404).json({ message: "Bunday nomli kategoriya mavjud emas" });
    }

    if (!name || typeof name !== "string") {
      return res.status(400).json({ message: "Yuborilgan ma'lumotda xatolik bor" });
    }

    const existing = await Category.findOne({ where: { name } });
    if (existing) {
      return res.status(409).json({ message: "Bu kategoriya allaqachon band" });
    }

    oldCategory.name = name;
    await oldCategory.save();

    res.status(200).json({ message: "Kategoriya nomi yangilandi", category: oldCategory });
  }
);





categoryRouter.get("/category",authenticate(), async (req, res) => {
    res.send({message:"Kategoriyalar olindi",data:await Category.find({select:{name:true,id:true}})});
})

export default categoryRouter;