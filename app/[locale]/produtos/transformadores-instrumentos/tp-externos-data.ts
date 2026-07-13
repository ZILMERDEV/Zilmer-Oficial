// Dados dos modelos de TP Externos
// Baseado nos modelos encontrados no site: IPSGE-FT, IPSG, IPSE, IPSDE-FT, IPSAE-FF, IPSAE-36, IPSG-FF

export interface TPExternoModel {
  id: string;
  name: string;
  image: string;
  pdf?: string; // URL do PDF - adicionar quando disponível
}

export const tpExternosModels: TPExternoModel[] = [
  {
    id: 'ipsge-ft',
    name: 'IPSGE-FT',
    image: '/images/produtos/instrumentos/tp-externos/tp-externo-2.jpg',
    pdf: '/pdfs/instrumentos/tp-externos/ipsge-ft.pdf',
  },
  {
    id: 'ipse',
    name: 'IPSE',
    image: '/images/produtos/instrumentos/tp-externos/tp-externo-6.jpg',
    pdf: '/pdfs/instrumentos/tp-externos/ipse.pdf',
  },
  {
    id: 'ipsde-ft',
    name: 'IPSDE-FT',
    image: '/images/produtos/instrumentos/tp-externos/tp-externo-8.jpg',
    pdf: '/pdfs/instrumentos/tp-externos/ipsde-ft.pdf',
  },
  {
    id: 'ipsae-ff',
    name: 'IPSAE-FF',
    image: '/images/produtos/instrumentos/tp-externos/tp-externo-10.jpg',
    pdf: '/pdfs/instrumentos/tp-externos/ipsae-ff.pdf',
  },
  {
    id: 'ipsae-36',
    name: 'IPSAE-36',
    image: '/images/produtos/instrumentos/tp-externos/tp-externo-12.jpg',
    pdf: '/pdfs/instrumentos/tp-externos/ipsae-ft.pdf',
  },
  {
    id: 'ipsg-ff',
    name: 'IPSG-FF',
    image: '/images/produtos/instrumentos/tp-externos/tp-externo-14.jpg',
    pdf: '/pdfs/instrumentos/tp-externos/ipsg-ff.pdf',
  },
];

