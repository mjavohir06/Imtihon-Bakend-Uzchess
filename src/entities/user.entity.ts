import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn, Relation } from "typeorm";

import { CourseGrade } from "./course_grade.entity.js";
import { BaseModel } from "../core/base-entity.js";
import { Roles } from "./constanta/Roles.enum.js";

// ActiveRecord
@Entity("users")
export class User extends BaseModel {


    @Column({ length: 32 })
    name: string;

    @Column({ length: 64 })
    login: string;
    @Column({ length: 32 })
    parol: string;

    @Column({ type: "enum", default: Roles.User, enum: Roles })
    role: string;

    @Column({ type: "enum", enum: ["tel", "email"] })
    login_type: string;

    @OneToMany(() => CourseGrade, courseGrade => courseGrade.user)
    grades: Relation<CourseGrade[]>;

}