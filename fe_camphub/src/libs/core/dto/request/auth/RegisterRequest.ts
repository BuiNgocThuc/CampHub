export interface RegisterRequest {
    username: string;
    password: string;
    firstname: string;
    lastname: string;
    email: string;
    phoneNumber?: string;
    idNumber?: string;
    avatar?: string;
}