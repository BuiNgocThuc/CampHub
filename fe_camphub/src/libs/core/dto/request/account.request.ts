import { UserStatus, UserType } from "../../constants";

export interface AccountCreationRequest {
    username: string;
    password: string;
    firstname: string;
    lastname: string;
    email: string;
    phoneNumber: string;
    idNumber: string;
}

export interface AccountPatchRequest {
    password?: string;
    firstname?: string;
    lastname?: string;
    email?: string;
    phoneNumber?: string;
    idNumber?: string;
    avatar?: string;
    trustScore?: number;     
    coinBalance?: number; 
    userType?: UserType;
    status?: UserStatus;
}

export interface AccountUpdateRequest {
    password: string;
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
}

export interface TopUpRequest {
    amount: number;
}