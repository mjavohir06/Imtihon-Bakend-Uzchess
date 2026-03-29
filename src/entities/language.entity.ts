import {BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn, Relation} from "typeorm";
import {Book} from "./book.entity.js";
import { BaseModel } from "../core/base-entity.js";
import { Kurslar } from "./course.entity.js";

// ActiveRecord
@Entity("language")
export class Language extends BaseModel {

    @Column({length: 32})
    title: string;

    @Column({length: 3})
    code: string;

    @OneToMany(() => Book, book => book.language)
    books: Relation<Book[]>;

    @OneToMany(() => Kurslar, kurslar => kurslar.language)
    kurslar: Relation<Kurslar[]>;
}