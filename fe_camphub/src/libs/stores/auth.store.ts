import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import Cookies from "js-cookie";
import { ACCESS_TOKEN } from "@/libs/utils";
import { getMyInfo, logout } from "../api";
import { MyInfoResponse } from "../core/dto/response";

interface AuthState {
    user?: MyInfoResponse;
    setUser: (user: MyInfoResponse) => void;
    fetchMyInfo: () => Promise<void>;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: undefined,

            setUser: (user) => set({ user }),

            logout: () => {
                set({ user: undefined });
                logout(); // api logout
            },

            fetchMyInfo: async () => {
                const token = Cookies.get(ACCESS_TOKEN);
                if (!token) {
                    get().logout();
                    return;
                }

                try {
                    const response = await getMyInfo();
                    if (response?.result) {
                        set({ user: response.result });
                    } else {
                        get().logout();
                    }
                } catch (err) {
                    console.error("Failed to fetch my info", err);
                    get().logout();
                }
            },
        }),
        {
            name: "auth-storage",
            storage: createJSONStorage(() => localStorage),
        }
    )
);
