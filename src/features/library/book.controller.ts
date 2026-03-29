import {Router} from "express";
import {Book} from "../../entities/book.entity.js";
import { validateDto } from "../../middlewars/validate.js";
import { CreateBookDto } from "../../dto/Books/Create-book.dto.js";
import { UpdateBookDto } from "../../dto/Books/Update-book.dto.js";

const bookRouter = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Book:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         img:
 *           type: string
 *           example: "https://example.com/book.png"
 *         title:
 *           type: string
 *           example: "Clean Code"
 *         price_old:
 *           type: integer
 *           nullable: true
 *           example: 180000
 *         price_new:
 *           type: integer
 *           example: 150000
 *         author_id:
 *           type: integer
 *           example: 2
 *         daraja_id:
 *           type: integer
 *           example: 1
 *         category_id:
 *           type: integer
 *           example: 2
 *         language_id:
 *           type: integer
 *           example: 1
 *         created_at:
 *           type: string
 *           format: date-time
 *           example: "2026-01-07T12:00:00.000Z"
 *         author:
 *           $ref: '#/components/schemas/Author'
 *
 *     BookCreate:
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
 *           example: "https://example.com/book.png"
 *         title:
 *           type: string
 *           example: "You Don't Know JS"
 *         price_old:
 *           type: integer
 *           nullable: true
 *           example: 200000
 *         price_new:
 *           type: integer
 *           example: 160000
 *         author_id:
 *           type: integer
 *           example: 3
 *         daraja_id:
 *           type: integer
 *           example: 1
 *         category_id:
 *           type: integer
 *           example: 2
 *         language_id:
 *           type: integer
 *           example: 1
 * 
  * @swagger
 * components:
 *   schemas:
 *     UpdateBook:
 *       type: object
 *       properties:
 *         img:
 *           type: string
 *           example: "https://example.com/new-book.png"
 *         title:
 *           type: string
 *           example: "Refactoring"
 *         price_old:
 *           type: integer
 *           nullable: true
 *           example: 200000
 *         price_new:
 *           type: integer
 *           example: 170000
 *         author_id:
 *           type: integer
 *           example: 1
 *         daraja_id:
 *           type: integer
 *           example: 1
 *         category_id:
 *           type: integer
 *           example: 2
 *         language_id:
 *           type: integer
 *           example: 1
 */

/**
 * @swagger
 * /books:
 *   get:
 *     summary: Barcha kitoblarni olish
 *     description: Kitoblar ro‘yxatini author ma’lumotlari bilan qaytaradi
 *     tags:
 *       - Books
 *     responses:
 *       200:
 *         description: Kitoblar muvaffaqiyatli olindi
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Book'
 */



bookRouter.get("/books", async (req, res) => {
    let books = await Book.find({relations: ["author","language","daraja"]});
    res.send(books);
})

/**
 * @swagger
 * /books:
 *   post:
 *     summary: Yangi kitob qo‘shish
 *     tags:
 *       - Books
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BookCreate'
 *     responses:
 *       201:
 *         description: Kitob muvaffaqiyatli yaratildi
 *       400:
 *         description: Noto‘g‘ri ma’lumot
 */


bookRouter.post("/books",validateDto(CreateBookDto), async (req, res) => {
    await Book.save(Book.create(req.body));
    res.status(201).send(req.body);
})

/**
 * @swagger
 * /books/{id}:
 *   patch:
 *     summary: Kitobni qisman yangilash
 *     description: Kitobning faqat yuborilgan maydonlarini yangilaydi
 *     tags:
 *       - Books
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 3
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateBook'
 *     responses:
 *       200:
 *         description: Kitob muvaffaqiyatli yangilandi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       404:
 *         description: Kitob topilmadi
 *       400:
 *         description: Validatsiya xatosi
 */

bookRouter.patch("/books/:id",validateDto(UpdateBookDto), async (req, res) => {
    const id = req.params.id;
    let book = await Book.findOneBy({id: parseInt(id)});
    if (!book) {
        return res.status(404).send({message: "Kitob topilmadi"});
    }
    Book.merge(book, req.body);
    await Book.save(book);
    res.send(book);
})

export default bookRouter;