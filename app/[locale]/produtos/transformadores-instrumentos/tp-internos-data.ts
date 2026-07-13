// Dados dos modelos de TP Internos
// Baseado nos modelos encontrados no site: IPSK, IPSH, IPSBF, IPSG-FT, IPSG-FF, IPSGF, IPSD, IPSB-24, IPSB, IPS-2A, IPSA

export interface TPInternoModel {
  id: string;
  name: string;
  image: string;
  pdf?: string; // URL do PDF - adicionar quando disponível
}

export const tpInternosModels: TPInternoModel[] = [
  {
    id: 'ipsk',
    name: 'IPSK',
    image: '/images/produtos/instrumentos/tp-internos/tp-interno-2.jpg',
    pdf: '/pdfs/instrumentos/tp-internos/ipsk.pdf',
  },
  {
    id: 'ipsh',
    name: 'IPSH',
    image: '/images/produtos/instrumentos/tp-internos/tp-interno-4.jpg',
    pdf: '/pdfs/instrumentos/tp-internos/ipsh.pdf',
  },
  {
    id: 'ipsbf',
    name: 'IPSBF',
    image: '/images/produtos/instrumentos/tp-internos/tp-interno-6.jpg',
    pdf: '/pdfs/instrumentos/tp-internos/ipsbf.pdf',
  },
  {
    id: 'ipsg-ft',
    name: 'IPSG-FT',
    image: '/images/produtos/instrumentos/tp-internos/tp-interno-8.jpg',
    pdf: '/pdfs/instrumentos/tp-internos/ipsg-ft.pdf',
  },
  {
    id: 'ipsg-ff',
    name: 'IPSG-FF',
    image: '/images/produtos/instrumentos/tp-internos/tp-interno-10.jpg',
    pdf: '/pdfs/instrumentos/tp-internos/ipsg-ff.pdf',
  },
  {
    id: 'ipsgf',
    name: 'IPSGF',
    image: '/images/produtos/instrumentos/tp-internos/tp-interno-12.jpg',
    pdf: '/pdfs/instrumentos/tp-internos/ipsgf.pdf',
  },
  {
    id: 'ipsd',
    name: 'IPSD',
    image: '/images/produtos/instrumentos/tp-internos/tp-interno-14.jpg',
    pdf: '/pdfs/instrumentos/tp-internos/ipsd.pdf',
  },
  {
    id: 'ipsb-24',
    name: 'IPSB-24',
    image: '/images/produtos/instrumentos/tp-internos/tp-interno-16.jpg',
    pdf: '/pdfs/instrumentos/tp-internos/ipsb-24.pdf',
  },
  {
    id: 'ipsb',
    name: 'IPSB',
    image: '/images/produtos/instrumentos/tp-internos/tp-interno-18.jpg',
    pdf: '/pdfs/instrumentos/tp-internos/ipsb.pdf',
  },
  {
    id: 'ips-2a',
    name: 'IPS-2A',
    image: '/images/produtos/instrumentos/tp-internos/tp-interno-20.jpg',
    pdf: '/pdfs/instrumentos/tp-internos/ips-2a.pdf',
  },
  {
    id: 'ipsa',
    name: 'IPSA',
    image: '/images/produtos/instrumentos/tp-internos/tp-interno-22.jpg',
    pdf: '/pdfs/instrumentos/tp-internos/ipsa.pdf',
  },
];


