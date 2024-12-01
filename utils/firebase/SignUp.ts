import { auth } from "@/lib/firebase";
import { applyActionCode, createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
/**
 * 入力されたメールアドレスとパスワードでユーザーを新規作成しアドレス認証メールを送信する
 * @param {string} email メールアドレス
 * @param {string} password パスワード
 */
export async function signup(email: string, password: string) {
    const userCredencial = await createUserWithEmailAndPassword(auth, email, password);
    await sendEmailVerification(userCredencial.user);
    return
}

/**
 * コードを用いてアドレス認証を完了させる
 * @param {string} oobCode アドレス認証実行用コード
 */
export async function verifyEmail(oobCode:string) {
    await applyActionCode(auth, oobCode)
    return
}