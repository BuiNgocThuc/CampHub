"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { PrimaryButton, CustomizedButton, PrimaryTextField } from "@/libs/components";
import { Account } from "@/libs/core/types";
import { updateMyAccount, changeMyPassword } from "@/libs/api/account-api";
import { toast } from "sonner";


interface ProfileInfoProps {
  account: Account;
}

export default function ProfileInfo({ account }: ProfileInfoProps) {
  const [editMode, setEditMode] = useState(false);
  const [editedAccount, setEditedAccount] = useState<Account>(account);
  const [saving, setSaving] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Khi props account thay đổi (ví dụ: reload từ server), đồng bộ lại state
  useEffect(() => {
    setEditedAccount(account);
  }, [account]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateMyAccount({
        firstname: editedAccount.firstname,
        lastname: editedAccount.lastname,
        email: editedAccount.email,
        phoneNumber: editedAccount.phoneNumber,
        idNumber: editedAccount.idNumber,
        avatar: editedAccount.avatar,
      });
      toast.success("Cập nhật hồ sơ thành công");
      setEditMode(false);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Cập nhật hồ sơ thất bại");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditedAccount(account); // reset về dữ liệu gốc
    setEditMode(false);
  };

  const handleChangePassword = async () => {
    const { currentPassword, newPassword, confirmPassword } = passwordForm;
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Vui lòng nhập đầy đủ mật khẩu");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("Mật khẩu mới phải có ít nhất 6 ký tự");
      return;
    }

    setChangingPassword(true);
    try {
      await changeMyPassword(currentPassword, newPassword);
      toast.success("Đổi mật khẩu thành công");
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Đổi mật khẩu thất bại");
    } finally {
      setChangingPassword(false);
    }
  };

  // Format ngày giờ đẹp
  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="bg-white shadow-sm rounded-2xl p-6 lg:p-8">
      <h2 className="text-2xl font-bold mb-8 text-gray-800">
        Thông tin cá nhân
      </h2>

      {/* Avatar + Info chính */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-10">
        <div className="relative">
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-200 shadow-lg">
            <Image
              src={editedAccount.avatar || "/img/profiles/avatar-default.png"}
              alt="Avatar"
              width={128}
              height={128}
              className="object-cover w-full h-full"
              priority
            />
          </div>
          {editMode && (
            <button className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-3 py-1.5 rounded-full shadow-lg transition">
              Thay đổi
            </button>
          )}
        </div>

        <div className="flex-1 text-center md:text-left">
          <h3 className="text-2xl font-bold text-gray-900">
            {editedAccount.firstname} {editedAccount.lastname}
          </h3>
          <p className="text-lg text-gray-500 mt-1">@{editedAccount.username}</p>

          <div className="flex flex-wrap gap-8 mt-5 text-sm font-medium">
            <div>
              <span className="text-gray-600">Điểm uy tín:</span>{" "}
              <span className="text-orange-600 text-xl">
                {editedAccount.trustScore} ★
              </span>
            </div>
            <div>
              <span className="text-gray-600">Số dư Xu:</span>{" "}
              <span className="text-amber-600 text-xl">
                {editedAccount.coinBalance.toLocaleString("vi-VN")}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Các trường chỉnh sửa được */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <PrimaryTextField
          label="Họ"
          value={editedAccount.firstname}
          onChange={(e) =>
            setEditedAccount({ ...editedAccount, firstname: e.target.value })
          }
          disabled={!editMode}
        />
        <PrimaryTextField
          label="Tên"
          value={editedAccount.lastname}
          onChange={(e) =>
            setEditedAccount({ ...editedAccount, lastname: e.target.value })
          }
          disabled={!editMode}
        />
        <PrimaryTextField
          label="Email"
          value={editedAccount.email}
          onChange={(e) =>
            setEditedAccount({ ...editedAccount, email: e.target.value })
          }
          disabled={!editMode}
        />
        <PrimaryTextField
          label="Số điện thoại"
          value={editedAccount.phoneNumber}
          onChange={(e) =>
            setEditedAccount({ ...editedAccount, phoneNumber: e.target.value })
          }
          disabled={!editMode}
        />
        <PrimaryTextField
          label="CMND/CCCD"
          value={editedAccount.idNumber}
          onChange={(e) =>
            setEditedAccount({ ...editedAccount, idNumber: e.target.value })
          }
          disabled={!editMode}
        />
      </div>

      {/* Đổi mật khẩu */}
      <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 mb-8">
        <h3 className="text-lg font-semibold mb-4">Đổi mật khẩu</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <PrimaryTextField
            label="Mật khẩu hiện tại"
            value={passwordForm.currentPassword}
            onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
            type="password"
          />
          <PrimaryTextField
            label="Mật khẩu mới"
            value={passwordForm.newPassword}
            onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
            type="password"
          />
          <PrimaryTextField
            label="Xác nhận mật khẩu mới"
            value={passwordForm.confirmPassword}
            onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
            type="password"
          />
        </div>
        <div className="mt-4 flex justify-end">
          <PrimaryButton
            content={changingPassword ? "Đang đổi..." : "Đổi mật khẩu"}
            onClick={handleChangePassword}
            disabled={changingPassword}
          />
        </div>
      </div>

      {/* Thông tin chỉ xem */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-6 rounded-xl">
        <PrimaryTextField
          label="Ngày tạo tài khoản"
          value={formatDate(editedAccount.createdAt)}
          disabled
        />
        <PrimaryTextField
          label="Cập nhật gần nhất"
          value={formatDate(editedAccount.updatedAt)}
          disabled
        />
      </div>

      {/* Nút hành động */}
      <div className="mt-10 flex justify-end gap-4">
        {editMode ? (
          <>
            <PrimaryButton
              content={saving ? "Đang lưu..." : "Lưu thay đổi"}
              onClick={handleSave}
              disabled={saving}
            />
            <CustomizedButton
              content="Hủy bỏ"
              color="#EF4444"
              className={"hover:bg-[#DC2626] text-white"}
              onClick={handleCancel}
            />
          </>
        ) : (
          <PrimaryButton
            content="Chỉnh sửa thông tin"
            onClick={() => setEditMode(true)}
          />
        )}
      </div>
    </div>
  );
}