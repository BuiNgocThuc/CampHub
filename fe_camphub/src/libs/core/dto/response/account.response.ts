import { UserStatus, UserType } from "../../constants";

export interface AccountResponse {
    id: string;
    username: string;
    firstname: string;
    lastname: string;
    email: string;
    phoneNumber: string;
    idNumber: string;
    avatar: string;
    trustScore: number;
    coinBalance: number;
    userType: UserType;
    status: UserStatus;
    createdAt: string; // ISO datetime
    updatedAt: string; // ISO datetime
}

export interface TopUpResponse {
    newBalance: number;
}