/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ServiceToSave {
  service_name: string;
  service_ID: number;
  amount_of_time: number;
  units: string;
  desired_start_date: string;
  buying_date: string
  Price: number;
  expire_date?: string;
}


export interface buyingExerciseInterface {
  data: BuyingService[]
  msg: string
  status: number
}

export interface BuyingService {
  orders_exercise: any;
  users: any;
  
  buying_ID: number
  user_ID: number
  payment_confirmation: string
  buying_status: false
  buying_date: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  emp_ID: any
  order: Orders[]
}

////////////////////////////////////////
export interface Orders {
  order_ID: number
  buying_ID: number
  service_ID: number
  service_name: string
  amount_of_time: string
  units: string
  desired_start_date: string
  expire_date: string
  Price: number
}
