import "dotenv/config";
import "reflect-metadata";
import express from "express";
import {AppDataSource} from "./core/data-source.js";
import swaggerUi from "swagger-ui-express";
import authorRouter from "./features/library/author.controller.js";
import bookRouter from "./features/library/book.controller.js";
import morgan from "morgan";
import kurslarRouter from "./features/Kurslar/courses.controller.js";
import { swaggerSpec } from "./Swagger/swagger.js";
import darajaRouter from "./features/library/daraja.controller.js";
import categoryRouter from "./features/library/category.controller.js";
import path from "path/win32";
import languageRouter from "./features/library/language.controller.js";
import cookieParser from "cookie-parser";
import { ImageUploadsRouter } from "./features/file/ImageUploads.controller.js";
import userRouter from "./features/user/user.controller.js";
import { NewsRouter } from "./features/News/news.controller.js";
import cors from "cors"


const versiya="/api/v1"


await AppDataSource.initialize();
const app = express();

app.use(cookieParser());
app.use(cors({
  origin:"*"
}))


app.use(express.json());
app.use(morgan("dev"));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(versiya, authorRouter);
app.use(versiya, bookRouter);
app.use(versiya, kurslarRouter)
app.use(versiya, darajaRouter)
app.use(versiya, categoryRouter)
app.use(versiya, languageRouter)
app.use(versiya,ImageUploadsRouter)
app.use(versiya,userRouter)
app.use(versiya,NewsRouter)

app.use(
  "/uploads",
  express.static(path.join(process.cwd(), "public/uploads"))
);


app.listen(4000, "0.0.0.0", () => console.log("Server is listening..."));