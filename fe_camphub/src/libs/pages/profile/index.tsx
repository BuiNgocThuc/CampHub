"use client";

import { useEffect, useState } from "react";
import ProfileSidebar from "./ProfileSidebar";
import ProfileInfo from "./ProfileInfo";
import OwnedItems from "./item-management";
import RentalHistory from "./RentalHistory";
import CampHubCoin from "./CampHubCoin";
import { useAuthStore } from "@/libs/stores";
import { Account } from "@/libs/core/types";
import { getAccountById } from "@/libs/api";
import { PrimaryAlert } from "@/libs/components";
import { useMyItems } from "@/libs/hooks";
import RentalOrders from "./RentalOrders";
import MyDisputes from "./MyDisputes";


export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("info");
  const user = useAuthStore((state) => state.user);
  const userId = user?.id;

  const [account, setAccount] = useState<Account | null>(null);
  const [loadingAccount, setLoadingAccount] = useState(true);

  const [alert, setAlert] = useState<{
    content: string;
    type: "success" | "error" | "warning" | "info";
    duration: number;
  } | null>(null);

  const showAlert = (
    content: string,
    type: "success" | "error" | "warning" | "info",
    duration = 2000
  ) => setAlert({ content, type, duration });

  // Lấy thông tin tài khoản
  useEffect(() => {
    if (!userId) {
      setLoadingAccount(false);
      return;
    }
    const fetchAccount = async () => {
      try {
        setLoadingAccount(true);
        const data = await getAccountById(userId);
        setAccount(data);
      } catch (err) {
        showAlert("Không thể tải thông tin tài khoản", "error");
      } finally {
        setLoadingAccount(false);
      }
    };
    fetchAccount();
  }, [userId]);

  const {
    data: myItems = [],
    isLoading: loadingItems,
    error: itemsError,
  } = useMyItems();

  const isItemsTab = activeTab === "items";

  // Hiển thị lỗi nếu có
  useEffect(() => {
    if (itemsError) {
      showAlert("Lỗi tải danh sách sản phẩm", "error");
    }
  }, [itemsError]);

  if (loadingAccount) {
    return (
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-20 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Đang tải thông tin...</p>
      </div>
    );
  }

  if (!account) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center text-red-600">
        Không thể tải thông tin tài khoản.
      </div>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 md:px-8 py-10 flex gap-6">
      {/* Sidebar */}
      <div className="w-64 hidden md:block">
        <ProfileSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      {/* Content */}
      <div className="flex-grow bg-white shadow-sm rounded-lg p-6">
        {activeTab === "info" && <ProfileInfo account={account} />}
        {activeTab === "items" && (
          <OwnedItems
            items={isItemsTab ? myItems : []}
            loading={isItemsTab ? loadingItems : false}
          />
        )}
        {activeTab === "rental-orders" && <RentalOrders />}
        {activeTab === "history" && <RentalHistory />}
        {activeTab === "disputes" && <MyDisputes />}
        {activeTab === "coin" && (
          <CampHubCoin
            balance={account.coinBalance}
            isLoading={loadingAccount}
            onTopUpSuccess={(newBalance) => {
              setAccount((prev) => (prev ? { ...prev, coinBalance: newBalance } : prev));
              showAlert("Nạp xu thành công", "success");
            }}
          />
        )}
      </div>

      {alert && (
        <PrimaryAlert
          content={alert.content}
          type={alert.type}
          duration={alert.duration}
          onClose={() => setAlert(null)}
        />
      )}
    </main>
  );
}
