import { z } from "zod";

export const registerSchema = z.object({
    username: z
        .string()
        .min(4, "Tên đăng nhập phải từ 4 ký tự")
        .max(20, "Tối đa 20 ký tự")
        .regex(/^[a-zA-Z0-9_]+$/, "Chỉ được dùng chữ, số và gạch dưới"),

    password: z
        .string()
        .min(6, "Mật khẩu phải từ 6 ký tự")
        .max(50, "Mật khẩu quá dài"),

    firstname: z.string().min(1, "Vui lòng nhập tên"),
    lastname: z.string().min(1, "Vui lòng nhập họ"),

    email: z.string().email("Email không hợp lệ"),

    phone_number: z
        .string()
        .regex(/^0[3|5|7|8|9][0-9]{8}$/, "Số điện thoại không hợp lệ (VD: 0901234567)"),

    ID_number: z
        .string()
        .regex(/^[0-9]{9,12}$/, "CMND/CCCD phải là 9 hoặc 12 số"),
});

export type RegisterFormValues = z.infer<typeof registerSchema>;