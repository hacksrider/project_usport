/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ResService {
  service: Service
  timeServices: TimeService[]
  priceExercise: PriceExercise[]
}

export interface Service {
  service_ID: number
  service_name: string
  capacity_of_room: number
  Status: boolean
}

export interface TimeService {
  time_ID: number
  quantity_of_days: number
  unit: string
}

export interface PriceExercise {
  price_ID: number
  service_ID: number
  time_ID: number
  price: number
  Time_Of_Service: TimeOfService

}
//////////////////////////////
export interface ServicesInterface {
  data: ServiceAll[]
  msg: string
  status: number
}

export interface ServiceAll {
  price: any
  service_ID: number
  service_name: string
  capacity_of_room: number
  Status: boolean
  // Buying_Exercise: any[]
  // Reviews: any[]
  price_exercise: PriceExercise[]
}

export interface PriceExercise {
  price_ID: number
  service_ID: number
  time_ID: number
  price: number
  time_of_service: TimeOfService
}

export interface TimeOfService {
  time_ID: number
  quantity_of_days: number
  unit: string
}
