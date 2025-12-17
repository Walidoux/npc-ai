import './index.css'

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Dialogue } from './talking-box.tsx'

createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <Dialogue />
  </StrictMode>
)
