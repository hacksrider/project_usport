// /* eslint-disable @typescript-eslint/no-explicit-any */
// import prisma from "@/lib/db";
// import NextAuth from "next-auth/next";
// import CredentialsProvider from "next-auth/providers/credentials";
// // import bcrypt from "bcrypt";
// import { PrismaAdapter } from "@auth/prisma-adapter";
// import { JWT } from "next-auth/jwt";
// import { Session } from "next-auth";
// // eslint-disable-next-line @typescript-eslint/ban-ts-comment
// // @ts-expect-error
// import { AuthOptions } from "next-auth";

// export const authOption: AuthOptions = {
//   providers: [
//     // การกำหนดวิธีการยืนยันตัวตนของผู้ใช้
//     CredentialsProvider(
//       // เป็น provider ที่ใช้สำหรับการล็อกอินโดยใช้ข้อมูลรับรอง (credentials) ของผู้ใช้โดยตรง
//       {
//         id: "user",
//         name: "Credentials",
//         credentials: {
//           username: { label: "Username", type: "text" },
//           password: { label: "Password", type: "password" },
//         },
//         async authorize(credentials) {
//           if (!credentials) return null;

//           const user = await prisma.users.findFirst({
//             where: {
//               OR: [
//                 { user_username: credentials.username },
//                 { user_email: credentials.username },
//               ],
//             },
//           });

//           if (!user) {
//             throw new Error("Invalid username or password");
//           }

//           const {
//             user_ID,
//             user_name,
//             user_lastname,
//             user_date_of_birth,
//             user_email,
//             sex,
//             user_tel,
//             user_username,
//             ID_card_photo,
//             accom_rent_contrac_photo,
//             status_of_VIP,
//             user_profile_picture,
//           } = user;
//           return {
//             id: user_ID.toString(),
//             user_name,
//             user_lastname,
//             user_date_of_birth,
//             user_email,
//             sex,
//             user_tel,
//             user_username,
//             ID_card_photo,
//             accom_rent_contrac_photo,
//             status_of_VIP,
//             user_profile_picture,
//           };
//           // } else {
//           //     throw new Error('Invalid username or password');
//           // }
//         },
//       }
//     ),
//     CredentialsProvider(
//       // เป็น provider ที่ใช้สำหรับการล็อกอินโดยใช้ข้อมูลรับรอง (credentials) ของผู้ใช้โดยตรง
//       {
//         id: "admin",
//         name: "AdminCredentials",
//         credentials: {
//           username: { label: "Username", type: "text" },
//           password: { label: "Password", type: "password" },
//         },
//         async authorize(credentials) {
//           if (!credentials) return null;

//           const admin = await prisma.employees.findFirst({
//             where: {
//               OR: [{ emp_username: credentials.username }],
//             },
//           });
//           /* console.log("---- admin ----")
//           console.log(admin) */
//           if (!admin) {
//             throw new Error("Invalid username or password");
//           }

//           const {
//             emp_ID,
//             emp_name,
//             emp_lastname,
//             emp_job,
//             emp_sex,
//             emp_tel,
//             emp_username,
//           } = admin;
//           return {
//             id: emp_ID.toString(),
//             emp_name,
//             emp_lastname,
//             emp_job,
//             emp_sex,
//             emp_tel,
//             emp_username,
//             type: "admin",
//           };
//           // } else {
//           //     throw new Error('Invalid username or password');
//           // }
//         },
//       }
//     ),
//   ],
//   adapter: PrismaAdapter(prisma),
//   session: {
//     strategy: "jwt",
//   },
//   callbacks: {
//     jwt: async ({
//       token,
//       trigger,
//       user,
//       session,
//     }: {
//       token: JWT;
//       trigger: any;
//       user: any;
//       session: any;
//     }) => {
//       console.log(token);
//       if (trigger === "update" && session) {
//         /* console.log("------ session ----- ")
//         console.log(session) */
//         token.user_name = session.user_name;
//         token.user_lastname = session.user_lastname;
//         token.user_date_of_birth = session.user_date_of_birth;
//         token.user_email = session.user_email;
//         token.sex = session.sex;
//         token.user_tel = session.user_tel;
//         token.user_username = session.user_username;
//         token.ID_card_photo = session.ID_card_photo;
//         token.accom_rent_contrac_photo = session.accom_rent_contrac_photo;
//         token.user_profile_picture = session.user_profile_picture;
//         token.status_of_VIP = session.status_of_VIP;

