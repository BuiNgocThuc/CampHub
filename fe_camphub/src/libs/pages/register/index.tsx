// app/auth/register/page.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { register } from "@/libs/api/auth-api";
import { registerSchema, RegisterFormValues } from "./schema";

export default function RegisterPage() {
  const router = useRouter();

  const {
    register: formRegister,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      await register({
        username: data.username,
        password: data.password,
        firstname: data.firstname,
        lastname: data.lastname,
        email: data.email,
        phoneNumber: data.phone_number,
        idNumber: data.ID_number,
      });

      toast.success("Đăng ký thành công! Đang chuyển về trang chủ...");
      
      setTimeout(() => {
        router.push("/");
      }, 2000);
    } catch (error: any) {
      const msg = error.response?.data?.message || "Đăng ký thất bại. Vui lòng thử lại!";
      toast.error(msg);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-100 p-4">
      <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-lg border border-gray-100">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Đăng ký tài khoản</h2>
          <p className="text-gray-600 mt-2">Tham gia cộng đồng thuê đồ ngay hôm nay!</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Họ & Tên */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Họ</label>
              <input
                {...formRegister("lastname")}
                type="text"
                placeholder="Nguyễn"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
              {errors.lastname && <p className="text-red-500 text-xs mt-1">{errors.lastname.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tên</label>
              <input
                {...formRegister("firstname")}
                type="text"
                placeholder="Văn A"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
              {errors.firstname && <p className="text-red-500 text-xs mt-1">{errors.firstname.message}</p>}
            </div>
          </div>

          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tên đăng nhập</label>
            <input
              {...formRegister("username")}
              type="text"
              placeholder="nguyenvana"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
            {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username.message}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              {...formRegister("email")}
              type="email"
              placeholder="you@example.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>

          {/* SĐT & CMND */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
              <input
                {...formRegister("phone_number")}
                type="text"
                placeholder="0901234567"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
              {errors.phone_number && <p className="text-red-500 text-xs mt-1">{errors.phone_number.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">CMND/CCCD</label>
              <input
                {...formRegister("ID_number")}
                type="text"
                placeholder="123456789"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
              {errors.ID_number && <p className="text-red-500 text-xs mt-1">{errors.ID_number.message}</p>}
            </div>
          </div>

          {/* Mật khẩu */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu</label>
            <input
              {...formRegister("password")}
              type="password"
              placeholder="••••••••"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-4 rounded-xl font-semibold text-lg hover:from-blue-600 hover:to-indigo-700 transition flex items-center justify-center gap-3 shadow-lg"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin" size={24} />
                Đang tạo tài khoản...
              </>
            ) : (
              "Đăng ký ngay"
            )}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          Đã có tài khoản?{" "}
          <a href="/login" className="font-semibold text-blue-600 hover:underline">
            Đăng nhập ngay
          </a>
        </p>
      </div>
    </div>
  );
}