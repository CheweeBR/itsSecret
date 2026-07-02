import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import App from './App.tsx'
import './index.css'

// Impede o navegador de restaurar o scroll da sessão anterior ao recarregar —
// garante que a experiência sempre comece no topo (Hero) e que as animações de
// revelar-ao-rolar disparem no momento certo, em vez de "gastarem" no load.
if ('scrollRestoration' in history) history.scrollRestoration = 'manual'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
