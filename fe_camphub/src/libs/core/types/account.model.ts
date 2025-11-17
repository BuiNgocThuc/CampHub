import { UserStatus, UserType } from "../constants";

export interface Account {
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

