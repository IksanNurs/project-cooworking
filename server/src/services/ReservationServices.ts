import { Reservation } from "../entities/Reservation";
import { reservationRepository } from "../repositories/ReservationRepository";
import IReservationServices, { IReservationRequest } from "./IReservationServices";
import notificationServices from "./NotificationServices";
import { Between, In } from "typeorm";

class ReservationServices implements IReservationServices {
    async create(data: IReservationRequest): Promise<Reservation> {
        // Cek ketersediaan ruangan
        const isAvailable = await this.checkRoomAvailability(
            data.coworking_id,
            data.waktu_mulai,
            data.waktu_selesai
        );

        if (!isAvailable) {
            throw new Error("Ruangan tidak tersedia untuk waktu yang dipilih");
        }

        const reservation = reservationRepository.create({
            ...data,
            status_reservasi: "menunggu_pembayaran"
        });

        await notificationServices.createNotification({
            user_id: data.user_id,
            judul: "Reservasi Baru",
            pesan: `Reservasi ruangan berhasil dibuat. Silakan lakukan pembayaran.`,
            tipe: "reservasi"
        });

        return await reservationRepository.save(reservation);
    }

    async getReservationsByUser(user_id: number): Promise<Reservation[]> {
        return await reservationRepository.find({
            where: { user_id },
            relations: ['coworking']
        });
    }

    async verifikasiPembayaran(reservation_id: number): Promise<Reservation> {
        const reservation = await reservationRepository.findOneBy({ reservation_id });
        
        if (!reservation) {
            throw new Error("Reservasi tidak ditemukan");
        }

        reservation.status_reservasi = "aktif";
        await notificationServices.createNotification({
            user_id: reservation.user_id,
            judul: "Pembayaran Terverifikasi",
            pesan: `Pembayaran untuk reservasi #${reservation.reservation_id} telah diverifikasi.`,
            tipe: "pembayaran"
        });
        return await reservationRepository.save(reservation);
    }

    async batalkanReservasi(reservation_id: number): Promise<void> {
        const reservation = await reservationRepository.findOneBy({ reservation_id });
        
        if (!reservation) {
            throw new Error("Reservasi tidak ditemukan");
        }

        if (reservation.status_reservasi === "aktif") {
            throw new Error("Tidak dapat membatalkan reservasi yang sudah aktif");
        }

        await reservationRepository.delete(reservation_id);
    }

    async getAvailableRooms(waktu_mulai: Date, waktu_selesai: Date): Promise<any> {
        // Query untuk mendapatkan ruangan yang tersedia
        const bookedRooms = await reservationRepository
            .createQueryBuilder("reservation")
            .select("reservation.coworking_id")
            .where(`
                (reservation.waktu_mulai <= :waktu_mulai AND reservation.waktu_selesai >= :waktu_mulai)
                OR
                (reservation.waktu_mulai <= :waktu_selesai AND reservation.waktu_selesai >= :waktu_selesai)
            `)
            .setParameters({ waktu_mulai, waktu_selesai })
            .getRawMany();

        return bookedRooms;
    }

    private async checkRoomAvailability(
        coworking_id: number,
        waktu_mulai: Date,
        waktu_selesai: Date
    ): Promise<boolean> {
        const existingReservation = await reservationRepository
            .createQueryBuilder("reservation")
            .where("reservation.coworking_id = :coworking_id", { coworking_id })
            .andWhere(`
                (reservation.waktu_mulai <= :waktu_mulai AND reservation.waktu_selesai >= :waktu_mulai)
                OR
                (reservation.waktu_mulai <= :waktu_selesai AND reservation.waktu_selesai >= :waktu_selesai)
            `)
            .setParameters({ waktu_mulai, waktu_selesai })
            .getOne();

        return !existingReservation;
    }

    async getAllReservations(): Promise<Reservation[]> {
        return await reservationRepository.find({
            relations: ['user', 'coworking'],
            order: { waktu_mulai: 'DESC' }
        });
    }

    async getPendingReservations(): Promise<Reservation[]> {
        return await reservationRepository.find({
            where: { status_reservasi: "menunggu_pembayaran" },
            relations: ['user', 'coworking'],
            order: { waktu_mulai: 'DESC' }
        });
    }

    async updateStatusReservasi(
        reservation_id: number, 
        status: string, 
        admin_id: number
    ): Promise<Reservation> {
        const reservation = await reservationRepository.findOne({
            where: { reservation_id },
            relations: ['user']
        });
        
        if (!reservation) {
            throw new Error("Reservasi tidak ditemukan");
        }

        reservation.status_reservasi = status;
        reservation.id_admin = admin_id;
        
        // Kirim notifikasi ke user
        await notificationServices.createNotification({
            user_id: reservation.user_id,
            judul: "Status Reservasi Diperbarui",
            pesan: `Status reservasi #${reservation_id} telah diubah menjadi ${status}`,
            tipe: "status_update"
        });

        return await reservationRepository.save(reservation);
    }

    async getDashboardStats(): Promise<any> {
        const today = new Date();
        const startOfDay = new Date(today.setHours(0, 0, 0, 0));
        const endOfDay = new Date(today.setHours(23, 59, 59, 999));

        const [
            totalReservasi,
            reservasiHariIni,
            menungguPembayaran,
            reservasiAktif
        ] = await Promise.all([
            reservationRepository.count(),
            reservationRepository.count({
                where: {
                    waktu_mulai: Between(startOfDay, endOfDay)
                }
            }),
            reservationRepository.count({
                where: { status_reservasi: "menunggu_pembayaran" }
            }),
            reservationRepository.count({
                where: { status_reservasi: "aktif" }
            })
        ]);

        return {
            totalReservasi,
            reservasiHariIni,
            menungguPembayaran,
            reservasiAktif
        };
    }
}

const reservationServices = new ReservationServices();
export default reservationServices; 