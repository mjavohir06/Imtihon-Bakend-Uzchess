import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken"
import { User } from "../entities/user.entity.js";
import { Roles } from "../entities/constanta/Roles.enum.js";

export  const authenticate=(...roles:Roles[])=>async(req: Request, res: Response, next: NextFunction)=> {
    const cookie = req.cookies
    if (!cookie) return res.status(401).json({ message: "Siz ro'yhatdan o'tmagansiz" })
    const access_token = cookie.access_token

    try {
        const UserID = access_token ? jwt.verify(access_token, process.env.JWT_SECRET!) as { UserID: number } : null;
        if (!UserID) {
            return res.status(401).json({ message: "Ro'yhatdan o'tilmagan" });
        } else {
            const us = await User.findOneBy({ id: UserID.UserID });
            if(roles){
                if(roles.includes(us.role as Roles)){
                    return next()
                }
                else{
                    return res.status(403).json({message:"Siz bu amal uchun huquq mavjud emas!!!"})
                }
            }
        }

        next()
    } catch {
        return res.status(401).json({ message: "Ro'yhatdan o'tilmagan" });
    }
}