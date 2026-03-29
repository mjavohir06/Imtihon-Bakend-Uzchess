import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, BaseEntity, Relation, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { Author } from "./author.entity.js";
import { BaseModel } from "../core/base-entity.js";
import { Daraja } from "./daraja.entity.js";
import { Language } from "./language.entity.js";
import { Category } from "./category.entity.js";
import { CourseGrade } from "./course_grade.entity.js";

@Entity("courses")
export class Kurslar extends BaseModel {

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
    @ManyToOne(() => Author, author => author.kurslar, { onDelete: "CASCADE" })
    @JoinColumn({ name: "author_id" })
    author: Relation<Author>;

    @Column()
    daraja_id: number;
    @ManyToOne(() => Daraja, daraja => daraja.kurslar, { onDelete: "CASCADE" })
    @JoinColumn({ name: "daraja_id" })
    daraja: Relation<Daraja>;

    @Column()
    category_id: number;
    @ManyToOne(() => Category, category => category.books, { onDelete: "CASCADE" })
    @JoinColumn({ name: "category_id" })
    category: Category;

    @Column()
    language_id: number;
    @ManyToOne(() => Language, language => language.kurslar, { onDelete: "CASCADE" })
    @JoinColumn({ name: "language_id" })
    language: Language;

    @OneToMany(() => CourseGrade, courseGrade => courseGrade.course)
    grades: CourseGrade[];
}