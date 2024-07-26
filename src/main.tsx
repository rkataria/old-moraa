/* eslint-disable import/no-extraneous-dependencies */
import React from 'react'

import ReactDOM from 'react-dom/client'

// Load fonts
import '@fontsource-variable/outfit'

import { App } from './App.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
