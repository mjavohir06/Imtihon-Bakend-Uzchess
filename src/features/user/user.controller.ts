import { Router } from "express";
import { validateDto } from "../../middlewars/validate.js";
import { CreateUserDto } from "../../dto/user/Create-user.dto.js";
import jwt from "jsonwebtoken";
import { User } from "../../entities/user.entity.js";
import { authenticate } from "../../middlewars/authenticate.midleware.js";
import { Roles } from "../../entities/constanta/Roles.enum.js";

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         name:
 *           type: string
 *           example: Javohir
 *         login:
 *           type: string
 *           example: javohirbek
 *         role:
 *           type: string
 *           example: Admin
 *         login_type:
 *           type: string
 *           example: local
 */


const userRouter = Router();

/**
 * @swagger
 * /user:
 *   get:
 *     summary: Joriy foydalanuvchini olish
 *     tags: [Users]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Foydalanuvchi maʼlumotlari
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 */


userRouter.get("/user",authenticate(), async (req, res) => {
    const UserID = req.cookies["access_token"] ? jwt.verify(req.cookies["access_token"], process.env.JWT_SECRET!) as {UserID:number} : null;
    if(!UserID){
        return res.status(401).json({message:"Unauthorized"});
    }else{
        const us =await User.findOneBy({id: UserID.UserID});
        const user={name:us.name,login:us.login,role:us.role,login_type:us.login_type};
        res.json(user);
    }
});

/**
 * @swagger
 * /user/refresh:
 *   post:
 *     summary: Access tokenni refresh qilish
 *     tags: [Users]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Token yangilandi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Token refreshed
 *       401:
 *         description: Refresh token yo‘q yoki noto‘g‘ri
 */


userRouter.post("/user/refresh", (req, res) => {
  const refresh = req.cookies.refresh_token;
  if (!refresh) return res.sendStatus(401);
    
  try {
    const payload = jwt.verify(refresh, process.env.JWT_REFRESH_SECRET!);

    const newAccessToken = jwt.sign(
      { sub: payload.sub },
      process.env.JWT_SECRET!,
      { expiresIn: "15m" }
    );
    const refreshToken = jwt.sign(
        { sub: payload.sub},
        process.env.JWT_REFRESH_SECRET!,
        { expiresIn: "7d" }
    );

    res.cookie("access_token", newAccessToken, {
      httpOnly: true,
      maxAge: 15 * 60 * 1000
    });
     res.cookie("refresh_token", refreshToken, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000
    });


    res.json({ message: "Token refreshed" });
  } catch {
    res.sendStatus(401);
  }
});

/**
 * @swagger
 * /user/all:
 *   get:
 *     summary: Barcha foydalanuvchilarni olish (Admin)
 *     tags: [Users]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Userlar ro‘yxati
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Userlar olindi
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *       403:
 *         description: Ruxsat yo‘q
 */

userRouter.get("/user/all",authenticate(Roles.Admin),async (req,res)=>{
    const users=await User.find()
    res.send({message:"Userlar olindi",data:users})
})

/**
 * @swagger
 * /user:
 *   post:
 *     summary: Foydalanuvchi ro‘yxatdan o‘tishi va login
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - login
 *               - parol
 *               - login_type
 *             properties:
 *               name:
 *                 type: string
 *                 example: Javohir
 *               login:
 *                 type: string
 *                 example: javohirbek1326@gmail.com
 *               parol:
 *                 type: string
 *                 example: 123456
 *               login_type:
 *                 type: string
 *                 example: email
 *     responses:
 *       200:
 *         description: Tizimga muvaffaqiyatli kirildi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Tizimga kirildi
 *                 token:
 *                   type: string
 *                 refreshToken:
 *                   type: string
 *       409:
 *         description: Username mavjud
 */

userRouter.post("/user", validateDto(CreateUserDto), async (req, res) => {
    const body = req.body;
    const user = User.create(body);
    const exists=await User.countBy({login:body.login})
    if(exists) return res.status(409).json({message:"Bu username ishlatilmoqda"})
    await User.save(user);
    const token = jwt.sign(
        { UserID: user.UserID },
        process.env.JWT_SECRET!,
        { expiresIn: "15m" }
    );
    const refreshToken = jwt.sign(
        { sub: user.UserID },
        process.env.JWT_REFRESH_SECRET!,
        { expiresIn: "7d" }
    );

    res.cookie("access_token", token, {
        httpOnly: true,
        maxAge: 15 * 60 * 1000
    });

    res.cookie("refresh_token", refreshToken, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({ message: "Tizimga kirildi",token:token,refreshToken });


});

/**
 * @swagger
 * /user/login:
 *   post:
 *     summary: Foydalanuvchi ro‘yxatdan o‘tishi va login
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - login
 *               - parol
 *             properties:
 *               login:
 *                 type: string
 *                 example: javohirbek1326@gmail.com
 *               parol:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       200:
 *         description: Tizimga muvaffaqiyatli kirildi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Tizimga kirildi
 *                 token:
 *                   type: string
 *                 refreshToken:
 *                   type: string
 *       409:
 *         description: Username mavjud
 */


userRouter.post("/user/login",  async (req, res) => {
    const body = req.body;
    if(!body.login || !body.parol) return res.status(400).json({message:"Malumotlar xato!"})
    const user=await User.findOneBy({login:body.login,parol:body.parol})

    const token = jwt.sign(
        { UserID: user.id },
        process.env.JWT_SECRET!,
        { expiresIn: "15m" }
    );
    const refreshToken = jwt.sign(
        { sub: user.id },
        process.env.JWT_REFRESH_SECRET!,
        { expiresIn: "7d" }
    );

    res.cookie("access_token", token, {
        httpOnly: true,
        maxAge: 15 * 60 * 1000
    });

    res.cookie("refresh_token", refreshToken, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({ message: "Tizimga kirildi",token:token,refreshToken });


});

export default userRouter;