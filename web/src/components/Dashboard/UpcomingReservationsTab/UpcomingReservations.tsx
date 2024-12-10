import { ChatText, Trash } from "phosphor-react"
import { useState } from "react";
import { IUpcomingBooking } from "../../../@types/Book"
import { ReviewModal } from "./ReviewModal";

export const UpcomingBookings = (props: IUpcomingBooking) => {
    const [showReviewModal, setShowReviewModal] = useState(false);

    return (
        <>
            <div className=" w-full min-h-[300px] bg-backgroundLight rounded-xl flex flex-col text-paragraph font-semibold text-lg px-3">
            <h2 className="text-2xl text-highlight mb-6">Riwayat Reservation</h2>

                <div className="overflow-x-auto relative">
                    <div className="w-full h-full overflow-x-scroll">
                        <table className="w-full min-w-[800px]">
                            <thead>
                                <tr className="text-left bg-background">
                                    <th className="p-4">Room</th>
                                    <th className="p-4">Start Time</th>
                                    <th className="p-4">End Time</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4">Review</th>
                                    <th className="p-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-b border-background">
                                    <td className="p-4">{props.coworking.no_ruang}</td>
                                    <td className="p-4">{new Date(props.waktu_mulai).toLocaleString()}</td>
                                    <td className="p-4">{new Date(props.waktu_selesai).toLocaleString()}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded-full text-sm ${
                                            props.status_reservasi === 'pending' ? 'bg-yellow-200 text-yellow-800' :
                                            props.status_reservasi === 'aktif' ? 'bg-green-200 text-green-800' :
                                            'bg-red-200 text-red-800'
                                        }`}>
                                            {props.status_reservasi}
                                        </span>
                                    </td>
                                    <td className="p-4">{props.reviews[0]?.komentar || '-'}</td>
                                    <td className="p-4">
                                    {props.user_id !== null && props.status_reservasi === 'nonaktif' && (
                                        <div className="flex gap-2">
                                            <button onClick={props.onCancel} className="flex items-center gap-1 bg-attentionBackground rounded-lg p-2 text-background">
                                                Cancel
                                                <Trash size={20} />
                                            </button>
                                            <button onClick={() => setShowReviewModal(true)} className="flex items-center gap-1 bg-highlight rounded-lg p-2 text-background">
                                                Review
                                                <ChatText size={20} />
                                            </button>
                                        </div>
                                    )}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {showReviewModal && (
                <ReviewModal 
                    reservation_id={props.reservation_id}
                    onClose={() => setShowReviewModal(false)}
                    onSubmit={props.onReviewSubmit}
                />
            )}
        </>
    )
}
