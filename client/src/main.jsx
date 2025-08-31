import ReactDOM from 'react-dom/client'; // lets you render React into the DOM
import { StrictMode } from 'react';// enables extra checks in dev
import { BrowserRouter } from 'react-router-dom'; //// enables routing
import './index.css'
import App from './App.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(

  <StrictMode>
    <BrowserRouter>
    <App />
    </BrowserRouter>
  </StrictMode>

); 
