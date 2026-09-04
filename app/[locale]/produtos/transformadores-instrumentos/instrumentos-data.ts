// Catálogo de Transformadores para Instrumentos (TC/TP), reorganizado por
// tipo > uso > classe de tensão. Classe de tensão vem do campo "Um" da
// ficha técnica de cada modelo (não existia nos dados antigos — foi extraída
// PDF por PDF). Ver memory/CHANGELOG.md ou o commit desta mudança para o
// histórico da extração e das correções abaixo.
//
// Correções aplicadas em relação aos 4 arquivos antigos (tc/tp-internos/
// externos-data.ts), a partir do conteúdo real de cada PDF:
//   - "icj-1" (antes em TC Externo) é na verdade a ficha do ICSJ-1, um
//     produto Interno de baixa tensão — realocado para TC Interno, nome
//     corrigido para "ICSJ-1" (id mantido para não quebrar referências).
//   - "ipsg-ff" de TP Interno tinha PDF de um produto Externo (IPSGE-FF),
//     duplicando o "ipsg-ff" que já existia em TP Externo — removido daqui.
//   - "ipsg-ff" de TP Externo também abre como "IPSGE-FF" — nome corrigido,
//     mantido como o único registro real deste produto.
//   - "ipsae-36" (TP Externo) não tem ficha própria: o PDF vinculado é do
//     ipsae-ff (24,2kV), não existe datasheet de uma versão 36kV. Removido
//     do catálogo até uma ficha real ser enviada.
//   - "icsj-72" (ICSJ-7.2) é 7,2kV, não 15kV — tinha caído na faixa "15kv"
//     por estar dentro do range "15kV e abaixo" que existia antes. Essa
//     faixa foi abandonada a pedido do usuário; agora tem classe própria.

export type Tipo = 'tc' | 'tp'
export type Uso = 'interno' | 'externo'
export type Classe = 'baixa-tensao' | '7.2kv' | '15kv' | '24kv' | '36kv'

export interface ModeloInstrumento {
  id: string
  name: string
  tipo: Tipo
  uso: Uso
  classe: Classe
  image: string
  pdf: string
}

