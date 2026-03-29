import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, Relation } from "typeorm";
import { Book } from "./book.entity.js";
import { BaseModel } from "../core/base-entity.js";
import { Kurslar } from "./course.entity.js";
import { User } from "./user.entity.js";


// ActiveRecord
@Entity("courses_grade")
export class CourseGrade extends BaseModel {

    @Column()
    star: number;

    @Column()
    comment: string;

    @Column()
    courseId: number;

    @ManyToOne(() => Kurslar, kurslar => kurslar.grades, { onDelete: "CASCADE" })
    @JoinColumn({ name: "courseId" })
    course: Relation<Kurslar>;

    @Column()
    userId: number;
    @ManyToOne(() => User, user => user.grades, { onDelete: "CASCADE" })
    @JoinColumn({ name: "userId" })
    user: Relation<User>;
}