/* eslint-disable @typescript-eslint/no-explicit-any */
// export interface ResService {
//   service: Service
//   timeServices: TimeService[]
//   priceExercise: PriceExercise[]
// }

// export interface Service {
//   service_ID: number
//   service_name: string
//   capacity_of_room: number
//   Status: boolean
// }

// export interface TimeService {
//   time_ID: number
//   service_ID: number
//   quantity_of_days: number
//   unit: string
//   PriceExercise: PriceExercise
// }

// export interface PriceExercise {
//   price_ID: number
//   time_ID: number
//   price: number

// }

// export interface ResService {
//   service_name: string
//   capacity_of_room: number
//   Status: boolean
//   detail: Detail[]
// }

// export interface Detail {
//   price: number
//   unit: string
//   quantity_of_days: number
// }


// export interface ResService {
//   service: Service
//   timeServices: TimeService[]
// }

// export interface Service {
//   service_ID: number
//   service_name: string
//   capacity_of_room: number
//   Status: boolean
// }

// export interface TimeService {
//   time_ID: number
//   service_ID: number
//   quantity_of_days: number
//   unit: string
//   price: number
// }

export interface ResService {
  service_name: string
  capacity_of_room: number
  Status: boolean
  detail: TimeAndPrice[]
}

export interface TimeAndPrice {
  time_and_price: unknown
  unit: string
  quantity_of_days: number
  price: number
}

//////////////////////////////
export interface ServicesInterface {
  data: ServiceAll[]
  msg: string
  status: number
}

export interface ServiceAll {
  service_ID: number
  service_name: string
  capacity_of_room: number
  Status: boolean
  buying_exercise: any[]
  reviews: any[]
  time_and_price: TimeAndPrice[]
}

export interface TimeAndPrice {
  time_ID: number
  service_ID: number
  quantity_of_days: number
  unit: string
  price: number
}


// export interface ServicesInterface {
//   data: ServiceAll[]
//   msg: string
//   status: number
// }

// export interface ServiceAll {
//   price_exercise: any
//   service_ID: number
//   service_name: string
//   capacity_of_room: number
//   Status: boolean
//   buying_exercise: any[]
//   reviews: any[]
//   time_and_price: TimeOfService[]
// }

// export interface TimeOfService {
//   time_and_price: any
//   time_ID: number
//   service_ID: number
//   quantity_of_days: number
//   unit: string
//   price: number
// }


// export interface ServicesInterface {
//   data: ServiceAll[]
//   msg: string
//   status: number
// }

// export interface ServiceAll {
//   time_and_price: any
  
//   id: string
//   serviceName: any
//   price: any
//   service_ID: number
//   service_name: string
//   capacity_of_room: number
//   Status: boolean
//   // Buying_Exercise: any[]
//   // Reviews: any[]
//   price_exercise: PriceExercise[]
// }

// export interface PriceExercise {
//   price_ID: number
//   service_ID: number
//   time_ID: number
//   price: number
//   time_and_price: TimeOfService
// }

// export interface TimeOfService {
//   time_ID: number
//   quantity_of_days: number
//   unit: string
// }
