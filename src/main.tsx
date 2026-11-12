import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import TvApp from './TvApp.tsx';
import './index.css';

const isTvMode =
  import.meta.env.VITE_TV_MODE === '1' ||
  new URLSearchParams(window.location.search).get('tv') === '1';

createRoot(document.getElementById('root')!).render(isTvMode ? <TvApp /> : <App />);
