export interface AboutPage {
    data: GetAboutPage[]
    msg: string
    status: number
  }
  
  export interface GetAboutPage {
    page_about_id: number
    title: string
    detail: string
    banner: string
    detail_usport1: string
    detail_usport2: string
    video: string
    exercise_about: ExerciseAbout[]
  }
  
  export interface ExerciseAbout {
    exercise_about_id: number
    title: string
    detail: string
    page_about_id: number
  }
  