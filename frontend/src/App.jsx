import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import AuthPage from "./Components/Auth/AuthPage";
import Dashboard from "./components/Auth/Dashboard";
import ProtectedRoute from "./components/Auth/ProtectedRoute";
import Home from "./Components/pages/Home";
import { AuthContext } from "./context/AuthContext";
import { useContext } from "react";
function App() {
  const { user } = useContext(AuthContext);
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={user ? <Home /> : <Navigate to="/login" replace />}
        />
        <Route path="/login" element={<AuthPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
