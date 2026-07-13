import {defineRouting} from 'next-intl/routing';
import {createNavigation} from 'next-intl/navigation';

export const routing = defineRouting({
  locales: ['pt', 'en', 'es'],
  defaultLocale: 'pt',
  localePrefix: 'always', // ISSO É OBRIGATÓRIO PARA CORRIGIR OS LINKS
  domains: [
    {
      domain: 'www.zilmer.com.br',
      defaultLocale: 'pt',
      locales: ['pt', 'en', 'es']
    },
    {
      domain: 'zilmer.com.br',
      defaultLocale: 'pt',
      locales: ['pt', 'en', 'es']
    }
  ]
});

export const {Link, redirect, usePathname, useRouter} = createNavigation(routing);
