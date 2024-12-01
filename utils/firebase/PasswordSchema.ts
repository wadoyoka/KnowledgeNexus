import { z } from "zod";

export const passwordSchema = z
    .string()
    .min(10, "パスワードは最低10文字必要です")
    .max(4096, "パスワードは最大4096文字までです")
    .refine(
        (password) => /[A-Z]/.test(password),
        "パスワードには大文字を含める必要があります"
    )
    .refine(
        (password) => /[a-z]/.test(password),
        "パスワードには小文字を含める必要があります"
    )
    .refine(
        (password) => /[!@#$%^&*(),.?":{}|<>]/.test(password),
        "パスワードには特殊文字を含める必要があります"
    )
    .refine(
        (password) => /\d/.test(password),
        "パスワードには数字を含める必要があります"
    );