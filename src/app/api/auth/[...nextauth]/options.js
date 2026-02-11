import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { generateToken, generateRefreshToken } from "@/lib/jwt";

const baseUrl =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://career-development-nepal.vercel.app";

export const options = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // console.log("➡️ Credentials authorize: received credentials:", credentials)
        try {
          const res = await fetch(`${baseUrl}/api/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(credentials),
          });

          const data = await res.json();
          // console.log("✅ Login response:", data)

          if (!res.ok || !data.user) {
            throw new Error(data?.error || "Invalid credentials");
          }

          // Return both user data and tokens
          return {
            ...data.user,
            accessToken: data.tokens.accessToken,
            refreshToken: data.tokens.refreshToken,
          };
        } catch (error) {
          console.error("❌ Error in credentials authorize:", error);
          throw new Error(error.message);
        }
      },
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],

  pages: {
    signIn: "/auth",
  },

  callbacks: {
    async jwt({ token, user, account, profile }) {
      // console.log("🔁 JWT callback triggered")
      // console.log("▶️ token:", token)
      // console.log("▶️ user:", user)
      // console.log("▶️ account:", account)
      // console.log("▶️ profile:", profile)

      if (account && profile) {
        const providerId = profile.sub || profile.id;
        const email = profile.email;
        const name = profile.name || "User";
        const image = profile.picture;

        try {
          // console.log("🌐 Attempting login via API for OAuth user")
          const loginRes = await fetch(`${baseUrl}/api/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, providerId }),
          });

          let userData;
          let tokens;

          if (loginRes.ok) {
            const data = await loginRes.json();
            // console.log("✅ OAuth login success:", data)
            userData = data.user;
            tokens = data.tokens;
          } else {
            // console.log("⚠️ OAuth login failed. Trying registration...")
            const registerRes = await fetch(`${baseUrl}/api/user/register`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                name,
                email,
                password: "",
                image,
                role: "user",
                provider: account.provider,
                providerId,
              }),
            });

            const regData = await registerRes.json();
            // console.log("✅ Registration response:", regData)
            userData = regData.user;

            // Generate tokens for newly registered OAuth user
            if (userData) {
              const accessTokenPayload = {
                id: userData.id,
                email: userData.email,
                role: userData.role,
                name: userData.name,
              };

              const refreshTokenPayload = {
                id: userData.id,
              };

              tokens = {
                accessToken: generateToken(accessTokenPayload),
                refreshToken: generateRefreshToken(refreshTokenPayload),
              };
            }
          }

          if (userData && tokens) {
            token.id = userData.id;
            token.name = userData.name;
            token.email = userData.email;
            token.role = userData.role;
            token.image = userData.image;
            token.accessToken = tokens.accessToken;
            token.refreshToken = tokens.refreshToken;
          }
        } catch (err) {
          console.error("❌ OAuth error:", err);
        }
      }

      if (user) {
        // console.log("🧾 Adding user to token")
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.role = user.role;
        token.image = user.image;
        // Include custom tokens from credentials login
        if (user.accessToken) {
          token.accessToken = user.accessToken;
          token.refreshToken = user.refreshToken;
        }
      }

      return token;
    },

    async session({ session, token }) {
      // console.log("📦 Session callback triggered")
      // console.log("➡️ Incoming token:", token)

      session.user = {
        id: token.id,
        name: token.name,
        email: token.email,
        role: token.role,
        image: token.image,
      };

      // Include custom access token in session
      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken;

      // console.log("✅ Final session object:", session)
      return session;
    },
  },

  session: {
    strategy: "jwt",
  },

  secret: process.env.NEXTAUTH_SECRET,
};
