import admin from "@/lib/firebase-admin"
import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                idToken: { label: "ID Token", type: "text" },
                userName: { label: "userName", type: "text" },
                photoURL: { label: "PhotoUrl", type: "text" },
            },
            async authorize(credentials) {
                if (!credentials?.idToken || !credentials?.photoURL || !credentials?.userName) return null
                try {
                    const decodedToken = await admin.auth().verifyIdToken(credentials.idToken)
                    return {
                        id: decodedToken.uid,
                        name: credentials.userName,
                        email: decodedToken.email,
                        image: credentials.photoURL,
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
                token.name = user.name
                token.email = user.email
                token.picture = user.image
            }
            return token
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string
                session.user.name = token.name as string
                session.user.email = token.email as string
                session.user.image = token.picture as string
            }
            return session
        },
    },
    session: {
        strategy: "jwt",
        maxAge: 7 * 24 * 60 * 60, //セッション期間 1週間
    },
}