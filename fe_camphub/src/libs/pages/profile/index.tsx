"use client";

import { useState } from "react";
import ProfileSidebar from "./ProfileSidebar";
import ProfileInfo from "./ProfileInfo";
import OwnedItems from "./OwnedItems";
import RentalHistory from "./RentalHistory";
import CampHubCoin from "./CampHubCoin";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("info");

  return (
    <main className="max-w-7xl mx-auto px-4 md:px-8 py-10 flex gap-6">
      {/* Sidebar */}
      <div className="w-64 hidden md:block">
        <ProfileSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      {/* Content */}
      <div className="flex-grow bg-white shadow-sm rounded-lg p-6">
        {activeTab === "info" && <ProfileInfo />}
        {activeTab === "items" && <OwnedItems />}
        {activeTab === "history" && <RentalHistory />}
        {activeTab === "coin" && <CampHubCoin />}
      </div>
    </main>
  );
}
