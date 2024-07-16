import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('notifications')
export class Notification {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        nullable: true,
    })
    user_id: String;
    
    @Column({
        nullable: false,
    })
    message: String;
    
    @Column({
        nullable: false,
        default: false,
    })
    seen: Boolean;
    
    @Column({
        nullable: false,
        default: false,
    })
    is_deleted: Boolean;

    @CreateDateColumn({
    nullable: true
    })
    created_at: Date;

    @UpdateDateColumn({
    nullable: true
    })
    updated_at: Date;

    @DeleteDateColumn({
    nullable: true
    })
    deleted_at: Date;
}
