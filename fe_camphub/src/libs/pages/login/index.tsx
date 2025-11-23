"use client";

import { useState } from "react";
import {
  PrimaryAlert,
  PrimaryButton,
  PrimaryCheckbox,
  PrimaryPasswordField,
  PrimaryTextField,
} from "@/libs/components";
import { renderLabelWithAsterisk } from "@/libs/utils";
import { CircularProgress } from "@mui/material";
import { useRouter } from "next/navigation";
import { login } from "@/libs/api/auth-api";
import { AuthRequest } from "@/libs/core/dto/request";
import { isEmpty } from "@/libs/validation";
import Cookies from "js-cookie";
import { ACCESS_TOKEN, decodeAccessToken } from "@/libs/utils";
import { useAuthStore } from "@/libs/stores";
import { set } from "@automapper/core";

export default function LoginPage() {
  const {fetchMyInfo} = useAuthStore();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [usernameError, setUsernameError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
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

  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Validate fields
    const validateFields = () => {
      const fields = [
        { value: username.trim(), setError: setUsernameError, name: "username" },
        { value: password.trim(), setError: setPasswordError, name: "password" },
      ];

      let hasError = false;

      fields.forEach(({ value, setError }) => {
        const invalid = isEmpty(value);
        setError(invalid);
        if (invalid) hasError = true;
      });

      return hasError;
    };

    const hasErrors = validateFields();
    if (hasErrors) {
      showAlert("Vui lòng nhập đầy đủ thông tin.", "error", 3000);
      setLoading(false);
      return;
    }

    // call login API
    const req: AuthRequest = {
      username,
      password,
    };

    try {
      const response = await login(req);
      
      if (!response.result?.authenticated) {
        showAlert("Sai tên đăng nhập hoặc mật khẩu!", "error", 3000);
        setLoading(false);
        return;
      }

      // get user type from token and redirect
      const token = Cookies.get(ACCESS_TOKEN);
      const decoded = token ? decodeAccessToken(token) : null;

      if (!decoded) {
        throw new Error("Cannot decode token");
      }

      const redirectPath = decoded.userType === "ADMIN" ? "/admin" : "/CampHub";

      // call fetch my info to update store
      await fetchMyInfo();
      router.push(`${redirectPath}?login=success`);
    } catch (error: any) {
      console.error("Login error:", error);
      const msg =
        error.response?.data?.message ||
        "Đăng nhập thất bại. Vui lòng thử lại.";

      showAlert(msg, "error", 3000);
    } finally {
      setLoading(false);
    }
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
            error={usernameError}
          />

          <PrimaryPasswordField
            label={renderLabelWithAsterisk("Mật khẩu", true)}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={passwordError}
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
            icon={loading ? <CircularProgress size={24} color="inherit" /> : null}
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
