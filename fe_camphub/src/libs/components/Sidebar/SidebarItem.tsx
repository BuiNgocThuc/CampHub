"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/libs/utils"; // helper function gộp className (tạo nếu chưa có)
import { LucideIcon } from "lucide-react";

interface SidebarItemProps {
    label: string;
    icon: LucideIcon;
    href: string;
}

export default function SidebarItem({ label, icon: Icon, href }: SidebarItemProps) {
    const pathname = usePathname();
    const router = useRouter();
    const isActive = pathname === href || pathname.startsWith(href + "/");

    return (
        <button
            onClick={() => router.push(href)}

            className={cn(
                "flex items-center w-full gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-all",
                isActive
                    ? "bg-blue-600 text-white shadow"
                    : "text-gray-700 hover:bg-gray-100"
            )}
        >
            <Icon size={18} />
            <span>{label}</span>
        </button>
    );
}
