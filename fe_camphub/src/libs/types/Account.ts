import { UserStatus, UserType } from "../constants";

export interface Account {
    id: string; // UUID

    username: string;
    password?: string;

    firstname: string;
    lastname: string;

    email: string;
    phoneNumber?: string | null;
    idNumber?: string | null;

    avatar?: string | null;

    trustScore: number; // default 100
    coinBalance: number; // default 0.0

    userType: UserType;
    status: UserStatus;

    createdAt: string; // ISO datetime
    updatedAt: string;
    deletedAt?: string | null;
}

