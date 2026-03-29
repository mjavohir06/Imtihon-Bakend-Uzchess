import { Router } from "express";
import { Daraja } from "../../entities/daraja.entity.js";
import { uploadIcon } from "../../middlewars/DarajaSvgUpload.midleware.js";
import { authenticate } from "../../middlewars/authenticate.midleware.js";
import { Roles } from "../../entities/constanta/Roles.enum.js";

const darajaRouter = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Daraja:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         title:
 *           type: string
 *           example: "Beginner"
 *         icon:
 *           type: string
 *           example: "http://localhost:3000/public/uploads/icons/star.png"
 *
 *     DarajaCreate:
 *       type: object
 *       required:
 *         - title
 *         - icon
 *       properties:
 *         title:
 *           type: string
 *           example: "Senior"
 *         icon:
 *           type: string
 *           format: binary
 */

/**
 * @swagger
 * /daraja:
 *   post:
 *     summary: Yangi daraja qo‘shish
 *     description: Faqat Admin foydalanuvchi daraja qo‘sha oladi
 *     tags:
 *       - Daraja
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/DarajaCreate'
 *     responses:
 *       201:
 *         description: Daraja muvaffaqiyatli yaratildi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Daraja'
 *       401:
 *         description: Ro‘yxatdan o‘tilmagan
 *       403:
 *         description: Admin huquqi yo‘q
 */




darajaRouter.post("/daraja", authenticate(Roles.Admin), uploadIcon.single("icon"), async (req, res) => {
    const { title } = req.body;
    const filename = req.file.fieldname
    let newDaraja = Daraja.create({ title, icon: filename });
    await Daraja.save(newDaraja);
    res.status(201).send(newDaraja);
});

/**
 * @swagger
 * /daraja:
 *   get:
 *     summary: Barcha darajalarni olish
 *     tags:
 *       - Daraja
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Darajalar ro‘yxati
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Darajalar"
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Daraja'
 *       401:
 *         description: Ro‘yxatdan o‘tilmagan
 */



darajaRouter.get("/daraja", authenticate(), async (req, res) => {
    const daraja = await Daraja.find();

    const baseUrl = `${req.protocol}://${req.get("host")}`;

    daraja.forEach(d => {
        d.icon = `${baseUrl}/public/uploads/icons/${d.icon}`;
    });

    res.json({ message: "Darajalar", data: daraja });
});


export default darajaRouter;