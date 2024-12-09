import { User } from "../entities/User";
import { sendAccountConfirmEmail, sendPasswordEmail } from "../utils/mail";
import { userRepository } from "../repositories/UserRepository";
import IUserServices, { IUserLogin, IUserSaveRequest } from "./IUserServices";

import "dotenv/config";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";

class UserServices implements IUserServices {
    private jwtPass = process.env.JWT_PASS as string;

    async save({ nama, email, password, no_telp, role }: IUserSaveRequest): Promise<User> {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = userRepository.create({
            nama,
            email,
            password: hashedPassword,
            no_telp,
            role,
            tanggal_daftar: new Date()
        });
        
        await userRepository.save(newUser);
        return newUser;
    }

    async checkEmail(email: string): Promise<User | undefined> {
        const user = await userRepository.findOneBy({ email });
        if (user) {
            return user;
        } else {
            return undefined;
        }
    }

 
    async login(email: string, password: string): Promise<IUserLogin | null> {
        const user = await userRepository.findOneBy({ email });
        if (!user) {
            return null;
        }

        const verifyPass = await bcrypt.compare(password, user.password);
        if (!verifyPass) {
            return null;
        }

        const token = jwt.sign({ user_id: user.user_id }, this.jwtPass, { expiresIn: '8h' });

        const { password: _, ...userLogin } = user;
        return {
            user: userLogin,
            token
        };
    }

    async updateProfile(
        user_id: number, 
        data: Partial<IUserSaveRequest>,
        currentPassword: string
    ): Promise<string> {
        const user = await userRepository.findOneBy({ user_id });
        if (!user) {
            throw new Error("User tidak ditemukan");
        }

        const verifyPass = await bcrypt.compare(currentPassword, user.password);
        if (!verifyPass) {
            throw new Error("Password saat ini salah");
        }

        if (data.password) {
            data.password = await bcrypt.hash(data.password, 10);
        }

        await userRepository.update(user_id, data);
        return "Profil berhasil diperbarui";
    }

    async getPassword(email: string): Promise<string> {
        const user = await userRepository.findOneBy({ email });
        if (!user) {
            throw new Error("User tidak ditemukan");
        }

        const newPassword = this.generateRandomPassword();
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        
        user.password = hashedPassword;
        await userRepository.save(user);

        sendPasswordEmail(user.email, user.nama, newPassword);
        return "Password baru telah dikirim ke email Anda";
    }

    private generateRandomPassword(): string {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let password = '';
        for (let i = 0; i < 8; i++) {
            password += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return password;
    }
}

const userServices = new UserServices();
export default userServices;