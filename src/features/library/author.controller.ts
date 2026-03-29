import {Router} from "express";
import {Author} from "../../entities/author.entity.js";

const authorRouter = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Author:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         
 *         name:
 *           type: string
 *           example: "Robert Martin"
 *         books:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Book'
 *
 *     AuthorCreate:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         
 *         name:
 *           type: string
 *           example: "Kyle Simpson"
 */

/**
 * @swagger
 * /authors:
 *   post:
 *     summary: Yangi author qo‘shish
 *     tags:
 *       - Authors
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AuthorCreate'
 *     responses:
 *       201:
 *         description: Author muvaffaqiyatli yaratildi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Author'
 *       400:
 *         description: Noto‘g‘ri ma’lumot
 */


authorRouter.post("/authors", async (req, res) => {
    const {name} = req.body;
    let newAuthor = Author.create({name});
    await Author.save(newAuthor);
    res.status(201).send(newAuthor);
});

/**
 * @swagger
 * /authors:
 *   get:
 *     summary: Barcha authorlarni olish
 *     tags:
 *       - Authors
 *     responses:
 *       200:
 *         description: Authorlar ro‘yxati
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Author'
 */



authorRouter.get("/authors", async (req, res) => {
    res.send(await Author.find());
})

export default authorRouter;