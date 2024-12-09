import { Reservation } from "../entities/Reservation";
import { User } from "../entities/User";

export interface IReservationRequest {
    user_id: number;
    coworking_id: number;
    waktu_mulai: Date;
    waktu_selesai: Date;
}

export default interface IReservationServices {
    create(data: IReservationRequest): Promise<Reservation>;
    getReservationsByUser(user_id: number): Promise<Reservation[]>;
    verifikasiPembayaran(reservation_id: number): Promise<Reservation>;
    batalkanReservasi(reservation_id: number): Promise<void>;
    getAvailableRooms(waktu_mulai: Date, waktu_selesai: Date): Promise<any>;
    
    // Tambahkan method untuk admin
    getAllReservations(): Promise<Reservation[]>;
    getPendingReservations(): Promise<Reservation[]>;
    updateStatusReservasi(
        reservation_id: number,
        status: string,
        admin_id: number
    ): Promise<Reservation>;
    getDashboardStats(): Promise<{
        totalReservasi: number;
        reservasiHariIni: number;
        menungguPembayaran: number;
        reservasiAktif: number;
    }>;
} 