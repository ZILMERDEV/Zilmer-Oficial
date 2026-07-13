import { getRequestConfig } from 'next-intl/server'
import { routing } from './routing'
import ptMessages from '../messages/pt.json'
import enMessages from '../messages/en.json'

const allMessages: Record<string, any> = {
  pt: ptMessages,
  en: enMessages,
}

export default getRequestConfig(async ({ requestLocale }) => {
  // This typically corresponds to the `[locale]` segment
  let locale = await requestLocale

  // Ensure that a valid locale is used
  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale
  }

  return {
    locale,
    messages: allMessages[locale as keyof typeof allMessages] ?? ptMessages,
  }
})
