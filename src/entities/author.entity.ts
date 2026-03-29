import {BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn, Relation} from "typeorm";
import {Book} from "./book.entity.js";
import { BaseModel } from "../core/base-entity.js";
import { Kurslar } from "./course.entity.js";

// ActiveRecord
@Entity("authors")
export class Author extends BaseModel {

    @Column({length: 32})
    name: string;

    @OneToMany(() => Book, book => book.author)
    books: Relation<Book[]>;

    @OneToMany(() => Kurslar, kurslar => kurslar.author)
    kurslar: Relation<Kurslar[]>;
}