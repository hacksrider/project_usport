export type GetAllContact = GetDataContact[]

export interface GetDataContact {
  page_contact_ID: number
  title: string
  subtitle: string
  banner: string
  title_contact: string
  subtitle_contact: string
  title_map: string
  link_map: string
  contact_channels: ContactChannel[]
}

export interface ContactChannel {
  contact_channels_ID: number
  name: string
  data: string
  page_contact_ID: number
}
