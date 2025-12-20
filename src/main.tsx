import './styles/index.css'

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ThemeProvider } from './components/layout'
import { Toaster } from './components/ui'
import { Dialogue } from './talking-box'

createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <ThemeProvider defaultTheme='light' storageKey='vite-ui-theme'>
      <Toaster />
      <Dialogue />
    </ThemeProvider>
  </StrictMode>,
)
