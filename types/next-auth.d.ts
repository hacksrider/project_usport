

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
        id: string
        user_name: string
        user_lastname: string
        user_date_of_birth: string
        user_email: string
        sex: string
        user_tel: string
        user_username: string
        ID_card_photo: string
        accom_rent_contrac_photo: string
        user_profile_picture: string
        status_of_VIP: boolean
    }
  }
}

declare module 'next-auth/jwt' {
    interface JWT {
        id: string
        user_name: string
        user_lastname: string
        user_date_of_birth: string
        user_email: string
        sex: string
        user_tel: string
        user_username: string
        ID_card_photo: string
        accom_rent_contrac_photo: string
        user_profile_picture: string
        status_of_VIP: boolean
    }
  }