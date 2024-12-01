import { firebaseAdmin } from "@/lib/firebase-admin"
import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                idToken: { label: "ID Token", type: "text" },
            },
            async authorize(credentials) {
                if (!credentials?.idToken) return null
                try {
                    const decodedToken = await firebaseAdmin.auth().verifyIdToken(credentials.idToken)
                    return {
                        id: decodedToken.uid,
                        email: decodedToken.email,
                    }
                } catch (error) {
                    console.error("Failed to verify ID token:", error)
                    return null
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id
                token.email = user.email
            }
            return token
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string
                session.user.email = token.email as string
            }
            return session
        },
    },
    session: {
        strategy: "jwt",
        maxAge: 7 * 24 * 60 * 60, //セッション期間 1週間
    },
}