import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Esegue un useEffect solo se l'utente è sulla pagina specificata.
 * @param {string} path - La pagina in cui deve attivarsi l'effetto (es. "/dashboard")
 * @param {Function} callback - La funzione da eseguire quando l'utente è sulla pagina
 * @param {Array} deps - Dipendenze opzionali per il useEffect
 */
const useEffectOnPage = (path, callback, deps = []) => {
    const location = useLocation();

    useEffect(() => {
        if (location.pathname.startsWith(path)) {
            callback();
        }
    }, [location.pathname, ...deps]); // L'effetto si esegue solo se siamo nella pagina specificata
};

export default useEffectOnPage;
