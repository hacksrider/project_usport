/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ResGetAllReview {
    data: GetReview[]
    msg: string
    status: number
  }
  
  export interface GetReview {
    users: any
    service_of_exercise: any
    re_ID: number
    user_ID: number
    service_ID: number
    score: number
    Text_review: string
  }
  