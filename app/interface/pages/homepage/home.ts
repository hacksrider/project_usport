export type GetAllHomepages = DataHomepages[]

export interface DataHomepages {
  page_home_id: number
  title: string
  subtitle: string
  banner: string
  page_home_exercise: PageHomeExercise[]
  page_home_promotion: PageHomePromotion[]
  page_home_gallery: PageHomeGallery[]
}

export interface PageHomeExercise {
  page_home_service_id: number
  name_exercise: string
  description: string
  banner_exercise: string
  page_home_id: number
}

export interface PageHomePromotion {
  page_home_promotion_id: number
  title_promotion: string
  detail_promotion: string
  banner_promotion: string
  page_home_id: number
}

export interface PageHomeGallery {
  page_home_gallery_id: number
  picture_gallery: string
  page_home_id: number
}
