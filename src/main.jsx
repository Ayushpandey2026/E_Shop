import { BrowserRouter } from 'react-router-dom';
import ReactDOM from 'react-dom/client';

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Provider } from 'react-redux';
import {Store} from './redux/Store';
console.log('Store:', Store);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={Store}>
      <App />
    </Provider>
  </StrictMode>
);
