import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import { Toaster } from 'sonner';
import i18n from './i18n';
import { store } from './store';
import App from './App';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <I18nextProvider i18n={i18n}>
        <BrowserRouter>
          <App />
          <Toaster position="top-center" richColors />
        </BrowserRouter>
      </I18nextProvider>
    </Provider>
  </StrictMode>,
);
