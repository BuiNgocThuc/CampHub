"use client";

import Image from "next/image";
import { useState } from "react";
import {
  PrimaryButton,
  CustomizedButton,
  PrimaryTextField,
} from "@/components";

export default function ProfileInfo() {
  const [editMode, setEditMode] = useState(false);

  const [profile, setProfile] = useState({
    username: "nguyenvana",
    firstname: "Nguyễn",
    lastname: "Văn A",
    email: "nguyenvana@gmail.com",
    phone_number: "0123456789",
    ID_number: "012345678901",
    address: "Hà Nội, Việt Nam",
    avatar: "/img/profiles/avatar-default.png",
    trust_score: 85,
    coin_balance: 120.5,
    user_type: "USER",
    status: "ACTIVE",
    created_at: "2024-07-12",
    updated_at: "2025-10-01",
  });

  const handleSave = () => {
    // TODO: Gọi API lưu thông tin tài khoản
    setEditMode(false);
  };

  return (
    <div className="bg-white shadow-sm rounded-2xl p-6">
      <h2 className="text-xl font-semibold mb-6">Thông tin cá nhân</h2>

      {/* Avatar */}
      <div className="flex flex-col md:flex-row items-center gap-6 mb-8">
        <div className="relative w-28 h-28">
          <Image
            src={profile.avatar}
            alt="Avatar"
            width={112}
            height={112}
            className="rounded-full object-cover border"
          />
          {editMode && (
            <button className="absolute bottom-1 right-1 bg-blue-600 text-white text-xs px-2 py-1 rounded-lg">
              Thay đổi
            </button>
          )}
        </div>

        <div className="text-center md:text-left">
          <p className="text-lg font-semibold">
            {profile.firstname} {profile.lastname}
          </p>
          <p className="text-gray-500">@{profile.username}</p>
          <div className="flex gap-3 mt-2 text-sm">
            <span className="px-3 py-1 bg-green-100 text-green-600 rounded-full">
              {profile.status}
            </span>
            <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full">
              {profile.user_type}
            </span>
          </div>
        </div>
      </div>

      {/* Thông tin cơ bản */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <PrimaryTextField
          label="Họ"
          value={profile.firstname}
          onChange={(e) =>
            setProfile({ ...profile, firstname: e.target.value })
          }
          disabled={!editMode}
        />
        <PrimaryTextField
          label="Tên"
          value={profile.lastname}
          onChange={(e) => setProfile({ ...profile, lastname: e.target.value })}
          disabled={!editMode}
        />
        <PrimaryTextField
          label="Email"
          value={profile.email}
          onChange={(e) => setProfile({ ...profile, email: e.target.value })}
          disabled={!editMode}
        />
        <PrimaryTextField
          label="Số điện thoại"
          value={profile.phone_number}
          onChange={(e) =>
            setProfile({ ...profile, phone_number: e.target.value })
          }
          disabled={!editMode}
        />
        <PrimaryTextField
          label="CMND/CCCD"
          value={profile.ID_number}
          onChange={(e) =>
            setProfile({ ...profile, ID_number: e.target.value })
          }
          disabled={!editMode}
        />
        <PrimaryTextField
          label="Địa chỉ"
          value={profile.address}
          onChange={(e) => setProfile({ ...profile, address: e.target.value })}
          disabled={!editMode}
        />
      </div>

      {/* Thông tin phụ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-8">
        <PrimaryTextField
          label="Điểm uy tín"
          value={profile.trust_score.toString()}
          disabled
        />
        <PrimaryTextField
          label="Số dư CampHub Xu"
          value={profile.coin_balance.toString()}
          disabled
        />
        <PrimaryTextField
          label="Ngày tạo tài khoản"
          value={profile.created_at}
          disabled
        />
        <PrimaryTextField
          label="Cập nhật gần nhất"
          value={profile.updated_at}
          disabled
        />
      </div>

      {/* Nút hành động */}
      <div className="mt-8 flex gap-3">
        {editMode ? (
          <>
            <PrimaryButton content="Lưu thay đổi" onClick={handleSave} />
            <CustomizedButton
              content="Hủy"
              color="#EF4444"
              onClick={() => setEditMode(false)}
            />
          </>
        ) : (
          <PrimaryButton
            content="Chỉnh sửa"
            onClick={() => setEditMode(true)}
          />
        )}
      </div>
    </div>
  );
}
