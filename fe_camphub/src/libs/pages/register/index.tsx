"use client";

import { useState } from "react";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    firstname: "",
    lastname: "",
    phone_number: "",
    email: "",
    ID_number: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: gọi API đăng ký bằng axios sau
    console.log("Submitted data:", formData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-50 to-gray-100 p-4">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-blue-600 text-center mb-6">
          Đăng ký tài khoản
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Họ và Tên */}
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-gray-700 text-sm font-medium mb-1">
                Họ
              </label>
              <input
                type="text"
                name="lastname"
                value={formData.lastname}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                placeholder="Nhập họ"
              />
            </div>
            <div className="flex-1">
              <label className="block text-gray-700 text-sm font-medium mb-1">
                Tên
              </label>
              <input
                type="text"
                name="firstname"
                value={formData.firstname}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                placeholder="Nhập tên"
              />
            </div>
          </div>

          {/* Username */}
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Tên đăng nhập
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              placeholder="Nhập tên đăng nhập"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              placeholder="Nhập email"
            />
          </div>

          {/* Số điện thoại & CMND */}
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-gray-700 text-sm font-medium mb-1">
                Số điện thoại
              </label>
              <input
                type="text"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                placeholder="VD: 0901234567"
              />
            </div>
            <div className="flex-1">
              <label className="block text-gray-700 text-sm font-medium mb-1">
                CMND/CCCD
              </label>
              <input
                type="text"
                name="ID_number"
                value={formData.ID_number}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                placeholder="Nhập CMND/CCCD"
              />
            </div>
          </div>

          {/* Mật khẩu */}
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Mật khẩu
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              placeholder="Nhập mật khẩu"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2.5 rounded-lg hover:bg-blue-600 transition font-semibold"
          >
            Đăng ký
          </button>
        </form>

        {/* Chuyển sang trang đăng nhập */}
        <p className="text-center text-sm text-gray-600 mt-4">
          Đã có tài khoản?{" "}
          <a href="/login" className="text-blue-500 hover:underline">
            Đăng nhập ngay
          </a>
        </p>
      </div>
    </div>
  );
}
