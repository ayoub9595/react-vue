// App.tsx
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { ReactNode, useEffect, useState } from "react";
import Login from "./pages/login/Login";
import Home from "./pages/home/Home";
import "./App.module.css";

import LoadingSpinner from "./components/loadingSpinner/LoadingSpinner";

interface ProtectedRouteProps {
  children: ReactNode;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const ProtectedRoute = ({ children, isAuthenticated, isLoading }: ProtectedRouteProps): JSX.Element => {
  if (isLoading) {
    return <LoadingSpinner />;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initial auth check
    const token = localStorage.getItem('accessToken');
    if (token) {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route 
          path="/" 
          element={
            isAuthenticated ? 
              <Navigate to="/home" replace /> : 
              <Login onLoginSuccess={() => {
                setIsAuthenticated(true);
                setIsLoading(false);
              }} />
          } 
        />
        <Route
          path="/home"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated} isLoading={isLoading}>
              <Home setIsAuthenticated={setIsAuthenticated} />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};
export default App;