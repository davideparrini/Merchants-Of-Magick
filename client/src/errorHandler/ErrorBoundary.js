import React, { Component } from "react";
import { useNavigate } from "react-router-dom"; // Importa useNavigate

// Componente Error Boundary
class ErrorBoundary extends Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // Qui puoi anche loggare l'errore su un servizio esterno se necessario
    console.error("Errore catturato da Error Boundary:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return <RedirectToErrorPage />;
    }

    return this.props.children;
  }
}

// Componente che effettua il reindirizzamento
const RedirectToErrorPage = () => {
  const navigate = useNavigate(); // Usa useNavigate per il reindirizzamento

  React.useEffect(() => {
    navigate("/"); // Naviga alla pagina di errore
  }, [navigate]);

  return null; // Non renderizza nulla mentre aspetti il reindirizzamento
};

export default ErrorBoundary;
