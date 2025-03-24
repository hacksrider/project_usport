export interface ResGetAllReviewFottball {
    data: GetReviewFootball[]
    msg: string
    status: number
}

export interface GetReviewFootball {
  review_ID: number
  field_ID: number
  user_ID: number
  rating: number
  comment: string
  user: User
  field: Field
}

export interface User {
  user_ID: number
  user_name: string
  user_lastname: string
  user_tel: string
  user_date_of_birth: string
  ID_card_photo: string
  accom_rent_contrac_photo: string
  status_of_VIP: boolean
  status_of_Member: boolean
  user_email: string
  user_username: string
  user_password: string
  sex: string
  user_profile_picture: string
}

export interface Field {
  field_ID: number
  field_name: string
  status: boolean
}
