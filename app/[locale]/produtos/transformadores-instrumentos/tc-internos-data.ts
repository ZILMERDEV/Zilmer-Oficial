// Dados dos modelos de TC Internos
// Baseado nos modelos encontrados no site: ICJ-4, ICJ-5, ICJ-6, ICJ-10, ICJ-11, ICJ-13, ICJ-14, ICS, ICSJO, ICSJ, ICSA, ICSJ-7,2, ICSH, ICSDB, ICSG

export interface TCInternoModel {
  id: string;
  name: string;
  image: string;
  pdf?: string; // URL do PDF - adicionar quando disponível
}

export const tcInternosModels: TCInternoModel[] = [
  {
    id: 'icj-4',
    name: 'ICJ-4',
    image: '/images/produtos/instrumentos/tc-internos/tc-interno-2.jpg',
    pdf: '/pdfs/instrumentos/tc-internos/icj-4.pdf',
  },
  {
    id: 'icj-5',
    name: 'ICJ-5',
    image: '/images/produtos/instrumentos/tc-internos/tc-interno-4.jpg',
    pdf: '/pdfs/instrumentos/tc-internos/icj-5.pdf',
  },
  {
    id: 'icj-6',
    name: 'ICJ-6',
    image: '/images/produtos/instrumentos/tc-internos/tc-interno-6.jpg',
    pdf: '/pdfs/instrumentos/tc-internos/icj-6.pdf',
  },
  {
    id: 'icj-10',
    name: 'ICJ-10',
    image: '/images/produtos/instrumentos/tc-internos/tc-interno-8.jpg',
    pdf: '/pdfs/instrumentos/tc-internos/icj-10.pdf',
  },
  {
    id: 'icj-11',
    name: 'ICJ-11',
    image: '/images/produtos/instrumentos/tc-internos/tc-interno-10.jpg',
    pdf: '/pdfs/instrumentos/tc-internos/icj-11.pdf',
  },
  {
    id: 'icj-13',
    name: 'ICJ-13',
    image: '/images/produtos/instrumentos/tc-internos/tc-interno-12.jpg',
    pdf: '/pdfs/instrumentos/tc-internos/icj-13.pdf',
  },
  {
    id: 'icj-14',
    name: 'ICJ-14',
    image: '/images/produtos/instrumentos/tc-internos/tc-interno-14.jpg',
    pdf: '/pdfs/instrumentos/tc-internos/icj-14.pdf',
  },
  {
    id: 'ics',
    name: 'ICS',
    image: '/images/produtos/instrumentos/tc-internos/tc-interno-16.jpg',
    pdf: '/pdfs/instrumentos/tc-internos/ics.pdf',
  },
  {
    id: 'icsjo',
    name: 'ICSJO',
    image: '/images/produtos/instrumentos/tc-internos/tc-interno-18.jpg',
    pdf: '/pdfs/instrumentos/tc-internos/icsjo.pdf',
  },
  {
    id: 'icsj',
    name: 'ICSJ',
    image: '/images/produtos/instrumentos/tc-internos/tc-interno-20.jpg',
    pdf: '/pdfs/instrumentos/tc-internos/icsj.pdf',
  },
  {
    id: 'icsa',
    name: 'ICSA',
    image: '/images/produtos/instrumentos/tc-internos/tc-interno-22.jpg',
    pdf: '/pdfs/instrumentos/tc-internos/icsa.pdf',
  },
  {
    id: 'icsj-72',
    name: 'ICSJ-7.2',
    image: '/images/produtos/instrumentos/tc-internos/tc-interno-24.jpg',
    pdf: '/pdfs/instrumentos/tc-internos/icsj-7.2.pdf',
  },
  {
    id: 'icsh',
    name: 'ICSH',
    image: '/images/produtos/instrumentos/tc-internos/tc-interno-26.jpg',
    pdf: '/pdfs/instrumentos/tc-internos/icsh.pdf',
  },
  {
    id: 'icsdb',
    name: 'ICSDB',
    image: '/images/produtos/instrumentos/tc-internos/tc-interno-28.jpg',
    pdf: '/pdfs/instrumentos/tc-internos/icsdb.pdf',
  },
  {
    id: 'icsg',
    name: 'ICSG',
    image: '/images/produtos/instrumentos/tc-internos/tc-interno-30.jpg',
    pdf: '/pdfs/instrumentos/tc-internos/icsg.pdf',
  },
];

