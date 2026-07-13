import createMiddleware from 'next-intl/middleware';
import {routing} from './i18n/routing';

// O middleware do next-intl já lida com o redirecionamento se configurado corretamente
export default createMiddleware(routing);

export const config = {
  // Ajustamos o matcher para capturar a raiz e aplicar a lógica de internacionalização
  matcher: ['/', '/(pt|en|es)/:path*', '/((?!api|_next|_vercel|.*\\..*).*)']
};
