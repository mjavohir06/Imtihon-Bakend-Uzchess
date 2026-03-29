import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { NextFunction, Request, Response } from "express";

export const validateDto = (dto: any) => {
  return async (req:Request, res:Response, next:NextFunction) => {
    const dtoObject = plainToInstance(dto, req.body);

    const errors = await validate(dtoObject, {
      whitelist: true,
      forbidNonWhitelisted: true,
    });

    if (errors.length > 0) {
      return res.status(400).json({
        message: "Validation error",
        errors: errors.map((e) => ({
          field: e.property,
          constraints: e.constraints,
        })),
      });
    }

    req.body = dtoObject;
    next();
  };
};
