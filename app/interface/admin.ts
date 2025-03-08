// export interface AdminInterface {
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   user: Admin | any;
//   // admin: Admin;
//   expires: string;
// }

// export interface Admin {
//   emp_ID: number
//   emp_name: string
//   emp_lastname: string
//   emp_sex: string
//   emp_username: string
//   emp_password: string
//   emp_tel: string
//   emp_job: boolean
// }

// export interface ResGetAllAdmin {
//   data: ResDataAdmin[];
//   msg: string;
//   status: number;
// }

// export interface ResDataAdmin {
//   created_at: string | number | Date;
//   emp_ID: number;
//   emp_name: string;
//   emp_lastname: string;
//   emp_sex: string;
//   emp_username: string;
//   emp_password: string;
//   emp_tel: string;
//   emp_job: boolean;
// }

export interface AdminInterface {
  user: Admin;
  expires: string;
}

export interface Admin {
  emp_ID: number;
  emp_name: string;
  emp_lastname: string;
  emp_sex: string;
  emp_username: string;
  emp_email: string;
  emp_password: string;
  emp_tel: string;
  emp_job: boolean;
}



export type ResGetAllAdmin = ResDataAdmin[];

export interface ResDataAdmin {
  emp_ID: number;
  emp_name: string;
  emp_lastname: string;
  emp_sex: string;
  emp_username: string;
  emp_password: string;
  emp_email: string;
  emp_tel: string;
  emp_job: boolean;
}
