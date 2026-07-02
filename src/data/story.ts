// ============================================================
// PREENCHA ESTE ARQUIVO COM OS SEUS DADOS ANTES DE PUBLICAR
// ============================================================

import photoManifest from 'virtual:photo-manifest'

export interface Moment {
  id: number
  photo: string
  date: string
  caption: string
}

export interface DatePhoto {
  src: string
  caption?: string   // omitir ou deixar vazio = sem legenda no polaroid
}

export interface WhatsAppStats {
  total: number
  media: number
  teAmo: number
  euTeAmo: number
  amor: number
  mor: number
  morTiago: number
  morTata: number
}

// ── Legendas por seção ───────────────────────────────────────
// Chave = nome do arquivo (ex: "1.webp"), valor = legenda
// Arquivos sem legenda ficam com string vazia

const swipeCaptions: Record<string, string> = {
  '1.webp': 'A foto que você ama',
  '2.webp': 'Meu primeiro grande ato de amor',
  '3.webp': 'Nossa viagenzinha com parada para sinuquinha',
  '4.webp': 'Seu beijo',
  '5.webp': 'Seu abraço',
  '6.webp': 'Até com cara de tonto',
  '7.webp': 'Eu amo minha linda muie',
  '8.webp': 'Mais da nossa viagem',
  '9.webp': 'Amo nós dois juntinhos',
  '10.webp': 'Sempre juntinhos',
  '11.webp': 'nhami nhami',
}

const puzzleCaptions: Record<string, string> = {
  '1.webp': 'Esse dia foi incrivel',
  '2.webp': 'Oia o peixão',
  '3.webp': 'O ano ta feliz como desejava?',
  '4.webp': 'Quer dizer alguma coisa?',
  '5.webp': 'Quando entendemos que só nós bastava',
  '6.webp': 'OIAA O ANEL FINALMENTE VEIO',
  '7.webp': 'Eu amei esse dia, por que você estava la',
  '8.webp': 'O jeito que voce me olha...',
  '9.webp': 'Titi e Tata aquáticos',
  '10.webp': 'Felizes no simples',
}

const missoshiroCaptions: Record<string, string> = {
  '1.webp': 'Desde esse dia eu sabia que ela nos escolheu',
  '2.webp': 'O conforto dela em seus braços',
  '3.webp': 'Tão lindinha',
  '4.webp': 'Tão curiosa',
  '5.webp': 'Ama mimir com a gente',
  '6.webp': 'Ama mimir com a gente',
  '7.webp': 'E começou a crescer',
  '8.webp': 'Ficar mais esperta',
  '9.webp': 'E amar a gente',
  '10.webp': 'E a gente amar ela',
  '11.webp': 'Sendo tão meiga, tao fofa',
  '12.webp': 'E sendo macaca',
  '13.webp': 'Ela é o nosso primeiro passo',
  '14.webp': 'O inicio da nossa familia',
}

const futureCaptions: Record<string, string> = {
  '1.webp': 'Risadas',
  '2.webp': 'Aventuras',
  '3.webp': 'Carinho',
  '4.webp': 'Amor',
  '5.webp': 'Felicidade',
  '6.webp': 'Reciprocidade',
  '7.webp': 'Amizade',
  '8.webp': 'Companheirismo',
  '9.webp': 'Gratidão',
  '10.webp': 'Segurança',
  '11.webp': 'Feliz no simples',
  '12.webp': 'Parceria'
}

const momentsCaptions: Record<string, { date: string; caption: string }> = {
  '1.webp': { date: 'Julho 2025',    caption: 'O começo de tudo...' },
  '2.webp': { date: 'Agosto 2025',   caption: 'Cada momento ao seu lado vale tudo.' },
  '3.webp': { date: 'Dezembro 2025', caption: 'Um ano de histórias que quero continuar escrevendo.' },
}

// ── Helper ────────────────────────────────────────────────────
function toPhotos(folder: string, captions: Record<string, string> = {}): DatePhoto[] {
  return (photoManifest[folder] ?? []).map(src => ({
    src,
    caption: captions[src.split('/').pop() ?? ''] ?? '',
  }))
}

// ── Story ─────────────────────────────────────────────────────
export const story = {
  girlfriend: 'Tata',
  startDate: new Date('2025-07-02T20:30:00'),
  startDateLabel: '02 de julho de 2025',

  // ── Config ───────────────────────────────────────────────────
  // Botão de atalho (só aparece em dev) que coleta todos os itens de uma vez,
  // pra pular a coleta durante testes. Deixe false para escondê-lo.
  showDevCollectAll: false,

  // Seção 01-date — polaroid inicial (usa o primeiro arquivo da pasta)
  firstPhoto: {
    src:     (photoManifest['01-date']?.[0]) ?? '/photos/01-date/first.webp',
    caption: '02 de julho de 2025',
  } as DatePhoto,

  // Seção 02-swipe — pilha arrastável (quantas fotos estiverem na pasta)
  datePhotos: toPhotos('02-swipe', swipeCaptions),

  // Seção 05: WhatsApp
  whatsappStats: {
    total:   134015,
    media:    20875,
    teAmo:     1326,
    euTeAmo:      0,
    amor:      7836,
    mor:       2565,
    morTiago:  2337,
    morTata:    228,
  } as WhatsAppStats,

  adventurePhotos: toPhotos('03-puzzle', puzzleCaptions),

  snapchatStreak: 706,

  // Seção 04-missoshiro
  missoshiroPhotos: toPhotos('04-missoshiro', missoshiroCaptions),

  // Seção 05-future
  futurePhotos: toPhotos('05-future', futureCaptions),

  // Momentos intercalados — adicione fotos em public/photos/moments/
  // e entradas em momentsCaptions acima
  moments: (photoManifest['moments'] ?? []).map((photo, i) => {
    const file = photo.split('/').pop() ?? ''
    const meta = momentsCaptions[file] ?? { date: '', caption: '' }
    return { id: i + 1, photo, ...meta }
  }) as Moment[],

  musicSrc: '/music/song.mp3',

  phrases: [
    'Você chegou na minha vida e fez tudo fazer sentido.',
    'Com você aprendi que amor é também amizade.',
    'Eu te escolho todos os dias.',
  ],

  // ── GRAN FINALE ──────────────────────────────────────────────
  // Texto final do Tiago — aparece depois da explosão de "eu te amo muito..."
  // ESCREVA AQUI o seu texto final:
  finalMessage:
    'Muito obrigado por ser essa pessoa incrivel que me faz tao feliz, torna minha vida tão leve, me mostra que nada é impossivel. Se eu pudesse voltar no tempo para o dia que decidi me permitir te amar, eu faria tudo igual. Esse ano foi incrível e que venha muitos outros, eu te amo muito e para sempre será...\ncomo se fala em inglês mesmo?\nYou and me',

  // Frase revelada quando ela clicar em "Coletar recompensa"
  // ESCREVA AQUI a frase da recompensa (ex.: uma pista pra ela olhar pra frente):
  rewardPhrase: 'Olhe para seu amor...',
}
