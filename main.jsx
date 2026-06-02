import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx' // Mengimpor App.jsx dari root folder
import './index.css'     // Mengimpor index.css dari root folder

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
