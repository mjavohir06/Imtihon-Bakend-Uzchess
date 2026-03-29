import { Column, Entity } from "typeorm";
import { BaseModel } from "../core/base-entity.js";



@Entity("News")

export class News extends BaseModel{
    @Column()
    title:string;

    @Column()
    img:string;

    @Column({length:128})
    caption:string;

    @Column()
    HtmlText:string;

    @Column({name:"varchar",length:64})
    date:string

    @Column({default:0})
    korishlar:number
}