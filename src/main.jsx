import React from 'react';
import { hydrateRoot, createRoot } from 'react-dom/client';
import App from './App.jsx';
import './style.css';
const root = document.getElementById('root');
root.hasChildNodes() ? hydrateRoot(root, <App />) : createRoot(root).render(<App />);
