"use client";

import { useState } from "react";
import {
  PrimaryAlert,
  PrimaryButton,
  PrimaryCheckbox,
  PrimaryPasswordField,
  PrimaryTextField,
} from "@/components";
import { renderLabelWithAsterisk } from "@/utils";
import { CircularProgress } from "@mui/material";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{
    content: string;
    type: "success" | "error" | "warning" | "info";
    duration: number;
  } | null>(null);

  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Fake login logic
    setTimeout(() => {
      if (username === "admin" && password === "123") {
        setAlert({
          content: "Đăng nhập thành công!",
          type: "success",
          duration: 3000,
        });
      } else {
        setAlert({
          content: "Tên đăng nhập hoặc mật khẩu không đúng!",
          type: "error",
          duration: 3000,
        });
      }
      setLoading(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100 p-4">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl px-8 py-10">
        <h1 className="text-2xl font-bold text-gray-800 text-center mb-8">
          Đăng nhập tài khoản
        </h1>

        <form onSubmit={handleLogin} className="flex flex-col space-y-5">
          <PrimaryTextField
            label={renderLabelWithAsterisk("Tên đăng nhập", true)}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <PrimaryPasswordField
            label={renderLabelWithAsterisk("Mật khẩu", true)}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <div className="flex items-center justify-between text-sm">
            <PrimaryCheckbox
              id="remember-me"
              name="remember-me"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              label="Nhớ đăng nhập"
            />

            <button
              type="button"
              className="text-primary font-medium hover:underline"
              onClick={() =>
                setAlert({
                  content: "Tính năng quên mật khẩu đang được phát triển.",
                  type: "info",
                  duration: 3000,
                })
              }
            >
              Quên mật khẩu?
            </button>
          </div>

          <PrimaryButton
            content="Đăng nhập"
            icon={
              loading ? <CircularProgress size={24} color="inherit" /> : null
            }
            disabled={loading}
            type="submit"
            className="w-full"
            size="large"
            sx={{ height: "48px", fontSize: "18px", marginTop: "8px" }}
          />
        </form>

        <p className="text-center text-gray-500 text-sm mt-6">
          Chưa có tài khoản?{" "}
          <button
            onClick={() => router.push("/auth/register")}
            className="text-primary font-semibold hover:underline"
          >
            Đăng ký ngay
          </button>
        </p>
      </div>

      {alert && (
        <PrimaryAlert
          content={alert.content}
          type={alert.type}
          duration={alert.duration}
          onClose={() => setAlert(null)}
        />
      )}
    </div>
  );
}
