import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

Notification.requestPermission(permission => {
    if (permission === 'granted') {
  
    }
    else console.error("Permission was not granted.")
  })


  
const root = ReactDOM.createRoot(document.getElementById('root'));


window.onerror = function (message, source, lineno, colno, error) {
    console.error("Errore globale catturato:", message, error);
    // window.location.href = "/"; 
};
  
window.addEventListener("unhandledrejection", (event) => {
    console.error("Promise rifiutata senza gestione:", event.reason);
    // window.location.href = "/";
});
  

root.render(
    <React.StrictMode>
        <BrowserRouter>
            <App/>
        </BrowserRouter>        
    </React.StrictMode>
);



// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.register();