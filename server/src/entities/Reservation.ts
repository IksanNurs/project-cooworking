import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { User } from "./User";

@Entity('reservation')
export class Reservation {
    @PrimaryGeneratedColumn()
    reservation_id: number

    @Column({ type: 'integer', nullable: false })
    user_id: number

    @Column({ type: 'integer', nullable: false })
    coworking_id: number

    @Column({ type: 'integer', nullable: false })
    id_admin: number

    @Column({ type: 'timestamp', nullable: false })
    waktu_mulai: Date

    @Column({ type: 'timestamp', nullable: false })
    waktu_selesai: Date

    @Column({ type: 'text', nullable: false })
    status_reservasi: string

    @ManyToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    user: User;
} 