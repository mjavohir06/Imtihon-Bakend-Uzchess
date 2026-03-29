import { BaseEntity, Column, CreateDateColumn, PrimaryGeneratedColumn } from "typeorm";


export class BaseModel extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number; 

    @CreateDateColumn({ type: "timestamp" , default: () => "CURRENT_TIMESTAMP" })
    created_at: Date;

    @Column({ type: "timestamp", nullable:true, onUpdate: "CURRENT_TIMESTAMP" })
    updated_at: Date | null;

    @Column({ type: "boolean", default: false })
    is_deleted: boolean;

    @Column({ type: "timestamp", nullable: true })
    deleted_at: Date | null;
}