import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Auth/Login";
import SignUp from "./pages/Auth/SignUp";
import Home from "./pages/Dashboard/Home";
import Income from "./pages/Dashboard/Income";
import Expense from "./pages/Dashboard/Expense";
import { useUser } from "./context/UserContext";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Root />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/dashboard" element={<ProtectedRoute component={<Home />} />} />
        <Route path="/income" element={<ProtectedRoute component={<Income />} />} />
        <Route path="/expense" element={<ProtectedRoute component={<Expense />} />} />
      </Routes>
    </Router>
  );
};

export default App;

const Root = () => {
  const isAuthenticated = !!localStorage.getItem("token");
  return isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />;
};

const ProtectedRoute = ({ component }) => {
  const { loading } = useUser();
  const isAuthenticated = !!localStorage.getItem("token");

  if (loading) {
    return <div className="p-10 text-slate-600">Loading...</div>;
  }

  return isAuthenticated ? component : <Navigate to="/login" />;
};