export const modelosInstrumentos: ModeloInstrumento[] = [
  // ── TC Interno ──────────────────────────────────────────────────────
  { id: 'icj-4', name: 'ICJ-4', tipo: 'tc', uso: 'interno', classe: 'baixa-tensao', image: '/images/produtos/instrumentos/tc-internos/tc-interno-2.jpg', pdf: '/pdfs/instrumentos/tc-internos/icj-4.pdf' },
  { id: 'icj-5', name: 'ICJ-5', tipo: 'tc', uso: 'interno', classe: 'baixa-tensao', image: '/images/produtos/instrumentos/tc-internos/tc-interno-4.jpg', pdf: '/pdfs/instrumentos/tc-internos/icj-5.pdf' },
  { id: 'icj-6', name: 'ICJ-6', tipo: 'tc', uso: 'interno', classe: 'baixa-tensao', image: '/images/produtos/instrumentos/tc-internos/tc-interno-6.jpg', pdf: '/pdfs/instrumentos/tc-internos/icj-6.pdf' },
  { id: 'icj-10', name: 'ICJ-10', tipo: 'tc', uso: 'interno', classe: 'baixa-tensao', image: '/images/produtos/instrumentos/tc-internos/tc-interno-8.jpg', pdf: '/pdfs/instrumentos/tc-internos/icj-10.pdf' },
  { id: 'icj-11', name: 'ICJ-11', tipo: 'tc', uso: 'interno', classe: 'baixa-tensao', image: '/images/produtos/instrumentos/tc-internos/tc-interno-10.jpg', pdf: '/pdfs/instrumentos/tc-internos/icj-11.pdf' },
  { id: 'icj-13', name: 'ICJ-13', tipo: 'tc', uso: 'interno', classe: 'baixa-tensao', image: '/images/produtos/instrumentos/tc-internos/tc-interno-12.jpg', pdf: '/pdfs/instrumentos/tc-internos/icj-13.pdf' },
  { id: 'icj-14', name: 'ICJ-14', tipo: 'tc', uso: 'interno', classe: 'baixa-tensao', image: '/images/produtos/instrumentos/tc-internos/tc-interno-14.jpg', pdf: '/pdfs/instrumentos/tc-internos/icj-14.pdf' },
  { id: 'ics', name: 'ICS', tipo: 'tc', uso: 'interno', classe: 'baixa-tensao', image: '/images/produtos/instrumentos/tc-internos/tc-interno-16.jpg', pdf: '/pdfs/instrumentos/tc-internos/ics.pdf' },
  { id: 'icsjo', name: 'ICSJO', tipo: 'tc', uso: 'interno', classe: 'baixa-tensao', image: '/images/produtos/instrumentos/tc-internos/tc-interno-18.jpg', pdf: '/pdfs/instrumentos/tc-internos/icsjo.pdf' },
  { id: 'icsj', name: 'ICSJ', tipo: 'tc', uso: 'interno', classe: 'baixa-tensao', image: '/images/produtos/instrumentos/tc-internos/tc-interno-20.jpg', pdf: '/pdfs/instrumentos/tc-internos/icsj.pdf' },
  { id: 'icj-1', name: 'ICSJ-1', tipo: 'tc', uso: 'interno', classe: 'baixa-tensao', image: '/images/produtos/instrumentos/tc-externos/tc-externo-2.jpg', pdf: '/pdfs/instrumentos/tc-externos/icj-1.pdf' },
  { id: 'icsj-72', name: 'ICSJ-7.2', tipo: 'tc', uso: 'interno', classe: '7.2kv', image: '/images/produtos/instrumentos/tc-internos/tc-interno-24.jpg', pdf: '/pdfs/instrumentos/tc-internos/icsj-7.2.pdf' },
  { id: 'icsh', name: 'ICSH', tipo: 'tc', uso: 'interno', classe: '15kv', image: '/images/produtos/instrumentos/tc-internos/tc-interno-26.jpg', pdf: '/pdfs/instrumentos/tc-internos/icsh.pdf' },
  { id: 'icsdb', name: 'ICSDB', tipo: 'tc', uso: 'interno', classe: '15kv', image: '/images/produtos/instrumentos/tc-internos/tc-interno-28.jpg', pdf: '/pdfs/instrumentos/tc-internos/icsdb.pdf' },
  { id: 'icsg', name: 'ICSG', tipo: 'tc', uso: 'interno', classe: '15kv', image: '/images/produtos/instrumentos/tc-internos/tc-interno-30.jpg', pdf: '/pdfs/instrumentos/tc-internos/icsg.pdf' },
  { id: 'icsa', name: 'ICSA', tipo: 'tc', uso: 'interno', classe: '36kv', image: '/images/produtos/instrumentos/tc-internos/tc-interno-22.jpg', pdf: '/pdfs/instrumentos/tc-internos/icsa.pdf' },

  // ── TC Externo ──────────────────────────────────────────────────────
  { id: 'icse-1', name: 'ICSE-1', tipo: 'tc', uso: 'externo', classe: '15kv', image: '/images/produtos/instrumentos/tc-externos/tc-externo-4.jpg', pdf: '/pdfs/instrumentos/tc-externos/icse-1.pdf' },
  { id: 'icse-2', name: 'ICSE-2', tipo: 'tc', uso: 'externo', classe: '24kv', image: '/images/produtos/instrumentos/tc-externos/tc-externo-6.jpg', pdf: '/pdfs/instrumentos/tc-externos/icse-2.pdf' },
  { id: 'icse-3', name: 'ICSE-3', tipo: 'tc', uso: 'externo', classe: '24kv', image: '/images/produtos/instrumentos/tc-externos/tc-externo-8.jpg', pdf: '/pdfs/instrumentos/tc-externos/icse-3.pdf' },
  { id: 'icse-4', name: 'ICSE-4', tipo: 'tc', uso: 'externo', classe: '36kv', image: '/images/produtos/instrumentos/tc-externos/tc-externo-10.jpg', pdf: '/pdfs/instrumentos/tc-externos/icse-4.pdf' },
  { id: 'icse-5', name: 'ICSE-5', tipo: 'tc', uso: 'externo', classe: '36kv', image: '/images/produtos/instrumentos/tc-externos/tc-externo-12.jpg', pdf: '/pdfs/instrumentos/tc-externos/icse-5.pdf' },
  { id: 'icse-6', name: 'ICSE-6', tipo: 'tc', uso: 'externo', classe: '36kv', image: '/images/produtos/instrumentos/tc-externos/tc-externo-14.jpg', pdf: '/pdfs/instrumentos/tc-externos/icse-6.pdf' },
  { id: 'icse-7', name: 'ICSE-7', tipo: 'tc', uso: 'externo', classe: '36kv', image: '/images/produtos/instrumentos/tc-externos/tc-externo-16.jpg', pdf: '/pdfs/instrumentos/tc-externos/icse-7.pdf' },
  { id: 'icse-8', name: 'ICSE-8', tipo: 'tc', uso: 'externo', classe: '36kv', image: '/images/produtos/instrumentos/tc-externos/tc-externo-18.jpg', pdf: '/pdfs/instrumentos/tc-externos/icse-8.pdf' },
  { id: 'icse-9', name: 'ICSE-9', tipo: 'tc', uso: 'externo', classe: '36kv', image: '/images/produtos/instrumentos/tc-externos/tc-externo-20.jpg', pdf: '/pdfs/instrumentos/tc-externos/icse-9.pdf' },
  { id: 'icse-10', name: 'ICSE-10', tipo: 'tc', uso: 'externo', classe: '36kv', image: '/images/produtos/instrumentos/tc-externos/tc-externo-22.jpg', pdf: '/pdfs/instrumentos/tc-externos/icse-10.pdf' },

  // ── TP Interno ──────────────────────────────────────────────────────
  { id: 'ips-2a', name: 'IPS-2A', tipo: 'tp', uso: 'interno', classe: 'baixa-tensao', image: '/images/produtos/instrumentos/tp-internos/tp-interno-20.jpg', pdf: '/pdfs/instrumentos/tp-internos/ips-2a.pdf' },
  { id: 'ipsh', name: 'IPSH', tipo: 'tp', uso: 'interno', classe: '15kv', image: '/images/produtos/instrumentos/tp-internos/tp-interno-4.jpg', pdf: '/pdfs/instrumentos/tp-internos/ipsh.pdf' },
  { id: 'ipsbf', name: 'IPSBF', tipo: 'tp', uso: 'interno', classe: '15kv', image: '/images/produtos/instrumentos/tp-internos/tp-interno-6.jpg', pdf: '/pdfs/instrumentos/tp-internos/ipsbf.pdf' },
  { id: 'ipsg-ft', name: 'IPSG-FT', tipo: 'tp', uso: 'interno', classe: '15kv', image: '/images/produtos/instrumentos/tp-internos/tp-interno-8.jpg', pdf: '/pdfs/instrumentos/tp-internos/ipsg-ft.pdf' },
  { id: 'ipsgf', name: 'IPSGF', tipo: 'tp', uso: 'interno', classe: '15kv', image: '/images/produtos/instrumentos/tp-internos/tp-interno-12.jpg', pdf: '/pdfs/instrumentos/tp-internos/ipsgf.pdf' },
  { id: 'ipsb', name: 'IPSB', tipo: 'tp', uso: 'interno', classe: '15kv', image: '/images/produtos/instrumentos/tp-internos/tp-interno-18.jpg', pdf: '/pdfs/instrumentos/tp-internos/ipsb.pdf' },
  { id: 'ipsb-24', name: 'IPSB-24', tipo: 'tp', uso: 'interno', classe: '24kv', image: '/images/produtos/instrumentos/tp-internos/tp-interno-16.jpg', pdf: '/pdfs/instrumentos/tp-internos/ipsb-24.pdf' },
  { id: 'ipsa', name: 'IPSA', tipo: 'tp', uso: 'interno', classe: '24kv', image: '/images/produtos/instrumentos/tp-internos/tp-interno-22.jpg', pdf: '/pdfs/instrumentos/tp-internos/ipsa.pdf' },
  { id: 'ipsk', name: 'IPSK', tipo: 'tp', uso: 'interno', classe: '36kv', image: '/images/produtos/instrumentos/tp-internos/tp-interno-2.jpg', pdf: '/pdfs/instrumentos/tp-internos/ipsk.pdf' },
  { id: 'ipsd', name: 'IPSD', tipo: 'tp', uso: 'interno', classe: '36kv', image: '/images/produtos/instrumentos/tp-internos/tp-interno-14.jpg', pdf: '/pdfs/instrumentos/tp-internos/ipsd.pdf' },

  // ── TP Externo ──────────────────────────────────────────────────────
  { id: 'ipsge-ft', name: 'IPSGE-FT', tipo: 'tp', uso: 'externo', classe: '15kv', image: '/images/produtos/instrumentos/tp-externos/tp-externo-2.jpg', pdf: '/pdfs/instrumentos/tp-externos/ipsge-ft.pdf' },
  { id: 'ipse', name: 'IPSE', tipo: 'tp', uso: 'externo', classe: '15kv', image: '/images/produtos/instrumentos/tp-externos/tp-externo-6.jpg', pdf: '/pdfs/instrumentos/tp-externos/ipse.pdf' },
  { id: 'ipsg-ff', name: 'IPSGE-FF', tipo: 'tp', uso: 'externo', classe: '15kv', image: '/images/produtos/instrumentos/tp-externos/tp-externo-14.jpg', pdf: '/pdfs/instrumentos/tp-externos/ipsg-ff.pdf' },
  { id: 'ipsae-ff', name: 'IPSAE-FF', tipo: 'tp', uso: 'externo', classe: '24kv', image: '/images/produtos/instrumentos/tp-externos/tp-externo-10.jpg', pdf: '/pdfs/instrumentos/tp-externos/ipsae-ff.pdf' },
  { id: 'ipsde-ft', name: 'IPSDE-FT', tipo: 'tp', uso: 'externo', classe: '36kv', image: '/images/produtos/instrumentos/tp-externos/tp-externo-8.jpg', pdf: '/pdfs/instrumentos/tp-externos/ipsde-ft.pdf' },
]

export const CLASSES: Classe[] = ['baixa-tensao', '7.2kv', '15kv', '24kv', '36kv']
export const TIPOS: Tipo[] = ['tc', 'tp']
export const USOS: Uso[] = ['interno', 'externo']
