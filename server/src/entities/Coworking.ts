import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { User } from "./User";

@Entity('coworking')
export class Coworking {
    @PrimaryGeneratedColumn()
    coworking_id: number

    @Column({ type: 'text', nullable: false })
    no_ruang: string

    @Column({ type: 'integer', nullable: false })
    id_admin: number

    @Column({ type: 'text', nullable: false })
    status_ruang: string

    @ManyToOne(() => User)
    @JoinColumn({ name: 'id_admin' })
    admin: User;
} 