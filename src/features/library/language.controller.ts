import {Router} from "express";
import {Language} from "../../entities/language.entity.js";

const languageRouter = Router();
/**
 * @swagger
 * components:
 *   schemas:
 *     Language:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         title:
 *           type: string
 *           example: "O‘zbek"
 *         code:
 *           type: string
 *           example: "uz"
 *
 *     LanguageCreate:
 *       type: object
 *       required:
 *         - title
 *         - code
 *       properties:
 *         title:
 *           type: string
 *           example: "English"
 *         code:
 *           type: string
 *           example: "en"
 */

/**
 * @swagger
 * /medialg:
 *   post:
 *     summary: Yangi til qo‘shish
 *     tags:
 *       - Languages
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LanguageCreate'
 *     responses:
 *       201:
 *         description: Til muvaffaqiyatli yaratildi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Language'
 *       400:
 *         description: Noto‘g‘ri ma’lumot
 */


languageRouter.post("/medialg", async (req, res) => {
    const {title,code} = req.body;
    let newLanguage = Language.create({title,code});
    await Language.save(newLanguage);
    res.status(201).send(newLanguage);
});

/**
 * @swagger
 * /medialg:
 *   get:
 *     summary: Barcha tillarni olish
 *     tags:
 *       - Languages
 *     responses:
 *       200:
 *         description: Tillar ro‘yxati
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Language'
 */



languageRouter.get("/medialg", async (req, res) => {
    res.send(await Language.find());
})

export default languageRouter;