export interface UserInterface {
  user: User;
  expires: string;
}

export interface User {
  id: string;
  user_name: string;
  user_lastname: string;
  user_date_of_birth: string;
  user_email: string;
  sex: string;
  user_tel: string;
  user_username: string;
  ID_card_photo: string;
  accom_rent_contrac_photo: string;
  user_profile_picture: string;
  status_of_VIP: boolean;
}

export interface ResGetAllUser {
  data: ResData[];
  msg: string;
  status: number;
}

export interface ResData {
  created_at: string | number | Date;
  user_ID: number;
  user_name: string;
  user_lastname: string;
  user_date_of_birth: string;
  user_email: string;
  sex: string;
  user_tel: string;
  user_username: string;
  user_password: string;
  ID_card_photo: string;
  accom_rent_contrac_photo: string;
  user_profile_picture: string;
  status_of_VIP: boolean;
}
