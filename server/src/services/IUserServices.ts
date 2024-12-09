import { User } from "../entities/User";

export interface IUserSaveRequest {
    nama: string;
    email: string;
    password: string;
    no_telp?: string;
    role: string;
}

export interface IUserLogin {
    user: {
        user_id: number;
        nama: string;
        email: string;
        no_telp?: string;
        role: string;
        tanggal_daftar: Date;
        created_at: Date;
        updated_at: Date;
    },
    token: string;
}

export default interface IUserServices {
    save(data: IUserSaveRequest): Promise<User>;
    checkEmail(email: string): Promise<User | undefined>;
    login(email: string, password: string): Promise<IUserLogin | null>;
    updateProfile(user_id: number, data: Partial<IUserSaveRequest>, currentPassword: string): Promise<string>;
    getPassword(email: string): Promise<string>;
}