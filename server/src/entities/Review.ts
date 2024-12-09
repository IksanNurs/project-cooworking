import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('review')
export class Review {
    @PrimaryGeneratedColumn()
    review_id: number

    @Column({ type: 'integer', nullable: false })
    coworking_id: number

    @Column({ type: 'text', nullable: true })
    komentar: string

    @Column({ type: 'date', nullable: false })
    tanggal_review: Date
} 