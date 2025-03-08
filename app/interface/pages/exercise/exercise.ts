export type GetAllExercise = GetDataExercise[]

export interface GetDataExercise {
  page_exercise_ID: number
  title: string
  subtitle: string
  banner: string
  exercise_data: ExerciseData[]
}

export interface ExerciseData {
  exercise_data_ID: number
  name: string
  banner: string
  price: string
  detail: string
  table_price: string
  picture: string
  page_exercise_ID: number
}
