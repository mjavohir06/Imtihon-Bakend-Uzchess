import { Column, Entity, OneToMany, PrimaryGeneratedColumn, Relation} from "typeorm";
import {Book} from "./book.entity.js";
import { BaseModel } from "../core/base-entity.js";
import { Kurslar } from "./course.entity.js";


// ActiveRecord
@Entity("daraja")
export class Daraja extends BaseModel {

    @Column({length: 32})
    title: string;

    @Column({length: 128})
    icon: string;

    @OneToMany(() => Book, book => book.daraja)
    books: Relation<Book[]>;

    @OneToMany(() => Kurslar, kurslar => kurslar.daraja)
    kurslar: Relation<Kurslar[]>;
}