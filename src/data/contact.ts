export interface Phone {
  name: string
  /** as displayed */
  label: string
  /** E.164 for tel: links */
  tel: string
  /** digits only for wa.me links */
  wa: string
}

/** Jovan je primarni kontakt: prvi broj svuda na stranici i broj na koji idu WhatsApp upiti. */
export const PRIMARY_PHONE: Phone = { name: 'Jovan', label: '098 9077 071', tel: '+385989077071', wa: '385989077071' }
export const PHONES: Phone[] = [PRIMARY_PHONE, { name: 'Dejan', label: '098 182 6790', tel: '+385981826790', wa: '385981826790' }]

export const INSTAGRAM_URL = 'https://www.instagram.com/impalaklesarstvo/'
export const FACEBOOK_URL = 'https://www.facebook.com/impalaklesarstvo.vukovar.3/'