//         token.emp_name = session.emp_name;
//         token.emp_lastname = session.emp_lastname;
//         token.emp_job = session.emp_job;
//         token.emp_sex = session.emp_sex;
//         token.emp_tel = session.emp_tel;
//         token.emp_username = session.emp_username;
//         /* token.emp_name = session.admin.emp_name;
//         token.emp_lastname = session.admin.emp_lastname;
//         token.emp_job = session.admin.emp_job;
//         token.emp_sex = session.admin.emp_sex;
//         token.emp_tel = session.admin.emp_tel;
//         token.emp_username = session.admin.emp_username; */
//       }

//       if (user && user.type != "admin") {
//         token.id = user.id;
//         token.user_name = user.user_name;
//         token.user_lastname = user.user_lastname;
//         token.user_date_of_birth = user.user_date_of_birth;
//         token.user_email = user.user_email;
//         token.sex = user.sex;
//         token.user_tel = user.user_tel;
//         token.user_username = user.user_username;
//         token.ID_card_photo = user.ID_card_photo;
//         token.accom_rent_contrac_photo = user.accom_rent_contrac_photo;
//         token.user_profile_picture = user.user_profile_picture;
//         token.status_of_VIP = user.status_of_VIP;
//       } else if (user && user.type == "admin") {
//         console.log(user);
//         token.id = user.id;
//         token.emp_name = user.emp_name;
//         token.emp_lastname = user.emp_lastname;
//         token.emp_job = user.emp_job;
//         token.emp_sex = user.emp_sex;
//         token.emp_tel = user.emp_tel;
//         token.emp_username = user.emp_username;
//         token.type = user.type;
//       }

//       console.log("---- token ----");
//       console.log(token);
//       return token;
//     },

//     session: async ({ session, token }: { session: Session; token: JWT }) => {
//       console.log(session);
//       if (session.user) {
//         session.user.id = token.id;
//         session.user.user_name = token.user_name;
//         session.user.user_lastname = token.user_lastname;
//         session.user.user_date_of_birth = token.user_date_of_birth;
//         session.user.user_email = token.user_email;
//         session.user.sex = token.sex;
//         session.user.user_tel = token.user_tel;
//         session.user.user_username = token.user_username;
//         session.user.ID_card_photo = token.ID_card_photo;
//         session.user.accom_rent_contrac_photo = token.accom_rent_contrac_photo;
//         session.user.user_profile_picture = token.user_profile_picture;
//         session.user.status_of_VIP = token.status_of_VIP;

//         session.user.emp_name = token.emp_name;
//         session.user.emp_lastname = token.emp_lastname;
//         session.user.emp_job = token.emp_job;
//         session.user.emp_sex = token.emp_sex;
//         session.user.emp_tel = token.emp_tel;
//         session.user.emp_username = token.emp_username;
//       }

//       /* if (session.admin) {
//         session.admin.id = token.id;
//         session.admin.emp_name = token.emp_name;
//         session.admin.emp_lastname = token.emp_lastname;
//         session.admin.emp_job = token.emp_job;
//         session.admin.emp_sex = token.emp_sex;
//         session.admin.emp_tel = token.emp_tel;
//         session.admin.emp_username = token.emp_username;
//       } */
//       console.log(session);
//       return session;
//     },
//   },
//   secret: process.env.NEXTAUTH_SECRET,
// };
// const handler = NextAuth(authOption);
// export { handler as GET, handler as POST };

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
import { employees, users } from "@prisma/client";

