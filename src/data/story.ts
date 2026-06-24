// ============================================================
// PREENCHA ESTE ARQUIVO COM OS SEUS DADOS ANTES DE PUBLICAR
// ============================================================

export interface Moment {
  id: number
  photo: string        // caminho relativo a /public, ex: "/photos/praia.jpg"
  date: string         // ex: "Julho 2024"
  caption: string      // legenda curta do momento
}

export const story = {
  // Nome da sua namorada (aparece no Hero e no modal final)
  girlfriend: 'Amor',

  // Data exata de início do relacionamento
  startDate: new Date('2025-07-02T22:00:00'),

  // Data formatada por extenso para exibição
  startDateLabel: '02 de julho de 2025',

  // Momentos especiais (coloque as fotos em public/photos/)
  moments: [
    {
      id: 1,
      photo: '/photos/momento1.jpg',
      date: 'Julho 2024',
      caption: 'O começo de tudo...',
    },
    {
      id: 2,
      photo: '/photos/momento2.jpg',
      date: 'Agosto 2024',
      caption: 'Cada momento ao seu lado vale tudo.',
    },
    {
      id: 3,
      photo: '/photos/momento3.jpg',
      date: 'Dezembro 2024',
      caption: 'Um ano de histórias que quero continuar escrevendo.',
    },
  ] as Moment[],

  // Frases de amor (aparecem como seções grandes entre os momentos)
  phrases: [
    'Você chegou na minha vida e fez tudo fazer sentido.',
    'Com você aprendi que amor é também amizade.',
    'Eu te escolho todos os dias.',
  ],

  // Mensagem surpresa que aparece após ela clicar em "Sim"
  surpriseMessage:
    'Obrigado por cada dia, cada risada e cada abraço. Você é a melhor coisa que aconteceu na minha vida. Te amo demais! 💛',
}
