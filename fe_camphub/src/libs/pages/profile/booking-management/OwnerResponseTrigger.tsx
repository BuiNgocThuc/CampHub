"use client";

import { useState } from "react";
import { PrimaryButton } from "@/libs/components";
import OwnerResponseModal from "./OwnerResponseModal";
import { Booking } from "@/libs/core/types";

interface OwnerResponseTriggerProps {
    booking: Booking;
    onSuccess?: (isAccept: boolean) => void;
}

export default function OwnerResponseTrigger({ booking, onSuccess }: OwnerResponseTriggerProps) {
    const [open, setOpen] = useState(false);

    return (
        <>
            <PrimaryButton
                content="Phản hồi đơn"
                onClick={() => setOpen(true)}
                size="small"
            />

            <OwnerResponseModal
                open={open}
                onClose={() => setOpen(false)}
                bookingId={booking.id}
                itemId={booking.itemId || ""}
                itemName={booking.itemName || "Không rõ"}
                lesseeName={booking.lesseeName || "Khách vãng lai"}
                onSuccess={onSuccess}
            />
        </>
    );
}