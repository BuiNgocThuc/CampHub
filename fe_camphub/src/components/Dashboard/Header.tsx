"use client";

import NotificationDropdown from "@/components/Dashboard/NotificationDropdown";
import { Bell, ShoppingCart, UserCircle, Search, CircleUserRound } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  cartCount?: number;
  notifCount?: number;
  avatarSrc?: string | null;
};

export default function Header({
  cartCount = 0,
  notifCount = 0,
  avatarSrc = "/img/default-avatar.png",
}: Props) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [showNoti, setShowNoti] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: xử lý tìm kiếm (router.push(`/search?q=${encodeURIComponent(query)}`) ...)
    if (!query) return;
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <header className="w-full bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-3 flex items-center gap-4">
        {/* Left: Logo */}
        <div
          className="flex items-center gap-3 cursor-pointer min-w-[160px]"
          onClick={() => router.push("/CampHub")}
        >
          <div className="relative w-10 h-10">
            <Image
              src="/img/logo-left-side-bar.png"
              alt="CampHub Logo"
              fill
              style={{ objectFit: "contain" }}
              priority
            />
          </div>
          <span className="hidden sm:inline text-lg font-semibold text-blue-600">
            CampHub
          </span>
        </div>

        {/* Center: Search (desktop) */}
        <div className="flex-1 hidden md:flex items-center">
          <form
            onSubmit={handleSubmit}
            className="w-full flex items-center gap-2"
            role="search"
            aria-label="Tìm kiếm sản phẩm"
          >
            <div className="flex items-center w-full bg-white border border-gray-200 rounded-full shadow-sm">
              <input
                aria-label="Tìm kiếm"
                name="q"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Tìm kiếm lều, bàn ghế, bếp ga, túi ngủ..."
                className="flex-1 px-4 py-3 rounded-l-full text-sm bg-transparent focus:outline-none"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-r-full bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
                aria-label="Tìm kiếm"
              >
                <Search size={16} />
                <span className="hidden sm:inline">Tìm</span>
              </button>
            </div>
          </form>
        </div>

        {/* Mobile: compact search icon */}
        <div className="md:hidden flex items-center">
          <button
            aria-label="Mở tìm kiếm"
            onClick={() => setMobileSearchOpen(true)}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <Search size={18} />
          </button>
        </div>

        {/* Right: Icons */}
        <div className="flex items-center gap-3">
          {/* Cart */}
          <div
            className="relative cursor-pointer p-2 rounded-full hover:bg-gray-100"
            onClick={() => router.push("/cart")}
            aria-label="Giỏ hàng"
            title="Giỏ hàng"
          >
            <ShoppingCart size={20} className="text-gray-700" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-semibold leading-none text-white bg-red-500 rounded-full">
                {cartCount}
              </span>
            )}
          </div>

          {/* Notifications */}
          <div
            className="relative cursor-pointer p-2 rounded-full hover:bg-gray-100"
            aria-label="Thông báo"
            title="Thông báo"
            onClick={() => setShowNoti((prev) => !prev)}
          >
            <Bell size={20} className="text-gray-700" />
            {notifCount > 0 && (
              <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-semibold leading-none text-white bg-red-500 rounded-full">
                {notifCount > 9 ? "9+" : notifCount}
              </span>
            )}
            {showNoti && (
              <NotificationDropdown onClose={() => setShowNoti(false)} />
            )}
          </div>

          {/* User avatar */}
          <div
            className="flex items-center cursor-pointer p-1 rounded-full hover:bg-gray-100"
            onClick={() => router.push("/profile")}
            aria-label="Tài khoản"
            title="Tài khoản"
          >
            <CircleUserRound size={24} className="text-gray-700" />
          </div>
        </div>
      </div>

      {/* Mobile search overlay */}
      {mobileSearchOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/40 flex items-start pt-24 px-4">
          <div className="w-full">
            <form
              onSubmit={(e) => {
                handleSubmit(e);
                setMobileSearchOpen(false);
              }}
              className="w-full"
            >
              <div className="flex items-center gap-2 bg-white rounded-full p-2 shadow">
                <input
                  autoFocus
                  aria-label="Tìm kiếm"
                  name="q"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Tìm sản phẩm, ví dụ: lều 4 người"
                  className="flex-1 px-4 py-3 rounded-full text-sm bg-transparent focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-full bg-blue-600 text-white"
                >
                  Tìm
                </button>
                <button
                  type="button"
                  onClick={() => setMobileSearchOpen(false)}
                  className="ml-2 px-3 py-2 rounded-full hover:bg-gray-100"
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  );
}
