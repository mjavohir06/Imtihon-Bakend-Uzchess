import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, BaseEntity, Relation, JoinColumn, ManyToOne } from "typeorm";
import { Author } from "./author.entity.js";
import { BaseModel } from "../core/base-entity.js";
import { Daraja } from "./daraja.entity.js";
import { Language } from "./language.entity.js";
import { Category } from "./category.entity.js";

@Entity("books")
export class Book extends BaseModel {


    @Column()
    img: string;

    @Column({ length: 50 })
    title: string;

    @Column({ type: "int", nullable: true })
    price_old: number;

    @Column({ type: "int" })
    price_new: number;

    @Column()
    author_id: number;

    @ManyToOne(() => Author, author => author.books, { onDelete: "CASCADE" })
    @JoinColumn({ name: "author_id" })
    author: Relation<Author>;

    @Column()
    daraja_id: number;
    @ManyToOne(() => Daraja, daraja => daraja.books, { onDelete: "CASCADE" })
    @JoinColumn({ name: "daraja_id" })
    daraja: Relation<Daraja>;

    @Column()
    category_id: number;
    @ManyToOne(() => Category, category => category.books, { onDelete: "CASCADE" })
    @JoinColumn({ name: "category_id" })
    category: Relation<Category>;

    @Column()
    language_id: number;
    @ManyToOne(() => Language, language => language.books, { onDelete: "CASCADE" })
    @JoinColumn({ name: "language_id" })
    language: Relation<Language>;

}
