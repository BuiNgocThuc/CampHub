import { jwtDecode } from "jwt-decode";

export interface DecodedToken {
    sub: string;
    userId: string;
    userType: "ADMIN" | "USER";
    exp: number;
    iat: number;
}

export const decodeAccessToken = (token: string): DecodedToken | null => {
    try {
        return jwtDecode<DecodedToken>(token);
    } catch (error) {
        console.error("Invalid token", error);
        return null;
    }
};
