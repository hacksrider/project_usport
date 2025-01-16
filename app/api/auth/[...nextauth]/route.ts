/* eslint-disable @typescript-eslint/no-explicit-any */
import prisma from "@/lib/db";
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
// import bcrypt from "bcrypt";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { JWT } from "next-auth/jwt";
import { Session } from "next-auth";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import { AuthOptions } from "next-auth";

export const authOption: AuthOptions = {
  providers: [
    // การกำหนดวิธีการยืนยันตัวตนของผู้ใช้
    CredentialsProvider(
      // เป็น provider ที่ใช้สำหรับการล็อกอินโดยใช้ข้อมูลรับรอง (credentials) ของผู้ใช้โดยตรง
      {
        name: "Credentials",
        credentials: {
          username: { label: "Username", type: "text" },
          password: { label: "Password", type: "password" },
        },
        async authorize(credentials) {
          if (!credentials) return null;
          console.log(credentials);
          const user = await prisma.users.findFirst({
            where: {
              OR: [
                { user_username: credentials.username },
                { user_email: credentials.username },
              ],
            },
          });
          console.log(user);
          if (!user) {
            throw new Error("Invalid username or password");
          }

          // const isPasswordValid = await bcrypt.compare(
          //   credentials.password,
          //   user.user_password
          // );
          // if (!isPasswordValid) {
          //   throw new Error("Invalid username or password");
          // }

          const {
            user_ID,
            user_name,
            user_lastname,
            user_date_of_birth,
            user_email,
            sex,
            user_tel,
            user_username,
            ID_card_photo,
            accom_rent_contrac_photo,
            status_of_VIP,
            user_profile_picture,
          } = user;
          return {
            id: user_ID.toString(),
            user_name,
            user_lastname,
            user_date_of_birth,
            user_email,
            sex,
            user_tel,
            user_username,
            ID_card_photo,
            accom_rent_contrac_photo,
            status_of_VIP,
            user_profile_picture,
          };
          // } else {
          //     throw new Error('Invalid username or password');
          // }
        },
      }
    ),
  ],
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  callbacks: {
    jwt: async ({
      token,
      trigger,
      user,
      session,
    }: {
      token: JWT;
      trigger: any;
      user: any;
      session: any;
    }) => {
      if (trigger === "update" && session) {
        token.user_name = session.user_name;
        token.user_lastname = session.user_lastname;
        token.user_date_of_birth = session.user_date_of_birth;
        token.user_email = session.user_email;
        token.sex = session.sex;
        token.user_tel = session.user_tel;
        token.user_username = session.user_username;
        token.ID_card_photo = session.ID_card_photo;
        token.accom_rent_contrac_photo = session.accom_rent_contrac_photo;
        token.user_profile_picture = session.user_profile_picture;
        token.status_of_VIP = session.status_of_VIP;
      }
  
      if (user) {
        token.id = user.id;
        token.user_name = user.user_name;
        token.user_lastname = user.user_lastname;
        token.user_date_of_birth = user.user_date_of_birth;
        token.user_email = user.user_email;
        token.sex = user.sex;
        token.user_tel = user.user_tel;
        token.user_username = user.user_username;
        token.ID_card_photo = user.ID_card_photo;
        token.accom_rent_contrac_photo = user.accom_rent_contrac_photo;
        token.user_profile_picture = user.user_profile_picture;
        token.status_of_VIP = user.status_of_VIP;
      }
  
      return token;
    },
  
    session: async ({
      session,
      token,
    }: {
      session: Session;
      token: JWT;
    }) => {
      if (session.user) {
        session.user.id = token.id;
        session.user.user_name = token.user_name;
        session.user.user_lastname = token.user_lastname;
        session.user.user_date_of_birth = token.user_date_of_birth;
        session.user.user_email = token.user_email;
        session.user.sex = token.sex;
        session.user.user_tel = token.user_tel;
        session.user.user_username = token.user_username;
        session.user.ID_card_photo = token.ID_card_photo;
        session.user.accom_rent_contrac_photo = token.accom_rent_contrac_photo;
        session.user.user_profile_picture = token.user_profile_picture;
        session.user.status_of_VIP = token.status_of_VIP;
      }
  
      // console.log("Session data:", session);
  
      return session;
    },
  },
  

  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOption);

export { handler as GET, handler as POST };