async function findAdminByUsernameOrEmail(
  credentials: Record<"username" | "password", string> | undefined
): Promise<employees | null> {
  const data = await prisma.$queryRaw`
    SELECT *
    FROM employees  
    WHERE BINARY emp_username = ${credentials?.username}
       OR BINARY emp_email = ${credentials?.username}
    LIMIT 1
  ` as employees[];
  return data[0] as employees || null;
}
async function findUserByUsernameOrEmail(
  credentials: Record<"username" | "password", string> | undefined
): Promise<users | null> {
  const data = await prisma.$queryRaw`
    SELECT *
    FROM users  
    WHERE BINARY user_username = ${credentials?.username}
       OR BINARY user_email = ${credentials?.username}
    LIMIT 1
  ` as users[];
  return data[0] as users || null;
}

export const authOption: AuthOptions = {
  providers: [
    // การกำหนดวิธีการยืนยันตัวตนของผู้ใช้
    CredentialsProvider(
      // เป็น provider ที่ใช้สำหรับการล็อกอินโดยใช้ข้อมูลรับรอง (credentials) ของผู้ใช้โดยตรง
      {
        id: "user",
        name: "Credentials",
        credentials: {
          username: { label: "Username", type: "text" },
          password: { label: "Password", type: "password" },
        },
        async authorize(credentials) {
          if (!credentials) return null;
          // console.log(
          //   "credentials.username --------------> ",
          //   credentials.username
          // );
          const user = await findUserByUsernameOrEmail(credentials);

          if (!user) {
            throw new Error("Invalid username or password");
          }

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
        },
      }
    ),
    CredentialsProvider(
      // เป็น provider ที่ใช้สำหรับการล็อกอินโดยใช้ข้อมูลรับรอง (credentials) ของผู้ใช้โดยตรง
      {
        id: "admin",
        name: "AdminCredentials",
        credentials: {
          username: { label: "Username", type: "text" },
          password: { label: "Password", type: "password" },
        },
        async authorize(credentials) {
          if (!credentials) return null;

          // console.log(
          //   "credentials.username ad --------------> ",
          //   credentials.username
          // );
          // const admin = await prisma.employees.findFirst({
          //   where: {
          //     OR: [
          //       { emp_username: credentials.username },
          //       { emp_email: credentials.username },
          //     ],

          //   },
          // });

          const admin = await findAdminByUsernameOrEmail(credentials);
          // console.log("admin --------------> ", admin);

          if (!admin) {
            throw new Error("Invalid username or password");
          }

          const {
            emp_ID,
            emp_name,
            emp_lastname,
            emp_job,
            emp_sex,
            emp_email,
            emp_tel,
            emp_username,
          } = admin;
          return {
            id: emp_ID.toString(),
            emp_name,
            emp_lastname,
            emp_job,
            emp_sex,
            emp_email,
            emp_tel,
            emp_username,
            type: "admin",
          };
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

        token.emp_name = session.emp_name;
        token.emp_lastname = session.emp_lastname;
        token.emp_job = session.emp_job;
        token.emp_sex = session.emp_sex;
        token.emp_tel = session.emp_tel;
        token.emp_email = session.emp_email;
        token.emp_username = session.emp_username;
      }

      if (user && user.type != "admin") {
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
      } else if (user && user.type == "admin") {
        token.id = user.id;
        token.emp_name = user.emp_name;
        token.emp_lastname = user.emp_lastname;
        token.emp_job = user.emp_job;
        token.emp_sex = user.emp_sex;
        token.emp_tel = user.emp_tel;
        token.emp_email = user.emp_email;
        token.emp_username = user.emp_username;
        token.type = user.type;
      }
      return token;
    },

    session: async ({ session, token }: { session: Session; token: JWT }) => {
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

        session.user.emp_name = token.emp_name;
        session.user.emp_lastname = token.emp_lastname;
        session.user.emp_job = token.emp_job;
        session.user.emp_sex = token.emp_sex;
        session.user.emp_email = token.emp_email;
        session.user.emp_tel = token.emp_tel;
        session.user.emp_username = token.emp_username;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
const handler = NextAuth(authOption);
export { handler as GET, handler as POST };
