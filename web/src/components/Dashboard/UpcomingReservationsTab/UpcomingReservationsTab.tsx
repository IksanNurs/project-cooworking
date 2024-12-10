import { useEffect, useState } from "react"
import { IUpcomingBooking } from "../../../@types/Book";
import { api } from "../../../Api";
import { useUser } from "../../../context/UserContext";
import { Loading } from "../Loading";
import { UpcomingBookings } from "./UpcomingReservations";
import { toast } from "react-toastify";

export const UpcomingBookingsTab = () => {
    const { user, token } = useUser();
    const [reservations, setReservations] = useState<IUpcomingBooking[]>([]);
    const [loading, setLoading] = useState(true);

    const loadReservations = async () => {
        try {
            const response = await api.get('/reservasi/all/'+user.user_id, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setReservations(response.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleReview = async (reservation_id: number, komentar: string) => {
        try {
            await api.post('/review', {
                reservation_id,
                komentar
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success('Review submitted successfully');
            loadReservations();
        } catch (error) {
            toast.error('Failed to submit review');
        }
    };

    const handleCancel = async (reservation_id: number) => {
        try {
            await api.get('/reservasi/reject/'+reservation_id, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success('Cancel successfully');
            loadReservations();
        } catch (error) {
            toast.error('Failed to cancel');
        }
    };

    useEffect(() => {
        loadReservations();
    }, []);

    if (loading) return <Loading />;

    return (
        <div className="mt-[3%] w-full bg-backgroundLight rounded-xl p-6">
            {reservations.map(reservation => (
                <UpcomingBookings 
                    key={reservation.reservation_id}
                    {...reservation}
                    onCancel={() => handleCancel(reservation.reservation_id)}
                    onReviewSubmit={handleReview}
                />
            ))}
        </div>
    );
};