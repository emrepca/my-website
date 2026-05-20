import { redirect } from 'next/navigation'
import { DEFAULT_LOCALE } from '@/constants/config'

export default function RootPage() {
  redirect(`/${DEFAULT_LOCALE}`)
}
