import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './styles/global.css'
import './styles/AdminPage.css'    // ← இதை add பண்ணு
import './styles/LoginPage.css'    // ← இதை add பண்ணு
import './styles/StudentPage.css'  // ← இதை add பண்ணு

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)