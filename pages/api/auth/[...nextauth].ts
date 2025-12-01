// import NextAuth, { NextAuthOptions } from "next-auth";
// import GoogleProvider from "next-auth/providers/google";
// import CredentialsProvider from "next-auth/providers/credentials";
// import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
// import clientPromise from "@/lib/mongodb-client";
// import { getDatabase } from "@/lib/mongodb";
// import { verifyPassword } from "@/lib/auth";

// export const authOptions: NextAuthOptions = {
//   adapter: MongoDBAdapter(clientPromise),
  
//   providers: [
//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID!,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
//     }),
    
//     CredentialsProvider({
//       id: "credentials",
//       name: "Credentials",
//       credentials: {
//         username: { label: "Username", type: "text" },
//         password: { label: "Password", type: "password" }
//       },
//       async authorize(credentials) {
//         if (!credentials?.username || !credentials.password) {
//           return null;
//         }

//         const db = await getDatabase();
//         const user = await db.collection("users").findOne({
//           username: credentials.username,
//         });

//         if (!user) return null;

//         const valid = await verifyPassword(credentials.password, user.password);
//         if (!valid) return null;

//         return {
//           id: user._id.toString(),
//           email: user.email || null,
//           username: user.username,
//           role: user.role || null,
//         };
//       }
//     }),
//   ],
  
//   callbacks: {
//     async jwt({ token, user, account }) {
//       if (user) {
//         token.role = user.role;
//         token.username = user.username;
//       }
      
//       // Handle Google login
//       if (account?.provider === "google") {
//         const db = await getDatabase();
//         const existingUser = await db.collection("users").findOne({ 
//           email: token.email 
//         });

//         if (existingUser) {
//           token.role = existingUser.role;
//           token.username = existingUser.username;
//         } else {
//           token.role = undefined;
//         }
//       }

//       return token;
//     },
    
//     async session({ session, token }) {
//       if (session.user) {
//         session.user.id = token.sub!;
//         session.user.role = token.role;
//         session.user.username = token.username;
//       }
//       return session;
//     },
//   },
  
//   // ✅ FIXED: Remove invalid 'signUp' property
//   pages: {
//     signIn: "/login",
//     error: "/login",
//   },
  
//   session: {
//     strategy: "jwt",
//     maxAge: 30 * 24 * 60 * 60,
//   },
  
//   secret: process.env.NEXTAUTH_SECRET,
// };

// export default NextAuth(authOptions);


import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "@/lib/mongodb-client";
import { getDatabase } from "@/lib/mongodb";
import { verifyPassword } from "@/lib/auth";

export const authOptions: NextAuthOptions = {
  adapter: MongoDBAdapter(clientPromise),
  
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials.password) {
          return null;
        }

        const db = await getDatabase();
        const user = await db.collection("users").findOne({
          username: credentials.username,
        });

        if (!user) return null;

        const valid = await verifyPassword(credentials.password, user.password);
        if (!valid) return null;

        return {
          id: user._id.toString(),
          email: user.email || null,
          username: user.username,
          role: user.role || null,
        };
      }
    }),
  ],
  
  callbacks: {
    async jwt({ token, user, account, trigger }) {
      const db = await getDatabase();

      if (user) {
        token.role = user.role;
        token.username = user.username;
      }
      
      // Handle Google login - FIRST TIME
      if (account?.provider === "google" && trigger === "signIn") {
        const existingUser = await db.collection("users").findOne({ 
          email: token.email 
        });

        if (existingUser) {
          // Existing user - use their role
          token.role = existingUser.role;
          token.username = existingUser.username;
        } else {
          // New Google user - create user with null role
          await db.collection("users").insertOne({
            email: token.email,
            username: token.name || token.email?.split('@')[0],
            role: null, // Force role selection
            provider: "google",
            createdAt: new Date()
          });
          token.role = undefined;
        }
      }

      return token;
    },
    
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub!;
        session.user.role = token.role;
        session.user.username = token.username;
      }
      return session;
    },

    async redirect({ url, baseUrl }) {
      // Allow callback URLs to work for OAuth
      if (url.startsWith(baseUrl)) return url;
      // Redirect to role selection after OAuth sign in
      if (url.startsWith('/api/auth')) {
        return `${baseUrl}/auth/role-selection`;
      }
      return baseUrl;
    }
  },
  
  pages: {
    signIn: "/login",
    error: "/login",
  },
  
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  
  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);